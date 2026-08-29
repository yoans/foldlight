import type { DeviceState } from "./state";

/** Home pose for knob-cams — Evolve walks these slowly when asked. */
export type HomePose = {
  zoom: number;
  rotate: number;
  spin: number;
  copyRotate: number;
  copyScale: number;
  panX: number;
  panY: number;
  glassMix: number;
  copyOffX: number;
  copyOffY: number;
  folds: number;
  delayFrames: number;
  hue: number;
  hue2: number;
  sat: number;
  sat2: number;
  bright: number;
  contrast: number;
  smear: number;
  warp: number;
  bloom: number;
  edge: number;
  persist: number;
  barrel: number;
  hueDrift: number;
  aberration: number;
  seedAmt: number;
  copyFalloff: number;
  kaleido: number;
  chromaSep: number;
  mixAB: number;
  otherAmt: number;
  gamma: number;
  bCopyRotate: number;
  bCopyScale: number;
  bFolds: number;
  bGlass: number;
  bDelay: number;
  bHue: number;
  cZoom: number;
  cRotate: number;
  cCopyRotate: number;
  cFolds: number;
  cGlass: number;
};

function clamp(n: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, n));
}

/** Irregular cam: fundamental + a faster harmonic so it doesn’t look like one LFO. */
function cam(t: number, period: number, phase: number): number {
  const a = (t / period) * Math.PI * 2 + phase;
  return Math.sin(a) + 0.45 * Math.sin(a * 2.37 + 1.1);
}

export function captureHome(S: DeviceState): HomePose {
  const A = S.A;
  const B = S.B;
  const C = S.C;
  return {
    zoom: A.zoom,
    rotate: A.rotate,
    spin: A.spin,
    copyRotate: A.copyRotate,
    copyScale: A.copyScale,
    panX: A.panX,
    panY: A.panY,
    glassMix: A.glassMix,
    copyOffX: A.copyOffX,
    copyOffY: A.copyOffY,
    folds: A.folds,
    delayFrames: A.delayFrames,
    hue: A.top.hue,
    hue2: A.bot.hue,
    sat: A.top.sat,
    sat2: A.bot.sat,
    bright: A.top.bright,
    contrast: A.top.contrast,
    smear: S.smear,
    warp: S.warp,
    bloom: S.bloom,
    edge: S.edge,
    persist: S.persist,
    barrel: S.barrel,
    hueDrift: S.hueDrift,
    aberration: S.aberration,
    seedAmt: S.seedAmt,
    copyFalloff: S.copyFalloff,
    kaleido: S.kaleido,
    chromaSep: S.chromaSep,
    mixAB: S.mixAB,
    otherAmt: S.otherAmt,
    gamma: S.gamma,
    bCopyRotate: B.copyRotate,
    bCopyScale: B.copyScale,
    bFolds: B.folds,
    bGlass: B.glassMix,
    bDelay: B.delayFrames,
    bHue: B.top.hue,
    cZoom: C.zoom,
    cRotate: C.rotate,
    cCopyRotate: C.copyRotate,
    cFolds: C.folds,
    cGlass: C.glassMix,
  };
}

function delayOf(frames: number): { frames: number; mix: number } {
  const f = clamp(Math.round(frames), 0, 30);
  return { frames: f, mix: f <= 0 ? 0 : 0.28 + (f / 30) * 0.42 };
}

/** Drive the live state from home. `amount` 0 = still, 1 = a slow walk. */
export function driveHome(S: DeviceState, home: HomePose, tSec: number, amount: number): void {
  const k = Math.max(0, Math.min(1, amount));
  if (k < 0.001) return;
  const A = S.A;
  const c = (period: number, phase: number, amp: number) => cam(tSec, period, phase) * amp * k;

  // Slow walk around home. Folds, delay, and kaleido stay put so the thought can finish.
  A.zoom = clamp(home.zoom + c(18.0, 0.2, 0.04), 0.32, 0.92);
  A.rotate = home.rotate + c(22.0, 1.7, 0.12);
  A.spin = clamp(home.spin + c(26.0, 1.4, 0.03), -0.2, 0.2);
  A.copyRotate = home.copyRotate + c(20.0, 1.1, 0.1);
  A.copyScale = clamp(home.copyScale + c(24.0, 2.2, 0.05), 0.4, 1.25);
  A.panX = clamp(home.panX + c(28.0, 0.7, 0.03), -0.16, 0.16);
  A.panY = clamp(home.panY + c(32.0, 1.8, 0.03), -0.16, 0.16);
  A.glassMix = clamp(home.glassMix + c(21.0, 1.4, 0.06), 0.12, 0.95);
  A.copyOffX = clamp(home.copyOffX + c(25.0, 0.9, 0.03), -0.16, 0.16);
  A.copyOffY = clamp(home.copyOffY + c(29.0, 2.1, 0.03), -0.16, 0.16);
  A.folds = home.folds;
  A.delayFrames = home.delayFrames;
  A.delayMix = delayOf(home.delayFrames).mix;

  A.top.hue = clamp(home.hue + c(16.0, 0.4, 0.08), -0.5, 0.5);
  A.bot.hue = clamp(home.hue2 + c(19.0, 2.6, 0.08), -0.5, 0.5);
  A.top.sat = clamp(home.sat + c(27.0, 0.8, 0.1), 0.55, 1.9);
  A.bot.sat = clamp(home.sat2 + c(30.0, 1.9, 0.08), 0.5, 1.8);
  A.top.bright = clamp(home.bright + c(23.0, 0.15, 0.04), 0.66, 1.14);
  A.bot.bright = clamp(home.bright * 0.93 + c(26.0, 1.6, 0.04), 0.62, 1.1);
  A.top.contrast = clamp(home.contrast + c(31.0, 2.0, 0.06), 0.9, 1.7);

  S.B.copyRotate = home.bCopyRotate + c(21.5, 2.8, 0.08);
  S.B.copyScale = clamp(home.bCopyScale + c(25.5, 0.5, 0.04), 0.4, 1.25);
  S.B.folds = home.bFolds;
  S.B.glassMix = clamp(home.bGlass + c(23.5, 3.1, 0.05), 0.12, 0.95);
  S.B.delayFrames = home.bDelay;
  S.B.delayMix = delayOf(home.bDelay).mix;
  S.B.top.hue = clamp(home.bHue + c(18.5, 2.4, 0.07), -0.5, 0.5);

  S.C.zoom = clamp(home.cZoom + c(27.0, 0.6, 0.04), 0.45, 0.88);
  S.C.rotate = home.cRotate + c(29.0, 2.0, 0.1);
  S.C.copyRotate = home.cCopyRotate + c(24.0, 1.6, 0.08);
  S.C.folds = home.cFolds;
  S.C.glassMix = clamp(home.cGlass + c(28.0, 0.9, 0.05), 0.12, 0.9);

  S.smear = clamp(home.smear + c(22.0, 0.55, 0.12), 0, 1.2);
  S.warp = clamp(home.warp + c(33.0, 1.3, 0.003), 0, 0.02);
  S.bloom = clamp(home.bloom + c(26.0, 2.8, 0.05), 0, 0.45);
  S.edge = clamp(home.edge + c(20.0, 0.25, 0.04), 0, 0.4);
  S.persist = clamp(home.persist + c(34.0, 1.05, 0.03), 0.06, 0.32);
  S.hueDrift = clamp(home.hueDrift + c(36.0, 0.6, 0.002), 0, 0.01);
  S.aberration = clamp(home.aberration + c(28.0, 1.7, 0.001), 0, 0.008);
  S.kaleido = home.kaleido;
  S.chromaSep = clamp(home.chromaSep + c(30.0, 2.2, 0.02), 0, 0.12);
}
