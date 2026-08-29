import type { DeviceState } from "./state";
import type { HomePose } from "./evolve";

export type Bands = {
  rms: number;
  bass: number;
  mid: number;
  high: number;
  kick: boolean;
};

const SILENT: Bands = { rms: 0, bass: 0, mid: 0, high: 0, kick: false };

function clamp(n: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, n));
}

function mean(data: Uint8Array, lo: number, hi: number): number {
  let s = 0;
  const a = Math.max(0, lo);
  const b = Math.min(data.length - 1, hi);
  if (b < a) return 0;
  for (let i = a; i <= b; i++) s += data[i];
  return s / (b - a + 1) / 255;
}

/** Mic or a dropped song. Bass herds Scale/smear, kicks inject light. */
export class Ear {
  live = false;
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: AudioNode | null = null;
  private stream: MediaStream | null = null;
  private el: HTMLAudioElement | null = null;
  private freq = new Uint8Array(1024);
  private time = new Uint8Array(2048);
  private prevBass = 0;
  private kickAt = 0;

  private async graph(): Promise<AnalyserNode> {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") await this.ctx.resume();
    if (!this.analyser) {
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.55;
      this.freq = new Uint8Array(this.analyser.frequencyBinCount);
      this.time = new Uint8Array(this.analyser.fftSize);
    }
    return this.analyser;
  }

  private cut(): void {
    this.source?.disconnect();
    this.source = null;
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.el) {
      this.el.pause();
      this.el.src = "";
      this.el = null;
    }
  }

  async mic(): Promise<void> {
    this.cut();
    const analyser = await this.graph();
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.source = this.ctx!.createMediaStreamSource(this.stream);
    this.source.connect(analyser);
    this.live = true;
  }

  async file(file: File): Promise<void> {
    this.cut();
    const analyser = await this.graph();
    const el = document.createElement("audio");
    el.src = URL.createObjectURL(file);
    el.loop = true;
    el.crossOrigin = "anonymous";
    await el.play();
    this.el = el;
    this.source = this.ctx!.createMediaElementSource(el);
    this.source.connect(analyser);
    this.source.connect(this.ctx!.destination);
    this.live = true;
  }

  stop(): void {
    this.cut();
    this.live = false;
    this.prevBass = 0;
  }

  poll(now: number): Bands {
    if (!this.live || !this.analyser) return SILENT;
    this.analyser.getByteFrequencyData(this.freq);
    this.analyser.getByteTimeDomainData(this.time);
    const nyquist = (this.ctx?.sampleRate ?? 44100) / 2;
    const hz = (h: number) => Math.round((h / nyquist) * (this.freq.length - 1));
    const bass = mean(this.freq, 1, hz(140));
    const mid = mean(this.freq, hz(140), hz(1800));
    const high = mean(this.freq, hz(1800), hz(8000));
    let rms = 0;
    for (let i = 0; i < this.time.length; i++) {
      const v = (this.time[i] - 128) / 128;
      rms += v * v;
    }
    rms = Math.sqrt(rms / this.time.length);
    const flux = bass - this.prevBass;
    this.prevBass = bass;
    const kick = bass > 0.38 && flux > 0.1 && now - this.kickAt > 220;
    if (kick) this.kickAt = now;
    return { rms: clamp(rms * 2.2, 0, 1), bass, mid, high, kick };
  }
}

/** Offset this frame’s pose. Pass `fromHome` when Evolve is still so bass does not walk Scale away. */
export function applyListen(S: DeviceState, home: HomePose, bands: Bands, amount: number, fromHome: boolean): void {
  const k = Math.max(0, Math.min(1, amount));
  if (k < 0.001) return;
  const A = S.A;
  const z0 = fromHome ? home.zoom : A.zoom;
  const r0 = fromHome ? home.copyRotate : A.copyRotate;
  const g0 = fromHome ? home.glassMix : A.glassMix;
  const h0 = fromHome ? home.hue : A.top.hue;
  const b0 = fromHome ? home.bright : A.top.bright;
  const sm0 = fromHome ? home.smear : S.smear;
  const ed0 = fromHome ? home.edge : S.edge;
  const bl0 = fromHome ? home.bloom : S.bloom;
  const ab0 = fromHome ? home.aberration : S.aberration;

  A.zoom = clamp(z0 - bands.bass * 0.16 * k, 0.32, 0.92);
  A.copyRotate = r0 + (bands.mid - 0.28) * 0.55 * k;
  A.glassMix = clamp(g0 + (bands.mid - 0.32) * 0.28 * k, 0.08, 0.98);
  A.top.hue = clamp(h0 + (bands.high - 0.22) * 0.28 * k, -0.5, 0.5);
  A.bot.hue = clamp((fromHome ? home.hue2 : A.bot.hue) + (bands.high - 0.2) * 0.22 * k, -0.5, 0.5);
  A.top.bright = clamp(b0 + bands.rms * 0.1 * k + (bands.kick ? 0.06 : 0), 0.62, 1.2);
  S.smear = clamp(sm0 + bands.bass * 1.35 * k, 0, 2.8);
  S.edge = clamp(ed0 + bands.high * 0.32 * k, 0, 0.7);
  S.bloom = clamp(bl0 + bands.rms * 0.26 * k + (bands.kick ? 0.2 * k : 0), 0, 0.72);
  S.aberration = clamp(ab0 + bands.high * 0.008 * k, 0, 0.018);
}
