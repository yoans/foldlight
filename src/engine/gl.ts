export function createGL(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  if (!gl) throw new Error("WebGL2 is required for Digital Light Herder.");
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  return gl;
}

export function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader failed");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "unknown";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

export function program(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const p = gl.createProgram();
  if (!p) throw new Error("createProgram failed");
  const v = compile(gl, gl.VERTEX_SHADER, vs);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) ?? "link failed");
  }
  return p;
}

export type Target = {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
};

export function createTarget(gl: WebGL2RenderingContext, w: number, h: number): Target {
  const tex = gl.createTexture();
  const fbo = gl.createFramebuffer();
  if (!tex || !fbo) throw new Error("FBO alloc failed");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (!ok) throw new Error("incomplete framebuffer");
  return { tex, fbo, w, h };
}

export function createTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const tex = gl.createTexture();
  if (!tex) throw new Error("texture alloc failed");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 4, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(64));
  return tex;
}

export function uploadImage(gl: WebGL2RenderingContext, tex: WebGLTexture, source: TexImageSource): void {
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, source);
}

export function bindQuad(gl: WebGL2RenderingContext, prog: WebGLProgram): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();
  const buf = gl.createBuffer();
  if (!vao || !buf) throw new Error("vao failed");
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  return vao;
}

export class Uniforms {
  private cache = new Map<string, WebGLUniformLocation | null>();
  constructor(
    private gl: WebGL2RenderingContext,
    private prog: WebGLProgram,
  ) {}

  loc(name: string): WebGLUniformLocation | null {
    if (!this.cache.has(name)) this.cache.set(name, this.gl.getUniformLocation(this.prog, name));
    return this.cache.get(name) ?? null;
  }

  i(name: string, v: number): void {
    this.gl.uniform1i(this.loc(name), v);
  }
  f(name: string, v: number): void {
    this.gl.uniform1f(this.loc(name), v);
  }
  v2(name: string, x: number, y: number): void {
    this.gl.uniform2f(this.loc(name), x, y);
  }
  v3(name: string, x: number, y: number, z: number): void {
    this.gl.uniform3f(this.loc(name), x, y, z);
  }
}
