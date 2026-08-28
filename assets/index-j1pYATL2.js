var we=Object.defineProperty;var Fe=(e,t,s)=>t in e?we(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var f=(e,t,s)=>Fe(e,typeof t!="symbol"?t+"":t,s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function s(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function a(r){if(r.ep)return;r.ep=!0;const c=s(r);fetch(r.href,c)}})();function De(e){const t=e.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"});if(!t)throw new Error("WebGL2 is required for Digital Light Herder.");return t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,1),t}function se(e,t,s){const a=e.createShader(t);if(!a)throw new Error("createShader failed");if(e.shaderSource(a,s),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS)){const r=e.getShaderInfoLog(a)??"unknown";throw e.deleteShader(a),new Error(r)}return a}function re(e,t,s){const a=e.createProgram();if(!a)throw new Error("createProgram failed");const r=se(e,e.VERTEX_SHADER,t),c=se(e,e.FRAGMENT_SHADER,s);if(e.attachShader(a,r),e.attachShader(a,c),e.linkProgram(a),e.deleteShader(r),e.deleteShader(c),!e.getProgramParameter(a,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(a)??"link failed");return a}function ie(e,t,s){const a=e.createTexture(),r=e.createFramebuffer();if(!a||!r)throw new Error("FBO alloc failed");e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,t,s,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0);const c=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;if(e.bindFramebuffer(e.FRAMEBUFFER,null),!c)throw new Error("incomplete framebuffer");return{tex:a,fbo:r,w:t,h:s}}function Ie(e){const t=e.createTexture();if(!t)throw new Error("texture alloc failed");return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,4,4,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(64)),t}function Ue(e,t,s){e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,e.RGBA,e.UNSIGNED_BYTE,s)}function ne(e,t){const s=e.createVertexArray(),a=e.createBuffer();if(!s||!a)throw new Error("vao failed");e.bindVertexArray(s),e.bindBuffer(e.ARRAY_BUFFER,a),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const r=e.getAttribLocation(t,"aPos");return e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),s}class ce{constructor(t,s){f(this,"cache",new Map);this.gl=t,this.prog=s}loc(t){return this.cache.has(t)||this.cache.set(t,this.gl.getUniformLocation(this.prog,t)),this.cache.get(t)??null}i(t,s){this.gl.uniform1i(this.loc(t),s)}f(t,s){this.gl.uniform1f(this.loc(t),s)}v2(t,s,a){this.gl.uniform2f(this.loc(t),s,a)}v3(t,s,a,r){this.gl.uniform3f(this.loc(t),s,a,r)}}const le=`#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,_e=`#version 300 es
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
`,Le=`#version 300 es
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
`;function v(e=0,t=1.18,s=1,a=1.22){return{hue:e,sat:t,bright:s,contrast:a}}function b(e={}){return{zoom:.66,rotate:.08,panX:0,panY:0,spin:0,glassMix:1,copyRotate:Math.PI/2,copyScale:1,copyOffX:0,copyOffY:0,folds:2,delayFrames:0,delayMix:0,bottomSrc:0,flipH:!1,flipV:!1,top:v(),bot:v(.02,1.1,.94,1.12),...e}}function Ae(){return{A:b(),B:b({rotate:-.08,copyRotate:-Math.PI/2,top:v(.04,1.2,.95,1.4)}),C:b({zoom:.72,glassMix:.35,copyRotate:.5,folds:1}),linkedRods:!0,insanity:!1,frozen:!1,fps:60,view:0,scan:.08,vignette:.12,mixAB:.5,gamma:.92,noise:.016,aberration:.0015,persist:.26,decay:1,barrel:.02,edge:.06,hueDrift:.002,soft:0,bloom:.08,smear:0,warp:0,poster:0,invert:0,chromaSep:0,kaleido:0,keyMode:0,keyClip:.25,keyGain:.2,keyColor:[0,1,0],seedAmt:.05,feedbackAmt:1,quantize:!1,bpm:120,cutLen:.12,period:1,otherAmt:.85,resolution:720}}const Y=8;function qe(e){return e===540?[960,540]:e===1080?[1920,1080]:[1280,720]}class He{constructor(t){f(this,"gl");f(this,"canvas");f(this,"state",Ae());f(this,"feedback");f(this,"present");f(this,"uF");f(this,"uP");f(this,"vaoF");f(this,"vaoP");f(this,"A");f(this,"B");f(this,"C");f(this,"seedTex");f(this,"w",1280);f(this,"h",720);f(this,"lastPresent",0);f(this,"phase",0);f(this,"seedAmtA",0);f(this,"seedAmtB",0);f(this,"seedAmtC",0);f(this,"quantOn",!1);f(this,"quantT0",0);this.canvas=t,this.gl=De(t),this.feedback=re(this.gl,le,_e),this.present=re(this.gl,le,Le),this.uF=new ce(this.gl,this.feedback),this.uP=new ce(this.gl,this.present),this.vaoF=ne(this.gl,this.feedback),this.vaoP=ne(this.gl,this.present),this.seedTex=Ie(this.gl),this.A=this.makeLoop(),this.B=this.makeLoop(),this.C=this.makeLoop(2),this.resize(this.state.resolution)}makeLoop(t=Y){const s=[];for(let a=0;a<t;a++)s.push(ie(this.gl,this.w||1280,this.h||720));return{ring:s,write:0}}resize(t){const[s,a]=qe(t);if(this.state.resolution=t,s===this.w&&a===this.h&&this.A.ring.length)return;this.w=s,this.h=a;const r=c=>{const i=[];for(let u=0;u<c;u++)i.push(ie(this.gl,s,a));return{ring:i,write:0}};this.A=r(Y),this.B=r(Y),this.C=r(2),this.clear()}setSeed(t){Ue(this.gl,this.seedTex,t)}clear(){const t=this.gl;for(const s of[this.A,this.B,this.C]){for(const a of s.ring)t.bindFramebuffer(t.FRAMEBUFFER,a.fbo),t.viewport(0,0,this.w,this.h),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);s.write=0}t.bindFramebuffer(t.FRAMEBUFFER,null)}trap(t="all"){const s=(a,r)=>{a.bottomSrc===0?(a.bottomSrc=1,r(.85)):a.bottomSrc=0};(t==="A"||t==="all")&&s(this.state.A,a=>this.seedAmtA=a),(t==="B"||t==="all")&&s(this.state.B,a=>this.seedAmtB=a),(t==="C"||t==="all")&&s(this.state.C,a=>this.seedAmtC=a)}inject(t=.7){this.seedAmtA=Math.max(this.seedAmtA,t),this.seedAmtB=Math.max(this.seedAmtB,t),this.seedAmtC=Math.max(this.seedAmtC,t)}tick(t){if(this.state.frozen){this.drawPresent();return}const s=1e3/this.state.fps;if(t-this.lastPresent<s*.85&&this.lastPresent!==0){this.drawPresent();return}if(this.lastPresent=t,this.phase+=1,this.state.quantize){const u=6e4/Math.max(this.state.bpm,1)*Math.max(this.state.period,.05),d=u*Math.min(this.state.cutLen,.95);this.quantT0===0&&(this.quantT0=t);const p=(t-this.quantT0)%u<d;p!==this.quantOn&&(this.quantOn=p,this.trap("A"),this.trap("B"))}this.state.linkedRods&&(this.state.B.zoom=this.state.A.zoom,this.state.B.rotate=-this.state.A.rotate,this.state.B.panX=this.state.A.panX,this.state.B.panY=this.state.A.panY,this.state.B.spin=-this.state.A.spin),this.state.A.rotate+=this.state.A.spin*.016,this.state.B.rotate+=this.state.B.spin*.016,this.state.C.rotate+=this.state.C.spin*.016;const a=this.readTex(this.B,1),r=this.readTex(this.A,1);this.renderLoop(this.A,this.state.A,a,this.seedAmtA,this.state.insanity),this.renderLoop(this.B,this.state.B,r,this.seedAmtB,this.state.insanity),this.renderLoop(this.C,this.state.C,this.readTex(this.A,1),this.seedAmtC,!1);const c=this.state.seedAmt;this.seedAmtA=Math.max(this.seedAmtA*.92,c),this.seedAmtB=Math.max(this.seedAmtB*.92,c),this.seedAmtC=Math.max(this.seedAmtC*.92,c),this.drawPresent()}readTex(t,s){const a=t.ring.length,r=(t.write-s+a)%a;return t.ring[r].tex}renderLoop(t,s,a,r,c){const i=this.gl,u=t.ring.length,d=this.readTex(t,1),y=Math.min(Math.max(Math.round(s.delayFrames),1),u-1),p=this.readTex(t,y),h=t.ring[t.write];i.bindFramebuffer(i.FRAMEBUFFER,h.fbo),i.viewport(0,0,this.w,this.h),i.useProgram(this.feedback),i.bindVertexArray(this.vaoF),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,d),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,p),i.activeTexture(i.TEXTURE2),i.bindTexture(i.TEXTURE_2D,a),i.activeTexture(i.TEXTURE3),i.bindTexture(i.TEXTURE_2D,this.seedTex);const o=this.uF;o.i("uPrev",0),o.i("uDelay",1),o.i("uOther",2),o.i("uSeed",3),o.v2("uRes",this.w,this.h),o.f("uTime",this.phase/60),o.f("uZoom",s.zoom),o.f("uRotate",s.rotate),o.v2("uPan",s.panX,s.panY),o.f("uGlassMix",s.glassMix),o.f("uCopyRotate",s.copyRotate),o.f("uCopyScale",s.copyScale),o.v2("uCopyOffset",s.copyOffX,s.copyOffY),o.f("uFolds",s.folds),o.f("uKaleido",this.state.kaleido),o.f("uHue",s.top.hue),o.f("uSat",s.top.sat),o.f("uBright",s.top.bright),o.f("uContrast",s.top.contrast),o.f("uGamma",this.state.gamma),o.f("uHue2",s.bot.hue),o.f("uSat2",s.bot.sat),o.f("uBright2",s.bot.bright),o.f("uContrast2",s.bot.contrast),o.f("uNoise",this.state.noise),o.f("uAberration",this.state.aberration),o.f("uPersist",this.state.persist),o.f("uDecay",this.state.decay),o.f("uBarrel",this.state.barrel),o.f("uEdge",this.state.edge),o.f("uHueDrift",this.state.hueDrift),o.f("uSeedAmt",Math.max(this.state.seedAmt,r)),o.f("uOtherAmt",c?this.state.otherAmt:0),o.f("uDelayAmt",s.delayFrames>0?s.delayMix:0),o.f("uSoft",this.state.soft),o.f("uBloom",this.state.bloom),o.f("uSmear",this.state.smear),o.f("uPhase",this.phase),o.f("uWarp",this.state.warp),o.f("uPoster",this.state.poster),o.f("uInvert",this.state.invert),o.f("uChromaSep",this.state.chromaSep),o.f("uFeedbackAmt",this.state.feedbackAmt),o.i("uFlipH",s.flipH?1:0),o.i("uFlipV",s.flipV?1:0),o.i("uKeyMode",this.state.keyMode),o.f("uKeyClip",this.state.keyClip),o.f("uKeyGain",this.state.keyGain),o.v3("uKeyColor",this.state.keyColor[0],this.state.keyColor[1],this.state.keyColor[2]);const T=c&&s.bottomSrc!==0?2:s.bottomSrc;o.i("uBottomSrc",T),i.drawArrays(i.TRIANGLE_STRIP,0,4),t.write=(t.write+1)%u}drawPresent(){const t=this.gl,{width:s,height:a}=this.canvas;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,s,a),t.useProgram(this.present),t.bindVertexArray(this.vaoP),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.readTex(this.A,1)),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.readTex(this.B,1)),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.readTex(this.C,1)),this.uP.i("uA",0),this.uP.i("uB",1),this.uP.i("uC",2),this.uP.i("uView",this.state.view),this.uP.f("uScan",this.state.scan),this.uP.f("uVignette",this.state.vignette),this.uP.f("uMixAB",this.state.mixAB),t.drawArrays(t.TRIANGLE_STRIP,0,4)}}const A=()=>Ae(),J=[{id:"first-light",name:"First Light",hint:"Single-loop CRT middlespace, 1988 dorm room",apply:()=>{const e=A();return e.A=b({zoom:.86,rotate:.06,glassMix:0,copyRotate:0,folds:1}),e.A.top=v(0,.9,.98,1.15),e.view=0,e.insanity=!1,e.hueDrift=.01,e.noise=.025,e.barrel=.08,e.scan=.32,e}},{id:"king-glass",name:"King Glass",hint:"Peter King 1997 — two monitors through 50/50 glass, 90° fold",apply:()=>{const e=A();return e.A=b({zoom:.68,rotate:.1,glassMix:1,copyRotate:Math.PI/2,copyScale:1,folds:2}),e.A.top=v(-.02,1.25,.92,1.28),e.A.bot=v(.05,1.2,.92,1.22),e.view=0,e.edge=.1,e}},{id:"fair-captive",name:"Fair Captive",hint:"Arm seed, then Trap — Magritte / Hofstadter recursion",apply:()=>{const e=A();return e.A=b({zoom:.6,rotate:.04,glassMix:1,copyRotate:.85,folds:2,delayFrames:5,delayMix:.28}),e.A.bottomSrc=0,e.A.top=v(.01,1.08,.97,1.22),e.persist=.22,e}},{id:"insanity",name:"Insanity Mode",hint:"A makes B makes A — fractals of fractals",apply:()=>{const e=A();return e.insanity=!0,e.A=b({zoom:.55,rotate:.2,glassMix:1,copyRotate:1.57,folds:2}),e.B=b({zoom:.52,rotate:-.16,glassMix:1,copyRotate:-1.4,folds:2}),e.A.bottomSrc=2,e.B.bottomSrc=2,e.A.top=v(-.04,1.4,.94,1.4),e.B.top=v(.08,1.3,.94,1.36),e.view=4,e.otherAmt=.85,e}},{id:"sierpinski",name:"Sierpiński Zone",hint:"Three contracted copies — nested triangles",apply:()=>{const e=A();return e.A=b({zoom:.5,rotate:0,glassMix:1,copyRotate:2.094395,copyScale:1,folds:3}),e.A.top=v(.1,.45,.98,1.55),e.A.bot=v(.1,.45,.98,1.55),e.gamma=.88,e.edge=.18,e.noise=.008,e.hueDrift=0,e.bloom=0,e}},{id:"jellyfish",name:"Jellyfish",hint:"Organic light creatures from the HD years",apply:()=>{const e=A();return e.A=b({zoom:.64,rotate:.35,spin:.1,glassMix:1,copyRotate:1.1,copyScale:1.05,folds:2}),e.A.top=v(.55,1.55,.94,1.28),e.A.bot=v(.62,1.35,.94,1.2),e.warp=.008,e.smear=.8,e.persist=.28,e.bloom=.35,e.soft=.35,e.hueDrift=.005,e}},{id:"fern",name:"Barnsley Fern",hint:"Unequal copies + offset — foliage IFS",apply:()=>{const e=A();return e.A=b({zoom:.54,rotate:.4,glassMix:1,copyRotate:2.45,copyScale:.72,copyOffX:.08,copyOffY:-.04,folds:2}),e.A.top=v(.28,1.5,.96,1.4),e.edge=.14,e}},{id:"light-hurt",name:"Light Hurt",hint:"Overdriven session — delay + hue cycle",apply:()=>{const e=A();return e.A=b({zoom:.57,rotate:.5,spin:.18,glassMix:1,copyRotate:1.2,folds:2,delayFrames:6,delayMix:.4}),e.B=b({zoom:.53,rotate:-.4,spin:-.12,glassMix:1,copyRotate:-1.1,folds:2,delayFrames:5,delayMix:.32}),e.insanity=!0,e.A.bottomSrc=2,e.B.bottomSrc=2,e.A.top=v(0,1.7,.92,1.45),e.hueDrift=.01,e.aberration=.006,e.chromaSep=.12,e.bloom=.4,e.view=3,e.fps=24,e}},{id:"stutter-24",name:"24fps Stutter",hint:"Router frame-rate trick — cinema smear",apply:()=>{const e=A();return e.fps=24,e.A.delayFrames=2,e.A.delayMix=.3,e.smear=1.4,e.persist=.18,e.scan=.08,e}},{id:"kaleid",name:"Kaleid Herd",hint:"Six-fold IFS + glass mixer",apply:()=>{const e=A();return e.A=b({zoom:.48,rotate:.08,spin:.05,glassMix:1,copyRotate:Math.PI/3,folds:6}),e.A.top=v(.08,1.25,.95,1.35),e.bloom=.2,e}},{id:"front-cam",name:"Front Camera",hint:"Rotating monitor loop — objects, poems, guitar",apply:()=>{const e=A();return e.view=2,e.C=b({zoom:.7,rotate:.15,spin:.35,glassMix:.4,copyRotate:.4,folds:1}),e.C.top=v(.02,1.12,.97,1.2),e.C.bottomSrc=0,e}},{id:"middlespace",name:"Middlespace",hint:"Tiny zone between on and off",apply:()=>{const e=A();return e.A=b({zoom:.78,rotate:.03,glassMix:.35,copyRotate:.4,folds:2}),e.A.top=v(0,.75,.99,1.08),e.noise=.03,e.persist=.04,e.edge=.03,e.bloom=0,e}}];function Oe(e=1024){const t=document.createElement("canvas");return t.width=e,t.height=e,t}function H(e){const t=Math.sin(e*127.1)*43758.5453;return t-Math.floor(t)}function ee(e,t,s=0){const a=e.canvas.width,r=e.canvas.height;if(e.fillStyle="#000",e.fillRect(0,0,a,r),t==="plasma"){const i=e.createImageData(a,r);for(let u=0;u<r;u+=2)for(let d=0;d<a;d+=2){const y=d/a,p=u/r,h=.5+.5*Math.sin(y*12+s)*Math.sin(p*9-s*.7)*Math.sin((y+p)*7+s*.3),o=(.5+.5*Math.sin(h*6.2+.2))*255,T=(.5+.5*Math.sin(h*5.1+2.1))*255,M=(.5+.5*Math.sin(h*7.4+4.2))*255,m=(u*a+d)*4;i.data[m]=o,i.data[m+1]=T,i.data[m+2]=M,i.data[m+3]=255}e.putImageData(i,0,0),e.filter="blur(8px)",e.drawImage(e.canvas,0,0),e.filter="none";return}if(t==="burst"){for(let i=0;i<40;i++){const u=H(i+1)*a,d=H(i+9)*r,y=40+H(i+17)*180,p=e.createRadialGradient(u,d,0,u,d,y);p.addColorStop(0,`hsla(${(H(i)*360+s*40)%360}, 90%, 62%, 0.85)`),p.addColorStop(1,"transparent"),e.fillStyle=p,e.fillRect(0,0,a,r)}return}if(t==="sun"){const i=e.createRadialGradient(a*.5,r*.5,20,a*.5,r*.5,a*.42);i.addColorStop(0,"#fff6d0"),i.addColorStop(.25,"#ffb347"),i.addColorStop(.55,"#ff3355"),i.addColorStop(1,"#000"),e.fillStyle=i,e.fillRect(0,0,a,r),e.strokeStyle="rgba(255,220,120,0.35)",e.lineWidth=6;for(let u=0;u<16;u++){const d=u/16*Math.PI*2+s*.2;e.beginPath(),e.moveTo(a*.5,r*.5),e.lineTo(a*.5+Math.cos(d)*a*.48,r*.5+Math.sin(d)*r*.48),e.stroke()}return}if(t==="glyphs"){e.fillStyle="#0a0610",e.fillRect(0,0,a,r),e.fillStyle="#f4e8c1",e.font=`700 ${Math.floor(a/7)}px Georgia, serif`,e.textAlign="center",e.textBaseline="middle",["THE FAIR","CAPTIVE","RECURSION","IS THE KEY"].forEach((u,d)=>e.fillText(u,a/2,r*(.22+d*.18))),e.strokeStyle="rgba(255,80,40,0.7)",e.lineWidth=14,e.beginPath(),e.ellipse(a*.5,r*.5,a*.38,r*.42,.1,0,Math.PI*2),e.stroke();return}if(t==="noise"){const i=e.createImageData(a,r);for(let u=0;u<i.data.length;u+=4){const d=Math.random()*255;i.data[u]=d,i.data[u+1]=d*.85,i.data[u+2]=d*.7,i.data[u+3]=255}e.putImageData(i,0,0);return}if(t==="grid"){const i=["#e23d2b","#f4c430","#2ec4b6","#7b5cff","#ff7a18","#f5f0e6"],d=a/4;for(let y=0;y<4;y++)for(let p=0;p<4;p++)e.fillStyle=i[(p+y*2)%i.length],e.fillRect(p*d,y*d,d+1,d+1);e.strokeStyle="#0a0604",e.lineWidth=18,e.strokeRect(10,10,a-20,r-20),e.strokeStyle="#ffffff",e.lineWidth=6,e.strokeRect(a*.18,r*.18,a*.64,r*.64);return}const c=e.createLinearGradient(0,0,0,r);c.addColorStop(0,"#6aa8e8"),c.addColorStop(1,"#f3d5a0"),e.fillStyle=c,e.fillRect(0,0,a,r),e.fillStyle="#c45c2a",e.beginPath(),e.arc(a*.5,r*.42,a*.18,0,Math.PI*2),e.fill(),e.fillStyle="#1a120c",e.fillRect(a*.42,r*.55,a*.16,r*.28),e.beginPath(),e.ellipse(a*.62,r*.62,a*.16,r*.08,.4,0,Math.PI*2),e.fill(),e.fillStyle="#fff",e.font=`italic 700 ${Math.floor(a/18)}px Georgia, serif`,e.textAlign="center",e.fillText("trap me",a/2,r*.92)}const P=[{id:"king-glass",name:"King Glass",tag:"The fractal trick",blurb:"Two monitors through 50/50 glass at 90°. This is Peter King’s 1997 move — the one that made Blair’s machine make fractals, not just tunnels.",preset:"king-glass",seed:"grid",spin:.06},{id:"first-light",name:"First Light",tag:"UCSC 1988",blurb:"One camera, one screen, the middlespace. Hue drift like old NTSC. This is the dorm-room loop before the glass.",preset:"first-light",seed:"sun",spin:.04},{id:"fair-captive",name:"Fair Captive",tag:"Trap a picture",blurb:"Arm a seed, then Trap. The image leaves the source and lives only in the loop — Magritte’s canvas in a canvas, the way Hofstadter explained recursion.",preset:"fair-captive",seed:"portrait",spin:.03},{id:"sierpinski",name:"Sierpiński",tag:"Nested triangles",blurb:"Three contracted copies. Hofstadter saw gaskets in Blair’s HD work. Smaller Scale / rod = more generations on screen.",preset:"sierpinski",seed:"grid",spin:.04},{id:"jellyfish",name:"Jellyfish",tag:"Light creatures",blurb:"The HD years: organic, phosphor-smeared animals that should not exist. Herd Bright and Contrast to keep them alive.",preset:"jellyfish",seed:"burst",spin:.1},{id:"fern",name:"Fern",tag:"IFS foliage",blurb:"Unequal copies and a shove. Barnsley-adjacent — the glass fold as a plant.",preset:"fern",seed:"grid",spin:.05},{id:"insanity",name:"Insanity",tag:"They make each other",blurb:"Loop A writes Loop B writes Loop A. Blair’s phrase. Hard to hold. Glorious when it holds.",preset:"insanity",seed:"plasma",spin:.08},{id:"light-hurt",name:"Light Hurt",tag:"Overdriven",blurb:"Delay, hue walk, 24fps stutter. The long session at the end of the 4K video. Turn Contrast until it bites.",preset:"light-hurt",seed:"burst",spin:.16},{id:"kaleid",name:"Kaleid",tag:"Six-fold",blurb:"Rotational copies stacked on the glass mixer. Mandala that still breathes.",preset:"kaleid",seed:"sun",spin:.07}];class ze{constructor(t,s){f(this,"el");f(this,"opts");f(this,"value");f(this,"dragging",!1);f(this,"lastY",0);f(this,"pointerId",-1);this.opts=s,this.value=s.value,this.el=document.createElement("div"),this.el.className="knob-wrap",this.el.innerHTML=`
      <div class="knob" role="slider" tabindex="0" aria-label="${t}">
        <div class="knob-face"><i></i></div>
      </div>
      <span class="knob-val"></span>
      <span class="knob-lab">${t}</span>
    `;const a=this.el.querySelector(".knob");a.addEventListener("pointerdown",c=>{this.dragging=!0,this.lastY=c.clientY,this.pointerId=c.pointerId,a.setPointerCapture(c.pointerId),c.preventDefault()}),a.addEventListener("pointermove",c=>{if(!this.dragging||c.pointerId!==this.pointerId)return;const i=c.shiftKey?.12:1,u=(this.lastY-c.clientY)*i;this.lastY=c.clientY;const d=this.opts.max-this.opts.min;this.set(this.value+u/140*d)});const r=()=>{this.dragging=!1};a.addEventListener("pointerup",r),a.addEventListener("pointercancel",r),a.addEventListener("dblclick",()=>this.set((this.opts.min+this.opts.max)/2)),a.addEventListener("keydown",c=>{const i=this.opts.max-this.opts.min;c.key==="ArrowUp"&&this.set(this.value+i*.02),c.key==="ArrowDown"&&this.set(this.value-i*.02)}),a.addEventListener("wheel",c=>{c.preventDefault();const i=this.opts.max-this.opts.min;this.set(this.value+(c.deltaY>0?-1:1)*i*.02)},{passive:!1}),this.render()}set(t,s=!1){const a=this.opts.step?Math.round(t/this.opts.step)*this.opts.step:t;this.value=Math.min(this.opts.max,Math.max(this.opts.min,a)),this.render(),s||this.opts.onChange(this.value)}get(){return this.value}render(){const s=-135+(this.value-this.opts.min)/(this.opts.max-this.opts.min)*270;this.el.querySelector(".knob-face").style.setProperty("--ang",`${s}deg`);const r=this.el.querySelector(".knob-val");r.textContent=this.opts.format?this.opts.format(this.value):this.value.toFixed(this.value>=10?0:2)}}function L(e,t,s){const a=document.createElement("button");return a.type="button",a.className=`tog ${t?"on":""}`,a.innerHTML=`<b></b><span>${e}</span>`,a.addEventListener("click",()=>{t=!t,a.classList.toggle("on",t),s(t)}),a}function S(e,t,s){const a=document.createElement("button");return a.type="button",a.className=`act ${t}`,a.textContent=e,a.addEventListener("click",s),a}function R(e){const t=document.createElement("section");return t.className="rack",t.innerHTML=`<h3>${e}</h3><div class="rack-body"></div>`,t}const x=document.querySelector("#view"),g=document.querySelector("#desk"),ue=document.querySelector("#transport"),Se=document.querySelector("#hint"),Ge=document.querySelector("#fps"),Xe=document.querySelector("#mode"),W=document.querySelector("#sessions"),D=document.querySelector("#play-herd"),Ee=document.querySelector("#gate"),X=document.querySelector("#about"),te=document.querySelector("#coach"),xe=document.querySelector("#coach-copy"),Ne=document.querySelector("#play-nudge"),n=new He(x),E=Oe(1024);let F="grid",C=!1,I=null,k=null,$=0,j=performance.now(),_=!1,O=!1,B=[],z=0,Q="king-glass",ae="king-glass",G=0;const N=["Each chip is a different universe. Open one. Then another. There is no bottom.","Scale is depth — smaller means more nested copies. Bright and Contrast are how you steer.","Trap locks a picture in the loop. Double-tap the screen. Then go as far as it will take you."];function oe(){return window.matchMedia("(max-width: 800px)").matches}ee(E.getContext("2d"),F);n.setSeed(E);n.inject(1);function Te(){const e=x.getBoundingClientRect(),t=Math.min(window.devicePixelRatio||1,oe()?1.5:2),s=Math.max(480,Math.floor(e.width*t)),a=Math.max(270,Math.floor(e.height*t));(x.width!==s||x.height!==a)&&(x.width=s,x.height=a)}function K(e,t=2){return e.toFixed(t)}function l(e,t,s,a,r,c,i){const u=new ze(t,{min:s,max:a,value:r,onChange:c,format:i});return e.append(u.el),u}function U(e,t){const s=R(e),a=s.querySelector(".rack-body");return l(a,"Hue",-.5,.5,t.hue,r=>t.hue=r,r=>K(r*360,0)+"°"),l(a,"Sat",0,2.2,t.sat,r=>t.sat=r),l(a,"Bright",0,1.4,t.bright,r=>t.bright=r),l(a,"Contrast",.4,2.2,t.contrast,r=>t.contrast=r),s}function Z(e,t){const s=R(e),a=s.querySelector(".rack-body");return l(a,"Scale / rod",.34,.9,t.zoom,r=>t.zoom=r),l(a,"Tiller",-3.14,3.14,t.rotate,r=>t.rotate=r,r=>K(r*180/Math.PI,0)+"°"),l(a,"Spin",-1.2,1.2,t.spin,r=>t.spin=r),l(a,"Pan X",-.25,.25,t.panX,r=>t.panX=r),l(a,"Pan Y",-.25,.25,t.panY,r=>t.panY=r),l(a,"Glass",0,1,t.glassMix,r=>t.glassMix=r),l(a,"Copy °",-3.14,3.14,t.copyRotate,r=>t.copyRotate=r,r=>K(r*180/Math.PI,0)),l(a,"Copy zm",.6,1.4,t.copyScale,r=>t.copyScale=r),l(a,"Folds",1,8,t.folds,r=>t.folds=Math.round(r),r=>String(Math.round(r))),l(a,"Delay fr",0,7,t.delayFrames,r=>t.delayFrames=Math.round(r),r=>String(Math.round(r))),l(a,"Delay mix",0,1,t.delayMix,r=>t.delayMix=r),a.append(L("Flip H",t.flipH,r=>t.flipH=r),L("Flip V",t.flipV,r=>t.flipV=r)),s}function q(e){const t=P.find(a=>a.id===e)??P[0];Q=t.preset,ae=t.id,F=t.seed,C=!1,k=null,ee(E.getContext("2d"),F),n.setSeed(E);const s=J.find(a=>a.id===t.preset);s&&(n.state=s.apply(),t.spin!=null&&(n.state.A.spin=t.spin),Math.abs(n.state.A.spin)<.02&&(n.state.A.spin=.05),n.state.seedAmt=Math.max(n.state.seedAmt,.05),n.state.persist=Math.max(n.state.persist,.24),n.state.feedbackAmt=Math.max(n.state.feedbackAmt,1),oe()&&n.resize(540),Se.textContent=`${t.blurb} Smaller Scale = deeper nests.`,Ne.textContent=`${t.name} · ${t.tag}. Trap locks a picture. Double-tap to go further.`,n.inject(1),t.preset!=="fair-captive"&&(n.state.A.bottomSrc=1,n.state.B.bottomSrc=1,n.state.C.bottomSrc=1),Re(),ke(),Ye())}function Ke(){const e=P.filter(s=>s.id!==ae),t=e[Math.floor(Math.random()*e.length)]??P[0];q(t.id)}function Me(){localStorage.getItem("dlh-coached")||(te.classList.remove("hidden"),xe.textContent=N[G]??N[0])}function Ve(){if(G+=1,G>=N.length){te.classList.add("hidden"),localStorage.setItem("dlh-coached","1");return}xe.textContent=N[G]}function Ye(){W.replaceChildren();const e=document.createElement("button");e.type="button",e.className="session-chip surprise",e.innerHTML="<b>Wild card</b>Surprise me",e.addEventListener("click",Ke),W.append(e);for(const t of P){const s=document.createElement("button");s.type="button",s.className=`session-chip${t.id===ae?" on":""}`,s.innerHTML=`<b>${t.tag}</b>${t.name}`,s.addEventListener("click",()=>q(t.id)),W.append(s)}}function ke(){const e=n.state.A;D.replaceChildren(),l(D,"Scale",.34,.9,e.zoom,t=>e.zoom=t),l(D,"Tiller",-3.14,3.14,e.rotate,t=>e.rotate=t,t=>K(t*180/Math.PI,0)+"°"),l(D,"Bright",0,1.4,e.top.bright,t=>e.top.bright=t),l(D,"Contrast",.4,2.2,e.top.contrast,t=>e.top.contrast=t)}function w(e,t,s){const a=document.createElement("select");for(const r of e){const c=document.createElement("option");c.value=r.value,c.textContent=r.label,a.append(c)}return a.value=t,a.addEventListener("change",()=>s(a.value)),a}function Re(){const e=n.state;g.replaceChildren();const t=R("Presets");t.querySelector(".rack-body").append(w(J.map(o=>({label:o.name,value:o.id})),Q,o=>{const T=P.find(m=>m.preset===o);if(T){q(T.id);return}Q=o;const M=J.find(m=>m.id===o);M&&(n.state=M.apply(),n.state.seedAmt=Math.max(n.state.seedAmt,.05),n.state.persist=Math.max(n.state.persist,.24),Math.abs(n.state.A.spin)<.02&&(n.state.A.spin=.05),Se.textContent=M.hint,Re(),ke(),n.inject(.85),o!=="fair-captive"&&(n.state.A.bottomSrc=1,n.state.B.bottomSrc=1,n.state.C.bottomSrc=1))})),g.append(t);const s=R("Seed / playback unit"),a=s.querySelector(".rack-body");a.append(w([{label:"Tiles / monitors",value:"grid"},{label:"Color burst",value:"burst"},{label:"Plasma",value:"plasma"},{label:"Sun",value:"sun"},{label:"Glyphs / poem",value:"glyphs"},{label:"Noise",value:"noise"},{label:"Fair captive",value:"portrait"}],F,o=>{F=o,C=!1,ee(E.getContext("2d"),F),n.setSeed(E)}),S("Inject seed","",()=>n.inject(.9))),l(a,"Seed leak",0,.25,e.seedAmt,o=>e.seedAmt=o);const r=document.createElement("label");r.className="file",r.textContent="Load image / video";const c=document.createElement("input");c.type="file",c.accept="image/*,video/*",c.addEventListener("change",()=>{var M;const o=(M=c.files)==null?void 0:M[0];if(!o)return;const T=URL.createObjectURL(o);if(o.type.startsWith("video")){const m=document.createElement("video");m.src=T,m.loop=!0,m.muted=!0,m.playsInline=!0,m.play(),k=m,C=!0}else{const m=new Image;m.onload=()=>{const V=E.getContext("2d");V.fillStyle="#000",V.fillRect(0,0,E.width,E.height),V.drawImage(m,0,0,E.width,E.height),n.setSeed(E),C=!1,k=null},m.src=T}}),r.append(c),a.append(r),a.append(S("Webcam","",async()=>{if(I){I.getTracks().forEach(T=>T.stop()),I=null,k=null,C=!1;return}I=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"}});const o=document.createElement("video");o.srcObject=I,o.muted=!0,o.playsInline=!0,await o.play(),k=o,C=!0})),g.append(s);const i=R("Switcher / router"),u=i.querySelector(".rack-body");u.append(w([{label:"View A (left structure)",value:"0"},{label:"View B (right structure)",value:"1"},{label:"View C (front camera)",value:"2"},{label:"Mix A+B",value:"3"},{label:"Split A | B",value:"4"}],String(e.view),o=>e.view=Number(o)),w([{label:"60 fps smooth",value:"60"},{label:"30 fps",value:"30"},{label:"24 fps stutter",value:"24"}],String(e.fps),o=>e.fps=Number(o)),w([{label:"960×540",value:"540"},{label:"1280×720",value:"720"},{label:"1920×1080",value:"1080"}],String(e.resolution),o=>n.resize(Number(o))),L("Linked rods",e.linkedRods,o=>e.linkedRods=o),L("Insanity",e.insanity,o=>e.insanity=o),L("Quantize cuts",e.quantize,o=>e.quantize=o)),l(u,"Mix A/B",0,1,e.mixAB,o=>e.mixAB=o),l(u,"BPM",40,200,e.bpm,o=>e.bpm=o,o=>String(Math.round(o))),l(u,"Cut len",.02,.9,e.cutLen,o=>e.cutLen=o),l(u,"Period",.25,8,e.period,o=>e.period=o),l(u,"Cross mix",0,1,e.otherAmt,o=>e.otherAmt=o),g.append(i);const d=R("Keyer (luma / chroma)"),y=d.querySelector(".rack-body");y.append(w([{label:"Key off",value:"0"},{label:"Luma key",value:"1"},{label:"Chroma key",value:"2"}],String(e.keyMode),o=>e.keyMode=Number(o))),l(y,"Clip",0,1,e.keyClip,o=>e.keyClip=o),l(y,"Gain",.01,1,e.keyGain,o=>e.keyGain=o),g.append(d),g.append(Z("Structure A — rod + glass",e.A)),g.append(U("Monitor A top  H/S/B/C",e.A.top)),g.append(U("Monitor A bottom  H/S/B/C",e.A.bot)),g.append(Z("Structure B — linked or free",e.B)),g.append(U("Monitor B top  H/S/B/C",e.B.top)),g.append(U("Monitor B bottom  H/S/B/C",e.B.bot)),g.append(Z("Front camera / rotating monitor",e.C)),g.append(U("Monitor C  H/S/B/C",e.C.top));const p=R("Effects rack"),h=p.querySelector(".rack-body");l(h,"Noise",0,.12,e.noise,o=>e.noise=o),l(h,"Hue drift",0,.03,e.hueDrift,o=>e.hueDrift=o),l(h,"Aberration",0,.02,e.aberration,o=>e.aberration=o),l(h,"Persist",0,.8,e.persist,o=>e.persist=o),l(h,"Decay",.9,1.02,e.decay,o=>e.decay=o),l(h,"Barrel",0,.25,e.barrel,o=>e.barrel=o),l(h,"Edge",0,.8,e.edge,o=>e.edge=o),l(h,"Soft",0,4,e.soft,o=>e.soft=o),l(h,"Bloom",0,1.4,e.bloom,o=>e.bloom=o),l(h,"Smear",0,4,e.smear,o=>e.smear=o),l(h,"Warp",0,.05,e.warp,o=>e.warp=o),l(h,"Kaleido",0,12,e.kaleido,o=>e.kaleido=Math.round(o),o=>String(Math.round(o))),l(h,"Poster",0,12,e.poster,o=>e.poster=o),l(h,"Invert",0,1,e.invert,o=>e.invert=o),l(h,"Chroma",0,.5,e.chromaSep,o=>e.chromaSep=o),l(h,"Gamma",.5,1.6,e.gamma,o=>e.gamma=o),l(h,"Scan",0,.7,e.scan,o=>e.scan=o),l(h,"Vignette",0,.8,e.vignette,o=>e.vignette=o),l(h,"Feedback",.6,1.15,e.feedbackAmt,o=>e.feedbackAmt=o),g.append(p)}function We(){ue.replaceChildren(),ue.append(S("Trap / cut","cut play-keep",()=>n.trap("all")),S("Inject","play-keep",()=>n.inject(.9)),S("Trap A","cut console-only",()=>n.trap("A")),S("Trap B","cut console-only",()=>n.trap("B")),S("Into fractal","cut console-only",()=>{n.state.A.bottomSrc=2,n.state.B.bottomSrc=2,n.trap("A")}),S("Clear","play-keep",()=>{n.clear(),n.inject(.8)}),S("Freeze","console-only",()=>{n.state.frozen=!n.state.frozen}),S("Rec knobs","rec console-only",()=>{_=!_,O=!1,_&&(B=[])}),S("Play knobs","console-only",()=>{B.length<2||(O=!O,_=!1,z=0)}),S("Still","play-keep",()=>{const e=document.createElement("a");e.download=`herder-${Date.now()}.png`,e.href=x.toDataURL("image/png"),e.click()}))}We();q("king-glass");var fe;(fe=document.querySelector("#enter"))==null||fe.addEventListener("click",()=>{Ee.classList.add("hidden"),sessionStorage.setItem("dlh-entered","1"),Me()});sessionStorage.getItem("dlh-entered")&&(Ee.classList.add("hidden"),Me());var he;(he=document.querySelector("#coach-next"))==null||he.addEventListener("click",Ve);var pe;(pe=document.querySelector("#coach-skip"))==null||pe.addEventListener("click",()=>{te.classList.add("hidden"),localStorage.setItem("dlh-coached","1")});const Ce=()=>X.classList.remove("hidden"),Be=()=>X.classList.add("hidden");var me;(me=document.querySelector("#open-about"))==null||me.addEventListener("click",Ce);var ve;(ve=document.querySelector("#open-about-gate"))==null||ve.addEventListener("click",Ce);var ye;(ye=document.querySelector("#close-about"))==null||ye.addEventListener("click",Be);X.addEventListener("click",e=>{e.target===X&&Be()});var be;(be=document.querySelector("#mode-play"))==null||be.addEventListener("click",()=>{document.body.classList.remove("mode-console"),document.body.classList.add("mode-play")});var ge;(ge=document.querySelector("#mode-console"))==null||ge.addEventListener("click",()=>{document.body.classList.remove("mode-play"),document.body.classList.add("mode-console")});oe()&&n.resize(540);x.addEventListener("pointerdown",e=>{x.setPointerCapture(e.pointerId)});x.addEventListener("pointermove",e=>{e.buttons&&(n.state.A.panX+=e.movementX*.0015,n.state.A.panY-=e.movementY*.0015)});let de=0;x.addEventListener("pointerup",e=>{if(e.pointerType!=="touch")return;const t=performance.now();t-de<280&&n.trap("all"),de=t});x.addEventListener("dblclick",()=>n.trap("all"));window.addEventListener("keydown",e=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;const t=n.state.A;if(e.code==="Space"&&(e.preventDefault(),n.trap("all")),e.key==="i"&&(n.state.insanity=!n.state.insanity),e.key==="f"&&(n.state.frozen=!n.state.frozen),e.key==="r"&&(n.clear(),n.inject(.8)),e.key==="q"&&(t.rotate-=.04),e.key==="e"&&(t.rotate+=.04),e.key==="w"&&(t.zoom=Math.min(.9,t.zoom+.01)),e.key==="s"&&(t.zoom=Math.max(.34,t.zoom-.01)),e.key==="a"&&(t.panX-=.01),e.key==="d"&&(t.panX+=.01),e.key>="1"&&e.key<="9"){const s=P[Number(e.key)-1];s&&q(s.id)}});function Pe(e){if(Te(),C&&k&&k.readyState>=2&&n.setSeed(k),_&&B.length<2400&&B.push(structuredClone(n.state)),O&&B.length){z=(z+1)%B.length;const s=B[z],a=n.state;a.A=s.A,a.B=s.B,a.C=s.C,a.insanity=s.insanity,a.noise=s.noise,a.hueDrift=s.hueDrift,a.decay=s.decay}if(n.tick(e),$++,e-j>500){const s=Math.round($*1e3/(e-j));Ge.textContent=`${s} FPS · ${n.state.fps} lock`,$=0,j=e}const t=n.state.A.bottomSrc;Xe.textContent=n.state.insanity?"INSANITY":t===0?"SEED ARMED":t===2?"CROSS LOOP":"TRAPPED",requestAnimationFrame(Pe)}window.addEventListener("resize",Te);requestAnimationFrame(Pe);
