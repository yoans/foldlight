export const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FEEDBACK_FRAG = `#version 300 es
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
uniform float uSeedPulse;
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
uniform float uCopyFalloff;

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
  // Camera black level: the grey that deep generations average to dies here,
  // while anything with real colour in one channel survives.
  col = max(col - 0.015, 0.0) * 1.015;
  col = (col - 0.42) * con + 0.42;
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

// Where a monitor is. A rectangle with a short feather so it never draws a hard line.
// Black is transparent: a copy contributes only where it has light, so the picture's
// shape comes from what is on the monitors, never from this mask.
float monitorGate(vec2 suv) {
  vec2 q = abs(suv * 2.0 - 1.0);
  return 1.0 - smoothstep(0.9, 1.0, max(q.x, q.y));
}

vec3 sampleMonitor(sampler2D tex, vec2 suv) {
  if (uAberration > 0.0001) {
    vec2 dir = (suv - 0.5) * uAberration;
    return vec3(
      texture(tex, suv + dir).r,
      texture(tex, suv).g,
      texture(tex, suv - dir).b
    );
  }
  return texture(tex, suv).rgb;
}

// A copy on the glass. Outside its monitor there is nothing.
vec3 readMonitor(sampler2D tex, vec2 suv) {
  float gate = monitorGate(suv);
  if (gate < 0.004) return vec3(0.0);
  return sampleMonitor(tex, suv) * gate;
}

// The main monitor. Outside it, the old frame lingers and fades instead of cutting to black.
vec3 readBase(sampler2D tex, vec2 suv) {
  float gate = monitorGate(suv);
  float keep = mix(0.94, 0.42, smoothstep(1.0, 6.0, uFolds));
  vec3 ghost = texture(uPrev, vUv).rgb * keep;
  if (gate < 0.004) return ghost;
  return mix(ghost, sampleMonitor(tex, suv), gate);
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

  // Where the second monitor sits; the seed rescue below goes through this so it
  // arrives nested, never as a full-frame overlay.
  vec2 suvSeed;
  {
    float sc = uZoom * uCopyScale;
    float a = uRotate + stepA;
    float spread = (1.0 - sc) * 0.5;
    suvSeed = monitorUV(uv, sc, a, uPan + rot2(vec2(uCopyOffset.x, spread + uCopyOffset.y), a));
  }

  vec3 acc = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (i >= folds) break;
    float sc = uZoom * (i == 1 ? uCopyScale : 1.0);
    float a = uRotate + float(i) * stepA;
    float spread = (1.0 - sc) * 0.5;
    vec2 off = uPan + rot2(vec2(uCopyOffset.x, spread + uCopyOffset.y), a);
    vec2 suv = monitorUV(uv, sc, a, off);

    vec3 c;
    if (i == 0) {
      c = readBase(uPrev, suv);
    } else if (i == 1 && uBottomSrc == 0) {
      c = readMonitor(uSeed, suv);
    } else if (i == 1 && uBottomSrc == 2) {
      c = mix(readMonitor(uPrev, suv), readMonitor(uOther, suv), uOtherAmt);
    } else {
      c = readMonitor(uPrev, suv);
    }

    if (!(i == 1 && uBottomSrc == 0)) {
      c = mix(c, readMonitor(uSeed, suv), max(uSeedAmt, uSeedPulse * 0.7));
    }

    c *= pow(max(uCopyFalloff, 0.7), float(i));

    if (i == 1) c = grade(c, uHue2 + uHueDrift * 0.5, uSat2, uBright2, uContrast2, uGamma);
    else c = grade(c, uHue + uHueDrift, uSat, uBright, uContrast, uGamma);

    if (i == 0) acc = c;
    else if (i == 1) acc = mix(acc, mix(max(acc, c), screenBlend(acc, c), 0.7), uGlassMix);
    else acc = mix(max(acc, c), screenBlend(acc, c), 0.45);
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
    acc = mix(acc, mix(max(acc, c), screenBlend(acc, c), 0.7), uGlassMix);
  }

  // The late frame is another light on the glass: it adds where it is lit, nothing where it is dark.
  if (uDelayAmt > 0.001) {
    vec2 suv = monitorUV(uv, uZoom, uRotate, uPan);
    vec3 d = readMonitor(uDelay, suv);
    acc = mix(acc, mix(max(acc, d), screenBlend(acc, d), 0.5), uDelayAmt * 0.8);
  }

  // Full-frame reads below are ungated: they must not stamp a shape on the picture.
  if (uSmear > 0.001) {
    vec2 vel = rot2(vec2(0.0, 1.0), uRotate) * uSmear * 0.008;
    acc = mix(acc, texture(uPrev, uv + vel).rgb, 0.35);
  }

  if (uEdge > 0.001) {
    acc += (abs(dFdx(acc)) + abs(dFdy(acc))) * uEdge * 1.3;
  }

  if (uBloom > 0.001) {
    vec2 px = 2.5 / uRes;
    vec3 b =
      texture(uPrev, uv + vec2(px.x, 0.0)).rgb +
      texture(uPrev, uv - vec2(px.x, 0.0)).rgb +
      texture(uPrev, uv + vec2(0.0, px.y)).rgb +
      texture(uPrev, uv - vec2(0.0, px.y)).rgb;
    acc += max(b * 0.25 - 0.4, 0.0) * uBloom;
  }

  if (uSoft > 0.001) {
    vec2 px = uSoft / uRes;
    acc =
      acc * 0.55 +
      texture(uPrev, uv + vec2(px.x, 0.0)).rgb * 0.1125 +
      texture(uPrev, uv - vec2(px.x, 0.0)).rgb * 0.1125 +
      texture(uPrev, uv + vec2(0.0, px.y)).rgb * 0.1125 +
      texture(uPrev, uv - vec2(0.0, px.y)).rgb * 0.1125;
  }

  vec3 src = texture(uSeed, uv).rgb;
  if (uKeyMode == 1) {
    float k = smoothstep(uKeyClip, uKeyClip + max(uKeyGain, 0.001), luma(src));
    acc = mix(acc, src, k);
  } else if (uKeyMode == 2) {
    float k = 1.0 - smoothstep(uKeyClip, uKeyClip + max(uKeyGain, 0.001), distance(src, uKeyColor));
    acc = mix(acc, src, k);
  }

  // If the loop has gone dark, let the seed back in — nested on the second monitor,
  // not stamped across the frame.
  float live = luma(acc);
  float rescue = (1.0 - smoothstep(0.0, 0.09, live)) * 0.36;
  acc = mix(acc, readMonitor(uSeed, suvSeed) * 0.9, rescue);

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
  acc = mix(acc, old * 0.995, uPersist);
  acc *= uDecay * uFeedbackAmt;

  // Stable middle: lift the dim generations so the nest stays lit,
  // hold the bright ones so it never floods to white. Pure black stays black.
  float l = luma(acc);
  float lift = mix(1.2, 1.0, smoothstep(0.05, 0.46, l));
  float hold = mix(1.0, 0.66 / max(l, 0.1), smoothstep(0.58, 1.05, l));
  acc *= lift * hold;
  // Glass stacks wash toward grey; pull the chroma back as it brightens.
  float gray = luma(acc);
  acc = mix(vec3(gray), acc, 1.0 + 0.35 * smoothstep(0.4, 0.75, gray));

  fragColor = vec4(clamp(acc, 0.0, 1.0), 1.0);
}
`;

export const PRESENT_FRAG = `#version 300 es
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
`;
