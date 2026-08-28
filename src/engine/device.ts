import {
  bindQuad,
  createGL,
  createTarget,
  createTexture,
  program,
  Uniforms,
  uploadImage,
  type Target,
} from "./gl";
import { FEEDBACK_FRAG, PRESENT_FRAG, VERT } from "./shaders";
import { defaultState, type DeviceState, type LoopState } from "./state";

const DELAY_LEN = 8;

type LoopGpu = {
  ring: Target[];
  write: number;
};

function resPair(r: DeviceState["resolution"]): [number, number] {
  if (r === 540) return [960, 540];
  if (r === 1080) return [1920, 1080];
  return [1280, 720];
}

export class DigitalHerder {
  readonly gl: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement;
  state: DeviceState = defaultState();

  private feedback: WebGLProgram;
  private present: WebGLProgram;
  private uF: Uniforms;
  private uP: Uniforms;
  private vaoF: WebGLVertexArrayObject;
  private vaoP: WebGLVertexArrayObject;
  private A: LoopGpu;
  private B: LoopGpu;
  private C: LoopGpu;
  private seedTex: WebGLTexture;
  private w = 1280;
  private h = 720;
  private lastPresent = 0;
  private phase = 0;
  private seedAmtA = 0;
  private seedAmtB = 0;
  private seedAmtC = 0;
  private quantOn = false;
  private quantT0 = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = createGL(canvas);
    this.feedback = program(this.gl, VERT, FEEDBACK_FRAG);
    this.present = program(this.gl, VERT, PRESENT_FRAG);
    this.uF = new Uniforms(this.gl, this.feedback);
    this.uP = new Uniforms(this.gl, this.present);
    this.vaoF = bindQuad(this.gl, this.feedback);
    this.vaoP = bindQuad(this.gl, this.present);
    this.seedTex = createTexture(this.gl);
    this.A = this.makeLoop();
    this.B = this.makeLoop();
    this.C = this.makeLoop(2);
    this.resize(this.state.resolution);
  }

  private makeLoop(n = DELAY_LEN): LoopGpu {
    const ring: Target[] = [];
    for (let i = 0; i < n; i++) ring.push(createTarget(this.gl, this.w || 1280, this.h || 720));
    return { ring, write: 0 };
  }

  resize(res: DeviceState["resolution"]): void {
    const [w, h] = resPair(res);
    this.state.resolution = res;
    if (w === this.w && h === this.h && this.A.ring.length) return;
    this.w = w;
    this.h = h;
    const rebuild = (n: number): LoopGpu => {
      const ring: Target[] = [];
      for (let i = 0; i < n; i++) ring.push(createTarget(this.gl, w, h));
      return { ring, write: 0 };
    };
    this.A = rebuild(DELAY_LEN);
    this.B = rebuild(DELAY_LEN);
    this.C = rebuild(2);
    this.clear();
  }

  setSeed(source: TexImageSource): void {
    uploadImage(this.gl, this.seedTex, source);
  }

  clear(): void {
    const gl = this.gl;
    for (const loop of [this.A, this.B, this.C]) {
      for (const t of loop.ring) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.viewport(0, 0, this.w, this.h);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      loop.write = 0;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  trap(which: "A" | "B" | "C" | "all" = "all"): void {
    const cut = (L: LoopState, pulse: (v: number) => void) => {
      if (L.bottomSrc === 0) {
        L.bottomSrc = 1;
        pulse(0.85);
      } else {
        L.bottomSrc = 0;
      }
    };
    if (which === "A" || which === "all") cut(this.state.A, (v) => (this.seedAmtA = v));
    if (which === "B" || which === "all") cut(this.state.B, (v) => (this.seedAmtB = v));
    if (which === "C" || which === "all") cut(this.state.C, (v) => (this.seedAmtC = v));
  }

  inject(amount = 0.7): void {
    this.seedAmtA = Math.max(this.seedAmtA, amount);
    this.seedAmtB = Math.max(this.seedAmtB, amount);
    this.seedAmtC = Math.max(this.seedAmtC, amount);
  }

  tick(now: number): void {
    if (this.state.frozen) {
      this.drawPresent();
      return;
    }
    const minDt = 1000 / this.state.fps;
    if (now - this.lastPresent < minDt * 0.85 && this.lastPresent !== 0) {
      this.drawPresent();
      return;
    }
    this.lastPresent = now;
    this.phase += 1;

    if (this.state.quantize) {
      const beat = 60000 / Math.max(this.state.bpm, 1);
      const period = beat * Math.max(this.state.period, 0.05);
      const cut = period * Math.min(this.state.cutLen, 0.95);
      if (this.quantT0 === 0) this.quantT0 = now;
      const t = (now - this.quantT0) % period;
      const on = t < cut;
      if (on !== this.quantOn) {
        this.quantOn = on;
        this.trap("A");
        this.trap("B");
      }
    }

    if (this.state.linkedRods) {
      this.state.B.zoom = this.state.A.zoom;
      this.state.B.rotate = -this.state.A.rotate;
      this.state.B.panX = this.state.A.panX;
      this.state.B.panY = this.state.A.panY;
      this.state.B.spin = -this.state.A.spin;
    }
    this.state.A.rotate += this.state.A.spin * 0.016;
    this.state.B.rotate += this.state.B.spin * 0.016;
    this.state.C.rotate += this.state.C.spin * 0.016;

    const otherA = this.readTex(this.B, 1);
    const otherB = this.readTex(this.A, 1);
    this.renderLoop(this.A, this.state.A, otherA, this.seedAmtA, this.state.insanity);
    this.renderLoop(this.B, this.state.B, otherB, this.seedAmtB, this.state.insanity);
    this.renderLoop(this.C, this.state.C, this.readTex(this.A, 1), this.seedAmtC, false);

    const floor = this.state.seedAmt;
    this.seedAmtA = Math.max(this.seedAmtA * 0.92, floor);
    this.seedAmtB = Math.max(this.seedAmtB * 0.92, floor);
    this.seedAmtC = Math.max(this.seedAmtC * 0.92, floor);

    this.drawPresent();
  }

  private readTex(loop: LoopGpu, back: number): WebGLTexture {
    const n = loop.ring.length;
    const i = (loop.write - back + n) % n;
    return loop.ring[i].tex;
  }

  private renderLoop(
    gpu: LoopGpu,
    L: LoopState,
    other: WebGLTexture,
    seedPulse: number,
    insanity: boolean,
  ): void {
    const gl = this.gl;
    const n = gpu.ring.length;
    const prev = this.readTex(gpu, 1);
    const delayN = Math.min(Math.max(Math.round(L.delayFrames), 1), n - 1);
    const delay = this.readTex(gpu, delayN);
    const dst = gpu.ring[gpu.write];

    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
    gl.viewport(0, 0, this.w, this.h);
    gl.useProgram(this.feedback);
    gl.bindVertexArray(this.vaoF);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, prev);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, delay);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, other);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.seedTex);

    const u = this.uF;
    u.i("uPrev", 0);
    u.i("uDelay", 1);
    u.i("uOther", 2);
    u.i("uSeed", 3);
    u.v2("uRes", this.w, this.h);
    u.f("uTime", this.phase / 60);
    u.f("uZoom", L.zoom);
    u.f("uRotate", L.rotate);
    u.v2("uPan", L.panX, L.panY);
    u.f("uGlassMix", L.glassMix);
    u.f("uCopyRotate", L.copyRotate);
    u.f("uCopyScale", L.copyScale);
    u.v2("uCopyOffset", L.copyOffX, L.copyOffY);
    u.f("uFolds", L.folds);
    u.f("uKaleido", this.state.kaleido);
    u.f("uHue", L.top.hue);
    u.f("uSat", L.top.sat);
    u.f("uBright", L.top.bright);
    u.f("uContrast", L.top.contrast);
    u.f("uGamma", this.state.gamma);
    u.f("uHue2", L.bot.hue);
    u.f("uSat2", L.bot.sat);
    u.f("uBright2", L.bot.bright);
    u.f("uContrast2", L.bot.contrast);
    u.f("uNoise", this.state.noise);
    u.f("uAberration", this.state.aberration);
    u.f("uPersist", this.state.persist);
    u.f("uDecay", this.state.decay);
    u.f("uBarrel", this.state.barrel);
    u.f("uEdge", this.state.edge);
    u.f("uHueDrift", this.state.hueDrift);
    u.f("uSeedAmt", this.state.seedAmt);
    u.f("uSeedPulse", seedPulse);
    u.f("uOtherAmt", insanity ? this.state.otherAmt : 0);
    u.f("uDelayAmt", L.delayFrames > 0 ? L.delayMix : 0);
    u.f("uSoft", this.state.soft);
    u.f("uBloom", this.state.bloom);
    u.f("uSmear", this.state.smear);
    u.f("uPhase", this.phase);
    u.f("uWarp", this.state.warp);
    u.f("uPoster", this.state.poster);
    u.f("uInvert", this.state.invert);
    u.f("uChromaSep", this.state.chromaSep);
    u.f("uFeedbackAmt", this.state.feedbackAmt);
    u.f("uCopyFalloff", this.state.copyFalloff);
    u.i("uFlipH", L.flipH ? 1 : 0);
    u.i("uFlipV", L.flipV ? 1 : 0);
    u.i("uKeyMode", this.state.keyMode);
    u.f("uKeyClip", this.state.keyClip);
    u.f("uKeyGain", this.state.keyGain);
    u.v3("uKeyColor", this.state.keyColor[0], this.state.keyColor[1], this.state.keyColor[2]);
    const bottom = insanity && L.bottomSrc !== 0 ? 2 : L.bottomSrc;
    u.i("uBottomSrc", bottom);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gpu.write = (gpu.write + 1) % n;
  }

  private drawPresent(): void {
    const gl = this.gl;
    const { width, height } = this.canvas;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.useProgram(this.present);
    gl.bindVertexArray(this.vaoP);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.readTex(this.A, 1));
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.readTex(this.B, 1));
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.readTex(this.C, 1));
    this.uP.i("uA", 0);
    this.uP.i("uB", 1);
    this.uP.i("uC", 2);
    this.uP.i("uView", this.state.view);
    this.uP.f("uScan", this.state.scan);
    this.uP.f("uVignette", this.state.vignette);
    this.uP.f("uMixAB", this.state.mixAB);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
