var Ie=Object.defineProperty;var Ue=(e,t,i)=>t in e?Ie(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var m=(e,t,i)=>Ue(e,typeof t!="symbol"?t+"":t,i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const u of o)if(u.type==="childList")for(const r of u.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function i(o){const u={};return o.integrity&&(u.integrity=o.integrity),o.referrerPolicy&&(u.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?u.credentials="include":o.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function a(o){if(o.ep)return;o.ep=!0;const u=i(o);fetch(o.href,u)}})();function _e(e){const t=e.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"});if(!t)throw new Error("WebGL2 is required for Digital Light Herder.");return t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,1),t}function ie(e,t,i){const a=e.createShader(t);if(!a)throw new Error("createShader failed");if(e.shaderSource(a,i),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS)){const o=e.getShaderInfoLog(a)??"unknown";throw e.deleteShader(a),new Error(o)}return a}function re(e,t,i){const a=e.createProgram();if(!a)throw new Error("createProgram failed");const o=ie(e,e.VERTEX_SHADER,t),u=ie(e,e.FRAGMENT_SHADER,i);if(e.attachShader(a,o),e.attachShader(a,u),e.linkProgram(a),e.deleteShader(o),e.deleteShader(u),!e.getProgramParameter(a,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(a)??"link failed");return a}function ne(e,t,i){const a=e.createTexture(),o=e.createFramebuffer();if(!a||!o)throw new Error("FBO alloc failed");e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,t,i,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0);const u=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;if(e.bindFramebuffer(e.FRAMEBUFFER,null),!u)throw new Error("incomplete framebuffer");return{tex:a,fbo:o,w:t,h:i}}function Le(e){const t=e.createTexture();if(!t)throw new Error("texture alloc failed");return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,4,4,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(64)),t}function qe(e,t,i){e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,e.RGBA,e.UNSIGNED_BYTE,i)}function le(e,t){const i=e.createVertexArray(),a=e.createBuffer();if(!i||!a)throw new Error("vao failed");e.bindVertexArray(i),e.bindBuffer(e.ARRAY_BUFFER,a),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const o=e.getAttribLocation(t,"aPos");return e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),i}class ce{constructor(t,i){m(this,"cache",new Map);this.gl=t,this.prog=i}loc(t){return this.cache.has(t)||this.cache.set(t,this.gl.getUniformLocation(this.prog,t)),this.cache.get(t)??null}i(t,i){this.gl.uniform1i(this.loc(t),i)}f(t,i){this.gl.uniform1f(this.loc(t),i)}v2(t,i,a){this.gl.uniform2f(this.loc(t),i,a)}v3(t,i,a,o){this.gl.uniform3f(this.loc(t),i,a,o)}}const ue=`#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,Ge=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrev;
uniform sampler2D uDelay;
uniform sampler2D uOther;
uniform sampler2D uSeed;

uniform vec2 uRes;
uniform float uTime;
uniform float uZoom;
uniform float uRotate;
uniform vec2 uPan;
uniform float uGlassMix;
uniform float uCopyRotate;
uniform float uCopyScale;
uniform vec2 uCopyOffset;
uniform float uFolds;
uniform float uKaleido;

uniform float uHue;
uniform float uSat;
uniform float uBright;
uniform float uContrast;
uniform float uGamma;
uniform float uHue2;
uniform float uSat2;
uniform float uBright2;
uniform float uContrast2;

uniform float uNoise;
uniform float uAberration;
uniform float uPersist;
uniform float uDecay;
uniform float uBarrel;
uniform float uEdge;
uniform float uHueDrift;
uniform float uSeedAmt;
uniform float uOtherAmt;
uniform float uDelayAmt;
uniform float uSoft;
uniform float uBloom;
uniform float uSmear;
uniform float uPhase;
uniform float uWarp;
uniform float uPoster;
uniform float uInvert;
uniform float uChromaSep;
uniform float uFeedbackAmt;

uniform int uFlipH;
uniform int uFlipV;
uniform int uKeyMode;
uniform float uKeyClip;
uniform float uKeyGain;
uniform vec3 uKeyColor;
uniform int uBottomSrc;

const float TAU = 6.28318530718;

vec2 barrel(vec2 uv, float k) {
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + k * r2;
  return c * 0.5 + 0.5;
}

vec2 rot2(vec2 p, float a) {
  float s = sin(a), c = cos(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 grade(vec3 col, float hue, float sat, float br, float con, float gam) {
  col = max(col, 0.0);
  vec3 hsv = rgb2hsv(col);
  hsv.x = fract(hsv.x + hue);
  hsv.y = clamp(hsv.y * sat, 0.0, 2.5);
  hsv.z *= br;
  col = hsv2rgb(hsv);
  col = (col - 0.5) * con + 0.5;
  col = pow(max(col, vec3(0.0)), vec3(max(gam, 0.05)));
  return col;
}

float luma(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

vec3 screenBlend(vec3 a, vec3 b) {
  return 1.0 - (1.0 - clamp(a, 0.0, 1.0)) * (1.0 - clamp(b, 0.0, 1.0));
}

// Inverse of placing a monitor of a given scale/rotation/offset.
// Pixels that miss the monitor return black so screen-blend does not darken.
vec2 monitorUV(vec2 uv, float scale, float ang, vec2 offset) {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = uv - 0.5 - offset;
  p.x *= aspect;
  p = rot2(p, -ang);
  p.x /= aspect;
  p /= max(scale, 0.08);
  return p + 0.5;
}

vec3 readMonitor(sampler2D tex, vec2 suv) {
  if (suv.x <= 0.0 || suv.x >= 1.0 || suv.y <= 0.0 || suv.y >= 1.0) {
    return texture(uPrev, vUv).rgb * 0.82;
  }
  float bz =
    smoothstep(0.0, 0.008, suv.x) *
    smoothstep(0.0, 0.008, suv.y) *
    smoothstep(0.0, 0.008, 1.0 - suv.x) *
    smoothstep(0.0, 0.008, 1.0 - suv.y);
  vec3 col;
  if (uAberration > 0.0001) {
    vec2 dir = (suv - 0.5) * uAberration;
    col = vec3(
      texture(tex, suv + dir).r,
      texture(tex, suv).g,
      texture(tex, suv - dir).b
    );
  } else {
    col = texture(tex, suv).rgb;
  }
  return col * bz;
}

void main() {
  vec2 uv = vUv;
  if (uFlipH == 1) uv.x = 1.0 - uv.x;
  if (uFlipV == 1) uv.y = 1.0 - uv.y;

  uv = barrel(uv, uBarrel);

  if (uWarp > 0.0001) {
    uv += vec2(
      sin((uv.y + uTime * 0.07) * 12.0) * uWarp,
      cos((uv.x - uTime * 0.05) * 9.0) * uWarp * 0.7
    );
  }

  if (uKaleido > 1.5) {
    vec2 p = uv - 0.5;
    float a = atan(p.y, p.x);
    float segs = max(uKaleido, 2.0);
    float seg = TAU / segs;
    a = mod(a, seg);
    a = abs(a - seg * 0.5);
    uv = vec2(cos(a), sin(a)) * length(p) + 0.5;
  }

  int folds = int(clamp(uFolds, 1.0, 8.0));
  float stepA = abs(uCopyRotate) > 0.001 ? uCopyRotate : TAU / max(uFolds, 1.0);

  vec3 acc = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (i >= folds) break;
    float sc = uZoom * (i == 1 ? uCopyScale : 1.0);
    float a = uRotate + float(i) * stepA;
    float spread = (1.0 - sc) * 0.5;
    vec2 off = uPan + rot2(vec2(uCopyOffset.x, spread + uCopyOffset.y), a);
    vec2 suv = monitorUV(uv, sc, a, off);

    vec3 c;
    if (i == 1 && uBottomSrc == 0) {
      c = readMonitor(uSeed, suv);
    } else if (i == 1 && uBottomSrc == 2) {
      c = mix(readMonitor(uPrev, suv), readMonitor(uOther, suv), uOtherAmt);
    } else {
      c = readMonitor(uPrev, suv);
    }

    if (i == 1) c = grade(c, uHue2 + uHueDrift * 0.5, uSat2, uBright2, uContrast2, uGamma);
    else c = grade(c, uHue + uHueDrift, uSat, uBright, uContrast, uGamma);

    if (i == 0) acc = c;
    else if (i == 1) acc = mix(acc, screenBlend(acc, c), uGlassMix);
    else acc = screenBlend(acc, c);
  }

  // Hardware with one camera still has a glass second monitor even when folds == 1
  if (folds == 1 && uGlassMix > 0.001) {
    float sc = uZoom * uCopyScale;
    float a = uRotate + stepA;
    float spread = (1.0 - sc) * 0.5;
    vec2 off = uPan + uCopyOffset + rot2(vec2(0.0, spread), a);
    vec2 suv = monitorUV(uv, sc, a, off);
    vec3 c;
    if (uBottomSrc == 0) c = readMonitor(uSeed, suv);
    else if (uBottomSrc == 2) c = mix(readMonitor(uPrev, suv), readMonitor(uOther, suv), uOtherAmt);
    else c = readMonitor(uPrev, suv);
    c = grade(c, uHue2 + uHueDrift * 0.5, uSat2, uBright2, uContrast2, uGamma);
    acc = mix(acc, screenBlend(acc, c), uGlassMix);
  }

  if (uDelayAmt > 0.001) {
    vec2 suv = monitorUV(uv, uZoom, uRotate, uPan);
    acc = mix(acc, screenBlend(acc, readMonitor(uDelay, suv)), uDelayAmt);
  }

  if (uSmear > 0.001) {
    vec2 vel = rot2(vec2(0.0, 1.0), uRotate) * uSmear * 0.008;
    acc = mix(acc, readMonitor(uPrev, uv + vel), 0.35);
  }

  if (uEdge > 0.001) {
    acc += (abs(dFdx(acc)) + abs(dFdy(acc))) * uEdge * 2.4;
  }

  if (uBloom > 0.001) {
    vec2 px = 2.5 / uRes;
    vec3 b =
      readMonitor(uPrev, uv + vec2(px.x, 0.0)) +
      readMonitor(uPrev, uv - vec2(px.x, 0.0)) +
      readMonitor(uPrev, uv + vec2(0.0, px.y)) +
      readMonitor(uPrev, uv - vec2(0.0, px.y));
    acc += max(b * 0.25 - 0.4, 0.0) * uBloom;
  }

  if (uSoft > 0.001) {
    vec2 px = uSoft / uRes;
    acc =
      acc * 0.55 +
      readMonitor(uPrev, uv + vec2(px.x, 0.0)) * 0.1125 +
      readMonitor(uPrev, uv - vec2(px.x, 0.0)) * 0.1125 +
      readMonitor(uPrev, uv + vec2(0.0, px.y)) * 0.1125 +
      readMonitor(uPrev, uv - vec2(0.0, px.y)) * 0.1125;
  }

  vec3 src = texture(uSeed, uv).rgb;
  if (uKeyMode == 1) {
    float k = smoothstep(uKeyClip, uKeyClip + max(uKeyGain, 0.001), luma(src));
    acc = mix(acc, src, k);
  } else if (uKeyMode == 2) {
    float k = 1.0 - smoothstep(uKeyClip, uKeyClip + max(uKeyGain, 0.001), distance(src, uKeyColor));
    acc = mix(acc, src, k);
  }

  float live = luma(acc);
  float sustain = max(uSeedAmt, (1.0 - smoothstep(0.04, 0.14, live)) * 0.18);
  acc = mix(acc, src, sustain);

  float nse = fract(sin(dot(uv * uRes + vec2(uTime * 19.7, uPhase), vec2(12.9898, 78.233))) * 43758.5453);
  acc += (nse - 0.5) * uNoise;

  if (uPoster > 1.5) {
    acc = floor(acc * uPoster + 0.5) / uPoster;
  }

  acc = mix(acc, 1.0 - acc, uInvert);

  if (uChromaSep > 0.0001) {
    acc.r = mix(acc.r, acc.g, -uChromaSep);
    acc.b = mix(acc.b, acc.g, uChromaSep);
  }

  vec3 old = texture(uPrev, uv).rgb;
  acc = mix(acc, max(acc, old * 0.97), max(uPersist, 0.22));
  acc *= uDecay * uFeedbackAmt;

  float l = luma(acc);
  acc *= mix(1.16, 1.0, smoothstep(0.08, 0.22, l));
  acc *= mix(1.0, 0.7 / max(l, 0.08), smoothstep(0.68, 1.15, l));

  fragColor = vec4(clamp(acc, 0.0, 1.0), 1.0);
}
`,He=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uA;
uniform sampler2D uB;
uniform sampler2D uC;
uniform int uView;
uniform float uScan;
uniform float uVignette;
uniform float uMixAB;

void main() {
  vec2 uv = vUv;
  vec3 col;
  if (uView == 0) col = texture(uA, uv).rgb;
  else if (uView == 1) col = texture(uB, uv).rgb;
  else if (uView == 2) col = texture(uC, uv).rgb;
  else if (uView == 3) {
    col = mix(texture(uA, uv).rgb, texture(uB, uv).rgb, uMixAB);
  } else {
    if (uv.x < 0.5) col = texture(uA, vec2(uv.x * 2.0, uv.y)).rgb;
    else col = texture(uB, vec2((uv.x - 0.5) * 2.0, uv.y)).rgb;
  }

  float vig = 1.0 - uVignette * pow(length(uv - 0.5) * 1.25, 2.4);
  col *= vig;
  if (uScan > 0.001) {
    float s = 0.9 + 0.1 * sin(uv.y * 1100.0);
    col *= mix(1.0, s, uScan);
  }
  fragColor = vec4(col, 1.0);
}
`;function b(e=0,t=1.18,i=1,a=1.22){return{hue:e,sat:t,bright:i,contrast:a}}function g(e={}){return{zoom:.66,rotate:.08,panX:0,panY:0,spin:0,glassMix:1,copyRotate:Math.PI/2,copyScale:1,copyOffX:0,copyOffY:0,folds:2,delayFrames:0,delayMix:0,bottomSrc:0,flipH:!1,flipV:!1,top:b(),bot:b(.02,1.1,.94,1.12),...e}}function Te(){return{A:g(),B:g({rotate:-.08,copyRotate:-Math.PI/2,top:b(.04,1.2,.95,1.4)}),C:g({zoom:.72,glassMix:.35,copyRotate:.5,folds:1}),linkedRods:!0,insanity:!1,frozen:!1,fps:60,view:0,scan:.08,vignette:.12,mixAB:.5,gamma:.92,noise:.016,aberration:.0015,persist:.26,decay:1,barrel:.02,edge:.06,hueDrift:.002,soft:0,bloom:.08,smear:0,warp:0,poster:0,invert:0,chromaSep:0,kaleido:0,keyMode:0,keyClip:.25,keyGain:.2,keyColor:[0,1,0],seedAmt:.05,feedbackAmt:1,quantize:!1,bpm:120,cutLen:.12,period:1,otherAmt:.85,resolution:720}}const W=8;function ze(e){return e===540?[960,540]:e===1080?[1920,1080]:[1280,720]}class Oe{constructor(t){m(this,"gl");m(this,"canvas");m(this,"state",Te());m(this,"feedback");m(this,"present");m(this,"uF");m(this,"uP");m(this,"vaoF");m(this,"vaoP");m(this,"A");m(this,"B");m(this,"C");m(this,"seedTex");m(this,"w",1280);m(this,"h",720);m(this,"lastPresent",0);m(this,"phase",0);m(this,"seedAmtA",0);m(this,"seedAmtB",0);m(this,"seedAmtC",0);m(this,"quantOn",!1);m(this,"quantT0",0);this.canvas=t,this.gl=_e(t),this.feedback=re(this.gl,ue,Ge),this.present=re(this.gl,ue,He),this.uF=new ce(this.gl,this.feedback),this.uP=new ce(this.gl,this.present),this.vaoF=le(this.gl,this.feedback),this.vaoP=le(this.gl,this.present),this.seedTex=Le(this.gl),this.A=this.makeLoop(),this.B=this.makeLoop(),this.C=this.makeLoop(2),this.resize(this.state.resolution)}makeLoop(t=W){const i=[];for(let a=0;a<t;a++)i.push(ne(this.gl,this.w||1280,this.h||720));return{ring:i,write:0}}resize(t){const[i,a]=ze(t);if(this.state.resolution=t,i===this.w&&a===this.h&&this.A.ring.length)return;this.w=i,this.h=a;const o=u=>{const r=[];for(let n=0;n<u;n++)r.push(ne(this.gl,i,a));return{ring:r,write:0}};this.A=o(W),this.B=o(W),this.C=o(2),this.clear()}setSeed(t){qe(this.gl,this.seedTex,t)}clear(){const t=this.gl;for(const i of[this.A,this.B,this.C]){for(const a of i.ring)t.bindFramebuffer(t.FRAMEBUFFER,a.fbo),t.viewport(0,0,this.w,this.h),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);i.write=0}t.bindFramebuffer(t.FRAMEBUFFER,null)}trap(t="all"){const i=(a,o)=>{a.bottomSrc===0?(a.bottomSrc=1,o(.85)):a.bottomSrc=0};(t==="A"||t==="all")&&i(this.state.A,a=>this.seedAmtA=a),(t==="B"||t==="all")&&i(this.state.B,a=>this.seedAmtB=a),(t==="C"||t==="all")&&i(this.state.C,a=>this.seedAmtC=a)}inject(t=.7){this.seedAmtA=Math.max(this.seedAmtA,t),this.seedAmtB=Math.max(this.seedAmtB,t),this.seedAmtC=Math.max(this.seedAmtC,t)}tick(t){if(this.state.frozen){this.drawPresent();return}const i=1e3/this.state.fps;if(t-this.lastPresent<i*.85&&this.lastPresent!==0){this.drawPresent();return}if(this.lastPresent=t,this.phase+=1,this.state.quantize){const n=6e4/Math.max(this.state.bpm,1)*Math.max(this.state.period,.05),l=n*Math.min(this.state.cutLen,.95);this.quantT0===0&&(this.quantT0=t);const f=(t-this.quantT0)%n<l;f!==this.quantOn&&(this.quantOn=f,this.trap("A"),this.trap("B"))}this.state.linkedRods&&(this.state.B.zoom=this.state.A.zoom,this.state.B.rotate=-this.state.A.rotate,this.state.B.panX=this.state.A.panX,this.state.B.panY=this.state.A.panY,this.state.B.spin=-this.state.A.spin),this.state.A.rotate+=this.state.A.spin*.016,this.state.B.rotate+=this.state.B.spin*.016,this.state.C.rotate+=this.state.C.spin*.016;const a=this.readTex(this.B,1),o=this.readTex(this.A,1);this.renderLoop(this.A,this.state.A,a,this.seedAmtA,this.state.insanity),this.renderLoop(this.B,this.state.B,o,this.seedAmtB,this.state.insanity),this.renderLoop(this.C,this.state.C,this.readTex(this.A,1),this.seedAmtC,!1);const u=this.state.seedAmt;this.seedAmtA=Math.max(this.seedAmtA*.92,u),this.seedAmtB=Math.max(this.seedAmtB*.92,u),this.seedAmtC=Math.max(this.seedAmtC*.92,u),this.drawPresent()}readTex(t,i){const a=t.ring.length,o=(t.write-i+a)%a;return t.ring[o].tex}renderLoop(t,i,a,o,u){const r=this.gl,n=t.ring.length,l=this.readTex(t,1),d=Math.min(Math.max(Math.round(i.delayFrames),1),n-1),f=this.readTex(t,d),p=t.ring[t.write];r.bindFramebuffer(r.FRAMEBUFFER,p.fbo),r.viewport(0,0,this.w,this.h),r.useProgram(this.feedback),r.bindVertexArray(this.vaoF),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,l),r.activeTexture(r.TEXTURE1),r.bindTexture(r.TEXTURE_2D,f),r.activeTexture(r.TEXTURE2),r.bindTexture(r.TEXTURE_2D,a),r.activeTexture(r.TEXTURE3),r.bindTexture(r.TEXTURE_2D,this.seedTex);const s=this.uF;s.i("uPrev",0),s.i("uDelay",1),s.i("uOther",2),s.i("uSeed",3),s.v2("uRes",this.w,this.h),s.f("uTime",this.phase/60),s.f("uZoom",i.zoom),s.f("uRotate",i.rotate),s.v2("uPan",i.panX,i.panY),s.f("uGlassMix",i.glassMix),s.f("uCopyRotate",i.copyRotate),s.f("uCopyScale",i.copyScale),s.v2("uCopyOffset",i.copyOffX,i.copyOffY),s.f("uFolds",i.folds),s.f("uKaleido",this.state.kaleido),s.f("uHue",i.top.hue),s.f("uSat",i.top.sat),s.f("uBright",i.top.bright),s.f("uContrast",i.top.contrast),s.f("uGamma",this.state.gamma),s.f("uHue2",i.bot.hue),s.f("uSat2",i.bot.sat),s.f("uBright2",i.bot.bright),s.f("uContrast2",i.bot.contrast),s.f("uNoise",this.state.noise),s.f("uAberration",this.state.aberration),s.f("uPersist",this.state.persist),s.f("uDecay",this.state.decay),s.f("uBarrel",this.state.barrel),s.f("uEdge",this.state.edge),s.f("uHueDrift",this.state.hueDrift),s.f("uSeedAmt",Math.max(this.state.seedAmt,o)),s.f("uOtherAmt",u?this.state.otherAmt:0),s.f("uDelayAmt",i.delayFrames>0?i.delayMix:0),s.f("uSoft",this.state.soft),s.f("uBloom",this.state.bloom),s.f("uSmear",this.state.smear),s.f("uPhase",this.phase),s.f("uWarp",this.state.warp),s.f("uPoster",this.state.poster),s.f("uInvert",this.state.invert),s.f("uChromaSep",this.state.chromaSep),s.f("uFeedbackAmt",this.state.feedbackAmt),s.i("uFlipH",i.flipH?1:0),s.i("uFlipV",i.flipV?1:0),s.i("uKeyMode",this.state.keyMode),s.f("uKeyClip",this.state.keyClip),s.f("uKeyGain",this.state.keyGain),s.v3("uKeyColor",this.state.keyColor[0],this.state.keyColor[1],this.state.keyColor[2]);const v=u&&i.bottomSrc!==0?2:i.bottomSrc;s.i("uBottomSrc",v),r.drawArrays(r.TRIANGLE_STRIP,0,4),t.write=(t.write+1)%n}drawPresent(){const t=this.gl,{width:i,height:a}=this.canvas;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,i,a),t.useProgram(this.present),t.bindVertexArray(this.vaoP),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.readTex(this.A,1)),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.readTex(this.B,1)),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.readTex(this.C,1)),this.uP.i("uA",0),this.uP.i("uB",1),this.uP.i("uC",2),this.uP.i("uView",this.state.view),this.uP.f("uScan",this.state.scan),this.uP.f("uVignette",this.state.vignette),this.uP.f("uMixAB",this.state.mixAB),t.drawArrays(t.TRIANGLE_STRIP,0,4)}}const A=()=>Te(),ee=[{id:"first-light",name:"First Light",hint:"Single-loop CRT middlespace, 1988 dorm room",apply:()=>{const e=A();return e.A=g({zoom:.86,rotate:.06,glassMix:0,copyRotate:0,folds:1}),e.A.top=b(0,.9,.98,1.15),e.view=0,e.insanity=!1,e.hueDrift=.01,e.noise=.025,e.barrel=.08,e.scan=.32,e}},{id:"king-glass",name:"King Glass",hint:"Peter King 1997 — two monitors through 50/50 glass, 90° fold",apply:()=>{const e=A();return e.A=g({zoom:.68,rotate:.1,glassMix:1,copyRotate:Math.PI/2,copyScale:1,folds:2}),e.A.top=b(-.02,1.25,.92,1.28),e.A.bot=b(.05,1.2,.92,1.22),e.view=0,e.edge=.1,e}},{id:"fair-captive",name:"Fair Captive",hint:"Arm seed, then Trap — Magritte / Hofstadter recursion",apply:()=>{const e=A();return e.A=g({zoom:.6,rotate:.04,glassMix:1,copyRotate:.85,folds:2,delayFrames:5,delayMix:.28}),e.A.bottomSrc=0,e.A.top=b(.01,1.08,.97,1.22),e.persist=.22,e}},{id:"insanity",name:"Insanity Mode",hint:"A makes B makes A — fractals of fractals",apply:()=>{const e=A();return e.insanity=!0,e.A=g({zoom:.55,rotate:.2,glassMix:1,copyRotate:1.57,folds:2}),e.B=g({zoom:.52,rotate:-.16,glassMix:1,copyRotate:-1.4,folds:2}),e.A.bottomSrc=2,e.B.bottomSrc=2,e.A.top=b(-.04,1.4,.94,1.4),e.B.top=b(.08,1.3,.94,1.36),e.view=4,e.otherAmt=.85,e}},{id:"sierpinski",name:"Sierpiński Zone",hint:"Three contracted copies — nested triangles",apply:()=>{const e=A();return e.A=g({zoom:.5,rotate:0,glassMix:1,copyRotate:2.094395,copyScale:1,folds:3}),e.A.top=b(.1,.45,.98,1.55),e.A.bot=b(.1,.45,.98,1.55),e.gamma=.88,e.edge=.18,e.noise=.008,e.hueDrift=0,e.bloom=0,e}},{id:"jellyfish",name:"Jellyfish",hint:"Organic light creatures from the HD years",apply:()=>{const e=A();return e.A=g({zoom:.64,rotate:.35,spin:.1,glassMix:1,copyRotate:1.1,copyScale:1.05,folds:2}),e.A.top=b(.55,1.55,.94,1.28),e.A.bot=b(.62,1.35,.94,1.2),e.warp=.008,e.smear=.8,e.persist=.28,e.bloom=.35,e.soft=.35,e.hueDrift=.005,e}},{id:"fern",name:"Barnsley Fern",hint:"Unequal copies + offset — foliage IFS",apply:()=>{const e=A();return e.A=g({zoom:.54,rotate:.4,glassMix:1,copyRotate:2.45,copyScale:.72,copyOffX:.08,copyOffY:-.04,folds:2}),e.A.top=b(.28,1.5,.96,1.4),e.edge=.14,e}},{id:"light-hurt",name:"Light Hurt",hint:"Overdriven session — delay + hue cycle",apply:()=>{const e=A();return e.A=g({zoom:.57,rotate:.5,spin:.18,glassMix:1,copyRotate:1.2,folds:2,delayFrames:6,delayMix:.4}),e.B=g({zoom:.53,rotate:-.4,spin:-.12,glassMix:1,copyRotate:-1.1,folds:2,delayFrames:5,delayMix:.32}),e.insanity=!0,e.A.bottomSrc=2,e.B.bottomSrc=2,e.A.top=b(0,1.7,.92,1.45),e.hueDrift=.01,e.aberration=.006,e.chromaSep=.12,e.bloom=.4,e.view=3,e.fps=24,e}},{id:"stutter-24",name:"24fps Stutter",hint:"Router frame-rate trick — cinema smear",apply:()=>{const e=A();return e.fps=24,e.A.delayFrames=2,e.A.delayMix=.3,e.smear=1.4,e.persist=.18,e.scan=.08,e}},{id:"kaleid",name:"Kaleid Herd",hint:"Six-fold IFS + glass mixer",apply:()=>{const e=A();return e.A=g({zoom:.48,rotate:.08,spin:.05,glassMix:1,copyRotate:Math.PI/3,folds:6}),e.A.top=b(.08,1.25,.95,1.35),e.bloom=.2,e}},{id:"front-cam",name:"Front Camera",hint:"Rotating monitor loop — objects, poems, guitar",apply:()=>{const e=A();return e.view=2,e.C=g({zoom:.7,rotate:.15,spin:.35,glassMix:.4,copyRotate:.4,folds:1}),e.C.top=b(.02,1.12,.97,1.2),e.C.bottomSrc=0,e}},{id:"middlespace",name:"Middlespace",hint:"Tiny zone between on and off",apply:()=>{const e=A();return e.A=g({zoom:.78,rotate:.03,glassMix:.35,copyRotate:.4,folds:2}),e.A.top=b(0,.75,.99,1.08),e.noise=.03,e.persist=.04,e.edge=.03,e.bloom=0,e}}],Xe=[{label:"Tiles / monitors",value:"grid"},{label:"Arc tiles",value:"arcs"},{label:"Packed bloom",value:"bloom"},{label:"Chevrons",value:"chevrons"},{label:"Drift field",value:"drift"},{label:"Iso stack",value:"iso"},{label:"Polar rings",value:"rings"},{label:"Color burst",value:"burst"},{label:"Plasma",value:"plasma"},{label:"Sun",value:"sun"},{label:"Glyphs / poem",value:"glyphs"},{label:"Noise",value:"noise"},{label:"Fair captive",value:"portrait"}];function Ne(e=1024){const t=document.createElement("canvas");return t.width=e,t.height=e,t}function k(e){const t=Math.sin(e*127.1)*43758.5453;return t-Math.floor(t)}function Y(e,t,i=0){const a=e.canvas.width,o=e.canvas.height;if(e.fillStyle="#000",e.fillRect(0,0,a,o),t==="plasma"){const r=e.createImageData(a,o);for(let n=0;n<o;n+=2)for(let l=0;l<a;l+=2){const d=l/a,f=n/o,p=.5+.5*Math.sin(d*12+i)*Math.sin(f*9-i*.7)*Math.sin((d+f)*7+i*.3),s=(.5+.5*Math.sin(p*6.2+.2))*255,v=(.5+.5*Math.sin(p*5.1+2.1))*255,C=(.5+.5*Math.sin(p*7.4+4.2))*255,y=(n*a+l)*4;r.data[y]=s,r.data[y+1]=v,r.data[y+2]=C,r.data[y+3]=255}e.putImageData(r,0,0),e.filter="blur(8px)",e.drawImage(e.canvas,0,0),e.filter="none";return}if(t==="burst"){for(let r=0;r<40;r++){const n=k(r+1)*a,l=k(r+9)*o,d=40+k(r+17)*180,f=e.createRadialGradient(n,l,0,n,l,d);f.addColorStop(0,`hsla(${(k(r)*360+i*40)%360}, 90%, 62%, 0.85)`),f.addColorStop(1,"transparent"),e.fillStyle=f,e.fillRect(0,0,a,o)}return}if(t==="sun"){const r=e.createRadialGradient(a*.5,o*.5,20,a*.5,o*.5,a*.42);r.addColorStop(0,"#fff6d0"),r.addColorStop(.25,"#ffb347"),r.addColorStop(.55,"#ff3355"),r.addColorStop(1,"#000"),e.fillStyle=r,e.fillRect(0,0,a,o),e.strokeStyle="rgba(255,220,120,0.35)",e.lineWidth=6;for(let n=0;n<16;n++){const l=n/16*Math.PI*2+i*.2;e.beginPath(),e.moveTo(a*.5,o*.5),e.lineTo(a*.5+Math.cos(l)*a*.48,o*.5+Math.sin(l)*o*.48),e.stroke()}return}if(t==="glyphs"){e.fillStyle="#0a0610",e.fillRect(0,0,a,o),e.fillStyle="#f4e8c1",e.font=`700 ${Math.floor(a/7)}px Georgia, serif`,e.textAlign="center",e.textBaseline="middle",["THE FAIR","CAPTIVE","RECURSION","IS THE KEY"].forEach((n,l)=>e.fillText(n,a/2,o*(.22+l*.18))),e.strokeStyle="rgba(255,80,40,0.7)",e.lineWidth=14,e.beginPath(),e.ellipse(a*.5,o*.5,a*.38,o*.42,.1,0,Math.PI*2),e.stroke();return}if(t==="noise"){const r=e.createImageData(a,o);for(let n=0;n<r.data.length;n+=4){const l=Math.random()*255;r.data[n]=l,r.data[n+1]=l*.85,r.data[n+2]=l*.7,r.data[n+3]=255}e.putImageData(r,0,0);return}if(t==="grid"){const r=["#e23d2b","#f4c430","#2ec4b6","#7b5cff","#ff7a18","#f5f0e6"],l=a/4;for(let d=0;d<4;d++)for(let f=0;f<4;f++)e.fillStyle=r[(f+d*2)%r.length],e.fillRect(f*l,d*l,l+1,l+1);e.strokeStyle="#0a0604",e.lineWidth=18,e.strokeRect(10,10,a-20,o-20),e.strokeStyle="#ffffff",e.lineWidth=6,e.strokeRect(a*.18,o*.18,a*.64,o*.64);return}if(t==="arcs"){const n=a/10;e.fillStyle="#12080c",e.fillRect(0,0,a,o);const l=["#e23d2b","#f4c430","#2ec4b6","#7b5cff","#f5f0e6"];for(let d=0;d<10;d++)for(let f=0;f<10;f++){const p=(f+.5)*n,s=(d+.5)*n,v=k(f*19+d*41)>.5;e.strokeStyle=l[(f+d)%l.length],e.lineWidth=Math.max(3,n*.18),e.beginPath(),v?e.arc(f*n,d*n,n*.5,0,Math.PI/2):e.arc((f+1)*n,d*n,n*.5,Math.PI/2,Math.PI),e.stroke(),e.beginPath(),v?e.arc((f+1)*n,(d+1)*n,n*.5,Math.PI,Math.PI*1.5):e.arc(f*n,(d+1)*n,n*.5,Math.PI*1.5,Math.PI*2),e.stroke(),e.beginPath(),e.arc(p,s,n*.08,0,Math.PI*2),e.fillStyle=l[(f+d+2)%l.length],e.fill()}return}if(t==="bloom"){e.fillStyle="#08060c",e.fillRect(0,0,a,o);const r=a*.018,n=Math.PI*(3-Math.sqrt(5));for(let l=0;l<420;l++){const d=l*n,f=r*Math.sqrt(l),p=a*.5+Math.cos(d)*f,s=o*.5+Math.sin(d)*f,v=4+l%7;e.beginPath(),e.arc(p,s,v,0,Math.PI*2),e.fillStyle=`hsla(${(l*4+20)%360}, 78%, ${48+l%20}%, 0.92)`,e.fill()}return}if(t==="chevrons"){e.fillStyle="#100806",e.fillRect(0,0,a,o);const r=["#e23d2b","#c9a227","#2ec4b6","#1a120c","#f5f0e6"],n=o/12;for(let l=-2;l<16;l++){e.fillStyle=r[(l%r.length+r.length)%r.length],e.beginPath();const d=l*n;e.moveTo(0,d),e.lineTo(a*.5,d+n*1.4),e.lineTo(a,d),e.lineTo(a,d+n),e.lineTo(a*.5,d+n*2.4),e.lineTo(0,d+n),e.closePath(),e.fill()}return}if(t==="drift"){e.fillStyle="#07060a",e.fillRect(0,0,a,o),e.lineWidth=Math.max(2,a/220),e.lineCap="round";for(let r=0;r<70;r++){let n=k(r+3)*a,l=k(r+11)*o;e.strokeStyle=`hsla(${(k(r)*280+10)%360}, 85%, 58%, 0.88)`,e.beginPath(),e.moveTo(n,l);for(let d=0;d<28;d++){const f=(k(r*17+d)-.5)*1.4+Math.sin(l*.01+r)*.6;n+=Math.cos(f)*(a*.028),l+=Math.sin(f)*(o*.028),e.lineTo(n,l)}e.stroke()}return}if(t==="iso"){e.fillStyle="#0c0a08",e.fillRect(0,0,a,o);const r=a/9,n=["#e23d2b","#7b5cff","#2ec4b6"],l=(d,f,p)=>{const s=a*.5+(d-f)*r*.86,v=o*.12+(d+f)*r*.5;e.fillStyle=n[p],e.beginPath(),p===0?(e.moveTo(s,v),e.lineTo(s+r*.86,v+r*.5),e.lineTo(s,v+r),e.lineTo(s-r*.86,v+r*.5)):p===1?(e.moveTo(s,v+r),e.lineTo(s+r*.86,v+r*.5),e.lineTo(s+r*.86,v+r*1.5),e.lineTo(s,v+r*2)):(e.moveTo(s,v+r),e.lineTo(s-r*.86,v+r*.5),e.lineTo(s-r*.86,v+r*1.5),e.lineTo(s,v+r*2)),e.closePath(),e.fill()};for(let d=0;d<8;d++)for(let f=0;f<8;f++)k(f*8+d)<.22||(l(f,d,0),l(f,d,1),l(f,d,2));return}if(t==="rings"){e.fillStyle="#0a0810",e.fillRect(0,0,a,o);const r=a*.5,n=o*.5;for(let l=1;l<18;l++)e.beginPath(),e.arc(r,n,l*(a*.028),0,Math.PI*2),e.strokeStyle=`hsla(${200+l*8}, 80%, ${40+l%5*8}%, 0.9)`,e.lineWidth=l%3===0?10:3,e.stroke();for(let l=0;l<24;l++){const d=l/24*Math.PI*2;e.strokeStyle="#f4c430",e.lineWidth=3,e.beginPath(),e.moveTo(r+Math.cos(d)*a*.08,n+Math.sin(d)*o*.08),e.lineTo(r+Math.cos(d)*a*.46,n+Math.sin(d)*o*.46),e.stroke()}return}const u=e.createLinearGradient(0,0,0,o);u.addColorStop(0,"#6aa8e8"),u.addColorStop(1,"#f3d5a0"),e.fillStyle=u,e.fillRect(0,0,a,o),e.fillStyle="#c45c2a",e.beginPath(),e.arc(a*.5,o*.42,a*.18,0,Math.PI*2),e.fill(),e.fillStyle="#1a120c",e.fillRect(a*.42,o*.55,a*.16,o*.28),e.beginPath(),e.ellipse(a*.62,o*.62,a*.16,o*.08,.4,0,Math.PI*2),e.fill(),e.fillStyle="#fff",e.font=`italic 700 ${Math.floor(a/18)}px Georgia, serif`,e.textAlign="center",e.fillText("trap me",a/2,o*.92)}const Ke=[{id:"all",label:"All"},{id:"glass",label:"Glass"},{id:"tiles",label:"Tiles"},{id:"flow",label:"Flow"},{id:"radial",label:"Radial"},{id:"iso",label:"Iso"}],R=[{id:"king-glass",name:"King Glass",tag:"The fractal trick",blurb:"Two monitors through 50/50 glass at 90°. Peter King’s 1997 move — fractals, nested copies.",preset:"king-glass",seed:"grid",family:"glass",spin:.06},{id:"first-light",name:"First Light",tag:"UCSC 1988",blurb:"One camera, one screen, the middlespace. Hue drift like old NTSC.",preset:"first-light",seed:"sun",family:"glass",spin:.04},{id:"fair-captive",name:"Fair Captive",tag:"Trap a picture",blurb:"Arm a seed, then Trap. The image leaves the source and lives only in the loop.",preset:"fair-captive",seed:"portrait",family:"glass",spin:.03},{id:"sierpinski",name:"Sierpiński",tag:"Nested triangles",blurb:"Three contracted copies. Smaller Scale / rod = more generations on screen.",preset:"sierpinski",seed:"grid",family:"glass",spin:.04},{id:"jellyfish",name:"Jellyfish",tag:"Light creatures",blurb:"Organic, phosphor-smeared animals. Herd Bright and Contrast to keep them alive.",preset:"jellyfish",seed:"burst",family:"glass",spin:.1},{id:"fern",name:"Fern",tag:"IFS foliage",blurb:"Unequal copies and a shove. The glass fold as a plant.",preset:"fern",seed:"grid",family:"glass",spin:.05},{id:"insanity",name:"Insanity",tag:"They make each other",blurb:"Loop A writes Loop B writes Loop A. Hard to hold. Glorious when it holds.",preset:"insanity",seed:"plasma",family:"glass",spin:.08},{id:"light-hurt",name:"Light Hurt",tag:"Overdriven",blurb:"Delay, hue walk, 24fps stutter. Turn Contrast until it bites.",preset:"light-hurt",seed:"burst",family:"glass",spin:.16},{id:"kaleid",name:"Kaleid",tag:"Six-fold",blurb:"Rotational copies stacked on the glass mixer. Mandala that still breathes.",preset:"kaleid",seed:"sun",family:"glass",spin:.07},{id:"arc-floor",name:"Arc Floor",tag:"Truchet tiles",blurb:"Quarter-arcs on a grid — a 1704 tiling, then folded through glass.",preset:"king-glass",seed:"arcs",family:"tiles",spin:.05},{id:"fold-chevrons",name:"Fold Chevrons",tag:"Stacked Vs",blurb:"Hard chevrons into nested triangles. Scale down to multiply the folds.",preset:"sierpinski",seed:"chevrons",family:"tiles",spin:.04},{id:"drift-field",name:"Drift Field",tag:"Line weather",blurb:"Hash-steered ribbons. Delay and smear turn them into creatures.",preset:"jellyfish",seed:"drift",family:"flow",spin:.09},{id:"packed-bloom",name:"Packed Bloom",tag:"Phyllotaxis",blurb:"Vogel spiral packing. Six-fold glass turns a flower into a hall of flowers.",preset:"kaleid",seed:"bloom",family:"radial",spin:.06},{id:"polar-rings",name:"Polar Rings",tag:"Spokes + rings",blurb:"Concentric bands and radial spokes. First Light lets the middlespace chew them.",preset:"first-light",seed:"rings",family:"radial",spin:.07},{id:"iso-stack",name:"Iso Stack",tag:"Cube city",blurb:"Isometric cubes as seed tiles. Glass at 90° stacks cities inside cities.",preset:"king-glass",seed:"iso",family:"iso",spin:.05}];class Ve{constructor(t,i){m(this,"el");m(this,"opts");m(this,"value");m(this,"dragging",!1);m(this,"lastY",0);m(this,"pointerId",-1);this.opts=i,this.value=i.value,this.el=document.createElement("div"),this.el.className="knob-wrap",this.el.innerHTML=`
      <div class="knob" role="slider" tabindex="0" aria-label="${t}">
        <div class="knob-face"><i></i></div>
      </div>
      <span class="knob-val"></span>
      <span class="knob-lab">${t}</span>
    `;const a=this.el.querySelector(".knob");a.addEventListener("pointerdown",u=>{this.dragging=!0,this.lastY=u.clientY,this.pointerId=u.pointerId,a.setPointerCapture(u.pointerId),u.preventDefault()}),a.addEventListener("pointermove",u=>{if(!this.dragging||u.pointerId!==this.pointerId)return;const r=u.shiftKey?.12:1,n=(this.lastY-u.clientY)*r;this.lastY=u.clientY;const l=this.opts.max-this.opts.min;this.set(this.value+n/140*l)});const o=()=>{this.dragging=!1};a.addEventListener("pointerup",o),a.addEventListener("pointercancel",o),a.addEventListener("dblclick",()=>this.set((this.opts.min+this.opts.max)/2)),a.addEventListener("keydown",u=>{const r=this.opts.max-this.opts.min;u.key==="ArrowUp"&&this.set(this.value+r*.02),u.key==="ArrowDown"&&this.set(this.value-r*.02)}),a.addEventListener("wheel",u=>{u.preventDefault();const r=this.opts.max-this.opts.min;this.set(this.value+(u.deltaY>0?-1:1)*r*.02)},{passive:!1}),this.render()}set(t,i=!1){const a=this.opts.step?Math.round(t/this.opts.step)*this.opts.step:t;this.value=Math.min(this.opts.max,Math.max(this.opts.min,a)),this.render(),i||this.opts.onChange(this.value)}get(){return this.value}render(){const i=-135+(this.value-this.opts.min)/(this.opts.max-this.opts.min)*270;this.el.querySelector(".knob-face").style.setProperty("--ang",`${i}deg`);const o=this.el.querySelector(".knob-val");o.textContent=this.opts.format?this.opts.format(this.value):this.value.toFixed(this.value>=10?0:2)}}function G(e,t,i){const a=document.createElement("button");return a.type="button",a.className=`tog ${t?"on":""}`,a.innerHTML=`<b></b><span>${e}</span>`,a.addEventListener("click",()=>{t=!t,a.classList.toggle("on",t),i(t)}),a}function T(e,t,i){const a=document.createElement("button");return a.type="button",a.className=`act ${t}`,a.textContent=e,a.addEventListener("click",i),a}function x(e){const t=document.createElement("section");return t.className="rack",t.innerHTML=`<h3>${e}</h3><div class="rack-body"></div>`,t}const M=document.querySelector("#view"),S=document.querySelector("#desk"),de=document.querySelector("#transport"),Ee=document.querySelector("#hint"),Ye=document.querySelector("#fps"),$e=document.querySelector("#mode"),j=document.querySelector("#sessions"),fe=document.querySelector("#start-filters"),U=document.querySelector("#play-herd"),Me=document.querySelector("#gate"),N=document.querySelector("#about"),ae=document.querySelector("#coach"),ke=document.querySelector("#coach-copy"),We=document.querySelector("#play-nudge"),c=new Oe(M),E=Ne(1024);let I="grid",w=!1,_=null,P=null,Z=0,Q=performance.now(),q=!1,z=!1,B=[],O=0,te="king-glass",se="king-glass",D="all",X=0;const K=["Each thumbnail is a different universe. Tap one. Then another. There is no bottom.","Scale is depth — smaller means more nested copies. Bright and Contrast are how you steer.","Trap locks a picture in the loop. Double-tap the screen. Then go as far as it will take you."];function oe(){return window.matchMedia("(max-width: 800px)").matches}Y(E.getContext("2d"),I);c.setSeed(E);c.inject(1);function Re(){const e=M.getBoundingClientRect(),t=Math.min(window.devicePixelRatio||1,oe()?1.5:2),i=Math.max(480,Math.floor(e.width*t)),a=Math.max(270,Math.floor(e.height*t));(M.width!==i||M.height!==a)&&(M.width=i,M.height=a)}function V(e,t=2){return e.toFixed(t)}function h(e,t,i,a,o,u,r){const n=new Ve(t,{min:i,max:a,value:o,onChange:u,format:r});return e.append(n.el),n}function L(e,t){const i=x(e),a=i.querySelector(".rack-body");return h(a,"Hue",-.5,.5,t.hue,o=>t.hue=o,o=>V(o*360,0)+"°"),h(a,"Sat",0,2.2,t.sat,o=>t.sat=o),h(a,"Bright",0,1.4,t.bright,o=>t.bright=o),h(a,"Contrast",.4,2.2,t.contrast,o=>t.contrast=o),i}function J(e,t){const i=x(e),a=i.querySelector(".rack-body");return h(a,"Scale / rod",.34,.9,t.zoom,o=>t.zoom=o),h(a,"Tiller",-3.14,3.14,t.rotate,o=>t.rotate=o,o=>V(o*180/Math.PI,0)+"°"),h(a,"Spin",-1.2,1.2,t.spin,o=>t.spin=o),h(a,"Pan X",-.25,.25,t.panX,o=>t.panX=o),h(a,"Pan Y",-.25,.25,t.panY,o=>t.panY=o),h(a,"Glass",0,1,t.glassMix,o=>t.glassMix=o),h(a,"Copy °",-3.14,3.14,t.copyRotate,o=>t.copyRotate=o,o=>V(o*180/Math.PI,0)),h(a,"Copy zm",.6,1.4,t.copyScale,o=>t.copyScale=o),h(a,"Folds",1,8,t.folds,o=>t.folds=Math.round(o),o=>String(Math.round(o))),h(a,"Delay fr",0,7,t.delayFrames,o=>t.delayFrames=Math.round(o),o=>String(Math.round(o))),h(a,"Delay mix",0,1,t.delayMix,o=>t.delayMix=o),a.append(G("Flip H",t.flipH,o=>t.flipH=o),G("Flip V",t.flipV,o=>t.flipV=o)),i}function H(e){const t=R.find(a=>a.id===e)??R[0];te=t.preset,se=t.id,I=t.seed,w=!1,P=null,Y(E.getContext("2d"),I),c.setSeed(E);const i=ee.find(a=>a.id===t.preset);i&&(c.state=i.apply(),t.spin!=null&&(c.state.A.spin=t.spin),Math.abs(c.state.A.spin)<.02&&(c.state.A.spin=.05),c.state.seedAmt=Math.max(c.state.seedAmt,.05),c.state.persist=Math.max(c.state.persist,.24),c.state.feedbackAmt=Math.max(c.state.feedbackAmt,1),oe()&&c.resize(540),Ee.textContent=`${t.blurb} Smaller Scale = deeper nests.`,We.textContent=`${t.name} · ${t.tag}. Trap locks a picture. Double-tap to go further.`,c.inject(1),t.preset!=="fair-captive"&&(c.state.A.bottomSrc=1,c.state.B.bottomSrc=1,c.state.C.bottomSrc=1),we(),xe(),Pe())}function je(){const t=(D==="all"?R:R.filter(a=>a.family===D)).filter(a=>a.id!==se),i=t[Math.floor(Math.random()*t.length)]??R[0];H(i.id)}function Ce(){localStorage.getItem("dlh-coached")||(ae.classList.remove("hidden"),ke.textContent=K[X]??K[0])}function Ze(){if(X+=1,X>=K.length){ae.classList.add("hidden"),localStorage.setItem("dlh-coached","1");return}ke.textContent=K[X]}function Pe(){fe.replaceChildren();for(const i of Ke){const a=document.createElement("button");a.type="button",a.className=`start-filter${i.id===D?" on":""}`,a.textContent=i.label,a.addEventListener("click",()=>{D=i.id,Pe()}),fe.append(a)}j.replaceChildren();const e=document.createElement("button");e.type="button",e.className="start-card surprise",e.innerHTML='<span class="start-thumb start-thumb-empty">?</span><b>Wild card</b><span>Surprise me</span>',e.addEventListener("click",je),j.append(e);const t=D==="all"?R:R.filter(i=>i.family===D);for(const i of t){const a=document.createElement("button");a.type="button",a.className=`start-card${i.id===se?" on":""}`;const o=document.createElement("canvas");o.className="start-thumb",o.width=128,o.height=128,Y(o.getContext("2d"),i.seed);const u=document.createElement("span");u.className="start-meta",u.innerHTML=`<b>${i.tag}</b>${i.name}`,a.append(o,u),a.addEventListener("click",()=>H(i.id)),j.append(a)}}function xe(){const e=c.state.A;U.replaceChildren(),h(U,"Scale",.34,.9,e.zoom,t=>e.zoom=t),h(U,"Tiller",-3.14,3.14,e.rotate,t=>e.rotate=t,t=>V(t*180/Math.PI,0)+"°"),h(U,"Bright",0,1.4,e.top.bright,t=>e.top.bright=t),h(U,"Contrast",.4,2.2,e.top.contrast,t=>e.top.contrast=t)}function F(e,t,i){const a=document.createElement("select");for(const o of e){const u=document.createElement("option");u.value=o.value,u.textContent=o.label,a.append(u)}return a.value=t,a.addEventListener("change",()=>i(a.value)),a}function we(){const e=c.state;S.replaceChildren();const t=x("Presets");t.querySelector(".rack-body").append(F(ee.map(s=>({label:s.name,value:s.id})),te,s=>{const v=R.find(y=>y.preset===s);if(v){H(v.id);return}te=s;const C=ee.find(y=>y.id===s);C&&(c.state=C.apply(),c.state.seedAmt=Math.max(c.state.seedAmt,.05),c.state.persist=Math.max(c.state.persist,.24),Math.abs(c.state.A.spin)<.02&&(c.state.A.spin=.05),Ee.textContent=C.hint,we(),xe(),c.inject(.85),s!=="fair-captive"&&(c.state.A.bottomSrc=1,c.state.B.bottomSrc=1,c.state.C.bottomSrc=1))})),S.append(t);const i=x("Seed / playback unit"),a=i.querySelector(".rack-body");a.append(F(Xe,I,s=>{I=s,w=!1,Y(E.getContext("2d"),I),c.setSeed(E)}),T("Inject seed","",()=>c.inject(.9))),h(a,"Seed leak",0,.25,e.seedAmt,s=>e.seedAmt=s);const o=document.createElement("label");o.className="file",o.textContent="Load image / video";const u=document.createElement("input");u.type="file",u.accept="image/*,video/*",u.addEventListener("change",()=>{var C;const s=(C=u.files)==null?void 0:C[0];if(!s)return;const v=URL.createObjectURL(s);if(s.type.startsWith("video")){const y=document.createElement("video");y.src=v,y.loop=!0,y.muted=!0,y.playsInline=!0,y.play(),P=y,w=!0}else{const y=new Image;y.onload=()=>{const $=E.getContext("2d");$.fillStyle="#000",$.fillRect(0,0,E.width,E.height),$.drawImage(y,0,0,E.width,E.height),c.setSeed(E),w=!1,P=null},y.src=v}}),o.append(u),a.append(o),a.append(T("Webcam","",async()=>{if(_){_.getTracks().forEach(v=>v.stop()),_=null,P=null,w=!1;return}_=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"}});const s=document.createElement("video");s.srcObject=_,s.muted=!0,s.playsInline=!0,await s.play(),P=s,w=!0})),S.append(i);const r=x("Switcher / router"),n=r.querySelector(".rack-body");n.append(F([{label:"View A (left structure)",value:"0"},{label:"View B (right structure)",value:"1"},{label:"View C (front camera)",value:"2"},{label:"Mix A+B",value:"3"},{label:"Split A | B",value:"4"}],String(e.view),s=>e.view=Number(s)),F([{label:"60 fps smooth",value:"60"},{label:"30 fps",value:"30"},{label:"24 fps stutter",value:"24"}],String(e.fps),s=>e.fps=Number(s)),F([{label:"960×540",value:"540"},{label:"1280×720",value:"720"},{label:"1920×1080",value:"1080"}],String(e.resolution),s=>c.resize(Number(s))),G("Linked rods",e.linkedRods,s=>e.linkedRods=s),G("Insanity",e.insanity,s=>e.insanity=s),G("Quantize cuts",e.quantize,s=>e.quantize=s)),h(n,"Mix A/B",0,1,e.mixAB,s=>e.mixAB=s),h(n,"BPM",40,200,e.bpm,s=>e.bpm=s,s=>String(Math.round(s))),h(n,"Cut len",.02,.9,e.cutLen,s=>e.cutLen=s),h(n,"Period",.25,8,e.period,s=>e.period=s),h(n,"Cross mix",0,1,e.otherAmt,s=>e.otherAmt=s),S.append(r);const l=x("Keyer (luma / chroma)"),d=l.querySelector(".rack-body");d.append(F([{label:"Key off",value:"0"},{label:"Luma key",value:"1"},{label:"Chroma key",value:"2"}],String(e.keyMode),s=>e.keyMode=Number(s))),h(d,"Clip",0,1,e.keyClip,s=>e.keyClip=s),h(d,"Gain",.01,1,e.keyGain,s=>e.keyGain=s),S.append(l),S.append(J("Structure A — rod + glass",e.A)),S.append(L("Monitor A top  H/S/B/C",e.A.top)),S.append(L("Monitor A bottom  H/S/B/C",e.A.bot)),S.append(J("Structure B — linked or free",e.B)),S.append(L("Monitor B top  H/S/B/C",e.B.top)),S.append(L("Monitor B bottom  H/S/B/C",e.B.bot)),S.append(J("Front camera / rotating monitor",e.C)),S.append(L("Monitor C  H/S/B/C",e.C.top));const f=x("Effects rack"),p=f.querySelector(".rack-body");h(p,"Noise",0,.12,e.noise,s=>e.noise=s),h(p,"Hue drift",0,.03,e.hueDrift,s=>e.hueDrift=s),h(p,"Aberration",0,.02,e.aberration,s=>e.aberration=s),h(p,"Persist",0,.8,e.persist,s=>e.persist=s),h(p,"Decay",.9,1.02,e.decay,s=>e.decay=s),h(p,"Barrel",0,.25,e.barrel,s=>e.barrel=s),h(p,"Edge",0,.8,e.edge,s=>e.edge=s),h(p,"Soft",0,4,e.soft,s=>e.soft=s),h(p,"Bloom",0,1.4,e.bloom,s=>e.bloom=s),h(p,"Smear",0,4,e.smear,s=>e.smear=s),h(p,"Warp",0,.05,e.warp,s=>e.warp=s),h(p,"Kaleido",0,12,e.kaleido,s=>e.kaleido=Math.round(s),s=>String(Math.round(s))),h(p,"Poster",0,12,e.poster,s=>e.poster=s),h(p,"Invert",0,1,e.invert,s=>e.invert=s),h(p,"Chroma",0,.5,e.chromaSep,s=>e.chromaSep=s),h(p,"Gamma",.5,1.6,e.gamma,s=>e.gamma=s),h(p,"Scan",0,.7,e.scan,s=>e.scan=s),h(p,"Vignette",0,.8,e.vignette,s=>e.vignette=s),h(p,"Feedback",.6,1.15,e.feedbackAmt,s=>e.feedbackAmt=s),S.append(f)}function Qe(){de.replaceChildren(),de.append(T("Trap / cut","cut play-keep",()=>c.trap("all")),T("Inject","play-keep",()=>c.inject(.9)),T("Trap A","cut console-only",()=>c.trap("A")),T("Trap B","cut console-only",()=>c.trap("B")),T("Into fractal","cut console-only",()=>{c.state.A.bottomSrc=2,c.state.B.bottomSrc=2,c.trap("A")}),T("Clear","play-keep",()=>{c.clear(),c.inject(.8)}),T("Freeze","console-only",()=>{c.state.frozen=!c.state.frozen}),T("Rec knobs","rec console-only",()=>{q=!q,z=!1,q&&(B=[])}),T("Play knobs","console-only",()=>{B.length<2||(z=!z,q=!1,O=0)}),T("Still","play-keep",()=>{const e=document.createElement("a");e.download=`herder-${Date.now()}.png`,e.href=M.toDataURL("image/png"),e.click()}))}Qe();H("king-glass");var pe;(pe=document.querySelector("#enter"))==null||pe.addEventListener("click",()=>{Me.classList.add("hidden"),sessionStorage.setItem("dlh-entered","1"),Ce()});sessionStorage.getItem("dlh-entered")&&(Me.classList.add("hidden"),Ce());var me;(me=document.querySelector("#coach-next"))==null||me.addEventListener("click",Ze);var ve;(ve=document.querySelector("#coach-skip"))==null||ve.addEventListener("click",()=>{ae.classList.add("hidden"),localStorage.setItem("dlh-coached","1")});const Be=()=>N.classList.remove("hidden"),Fe=()=>N.classList.add("hidden");var ye;(ye=document.querySelector("#open-about"))==null||ye.addEventListener("click",Be);var be;(be=document.querySelector("#open-about-gate"))==null||be.addEventListener("click",Be);var ge;(ge=document.querySelector("#close-about"))==null||ge.addEventListener("click",Fe);N.addEventListener("click",e=>{e.target===N&&Fe()});var Se;(Se=document.querySelector("#mode-play"))==null||Se.addEventListener("click",()=>{document.body.classList.remove("mode-console"),document.body.classList.add("mode-play")});var Ae;(Ae=document.querySelector("#mode-console"))==null||Ae.addEventListener("click",()=>{document.body.classList.remove("mode-play"),document.body.classList.add("mode-console")});oe()&&c.resize(540);M.addEventListener("pointerdown",e=>{M.setPointerCapture(e.pointerId)});M.addEventListener("pointermove",e=>{e.buttons&&(c.state.A.panX+=e.movementX*.0015,c.state.A.panY-=e.movementY*.0015)});let he=0;M.addEventListener("pointerup",e=>{if(e.pointerType!=="touch")return;const t=performance.now();t-he<280&&c.trap("all"),he=t});M.addEventListener("dblclick",()=>c.trap("all"));window.addEventListener("keydown",e=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;const t=c.state.A;if(e.code==="Space"&&(e.preventDefault(),c.trap("all")),e.key==="i"&&(c.state.insanity=!c.state.insanity),e.key==="f"&&(c.state.frozen=!c.state.frozen),e.key==="r"&&(c.clear(),c.inject(.8)),e.key==="q"&&(t.rotate-=.04),e.key==="e"&&(t.rotate+=.04),e.key==="w"&&(t.zoom=Math.min(.9,t.zoom+.01)),e.key==="s"&&(t.zoom=Math.max(.34,t.zoom-.01)),e.key==="a"&&(t.panX-=.01),e.key==="d"&&(t.panX+=.01),e.key>="1"&&e.key<="9"){const i=R[Number(e.key)-1];i&&H(i.id)}});function De(e){if(Re(),w&&P&&P.readyState>=2&&c.setSeed(P),q&&B.length<2400&&B.push(structuredClone(c.state)),z&&B.length){O=(O+1)%B.length;const i=B[O],a=c.state;a.A=i.A,a.B=i.B,a.C=i.C,a.insanity=i.insanity,a.noise=i.noise,a.hueDrift=i.hueDrift,a.decay=i.decay}if(c.tick(e),Z++,e-Q>500){const i=Math.round(Z*1e3/(e-Q));Ye.textContent=`${i} FPS · ${c.state.fps} lock`,Z=0,Q=e}const t=c.state.A.bottomSrc;$e.textContent=c.state.insanity?"INSANITY":t===0?"SEED ARMED":t===2?"CROSS LOOP":"TRAPPED",requestAnimationFrame(De)}window.addEventListener("resize",Re);requestAnimationFrame(De);
