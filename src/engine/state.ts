export type BottomSrc = 0 | 1 | 2;
export type KeyMode = 0 | 1 | 2;
export type ViewMode = 0 | 1 | 2 | 3 | 4;

export type MonitorKnobs = {
  hue: number;
  sat: number;
  bright: number;
  contrast: number;
};

export type LoopState = {
  zoom: number;
  rotate: number;
  panX: number;
  panY: number;
  spin: number;
  glassMix: number;
  copyRotate: number;
  copyScale: number;
  copyOffX: number;
  copyOffY: number;
  folds: number;
  delayFrames: number;
  delayMix: number;
  bottomSrc: BottomSrc;
  flipH: boolean;
  flipV: boolean;
  top: MonitorKnobs;
  bot: MonitorKnobs;
};

export type DeviceState = {
  A: LoopState;
  B: LoopState;
  C: LoopState;
  linkedRods: boolean;
  insanity: boolean;
  frozen: boolean;
  fps: 24 | 30 | 60;
  view: ViewMode;
  scan: number;
  vignette: number;
  mixAB: number;
  gamma: number;
  noise: number;
  aberration: number;
  persist: number;
  decay: number;
  barrel: number;
  edge: number;
  hueDrift: number;
  soft: number;
  bloom: number;
  smear: number;
  warp: number;
  poster: number;
  invert: number;
  chromaSep: number;
  kaleido: number;
  keyMode: KeyMode;
  keyClip: number;
  keyGain: number;
  keyColor: [number, number, number];
  seedAmt: number;
  feedbackAmt: number;
  quantize: boolean;
  bpm: number;
  cutLen: number;
  period: number;
  otherAmt: number;
  resolution: 540 | 720 | 1080;
  copyFalloff: number;
};

export function knobs(hue = 0, sat = 1.08, bright = 0.66, contrast = 1.32): MonitorKnobs {
  return { hue, sat, bright, contrast };
}

export function loop(partial: Partial<LoopState> = {}): LoopState {
  return {
    zoom: 0.66,
    rotate: 0.08,
    panX: 0,
    panY: 0,
    spin: 0,
    glassMix: 1,
    copyRotate: Math.PI / 2,
    copyScale: 1,
    copyOffX: 0,
    copyOffY: 0,
    folds: 2,
    delayFrames: 0,
    delayMix: 0,
    bottomSrc: 0,
    flipH: false,
    flipV: false,
    top: knobs(),
    bot: knobs(0.02, 1.0, 0.6, 1.18),
    ...partial,
  };
}

export function defaultState(): DeviceState {
  return {
    A: loop(),
    B: loop({ rotate: -0.08, copyRotate: -Math.PI / 2, top: knobs(0.04, 1.05, 0.6, 1.32) }),
    C: loop({ zoom: 0.72, glassMix: 0.35, copyRotate: 0.5, folds: 1 }),
    linkedRods: true,
    insanity: false,
    frozen: false,
    fps: 60,
    view: 0,
    scan: 0.08,
    vignette: 0.12,
    mixAB: 0.5,
    gamma: 0.92,
    noise: 0.016,
    aberration: 0.0015,
    persist: 0.1,
    decay: 1,
    barrel: 0.02,
    edge: 0.06,
    hueDrift: 0.002,
    soft: 0,
    bloom: 0.04,
    smear: 0,
    warp: 0,
    poster: 0,
    invert: 0,
    chromaSep: 0,
    kaleido: 0,
    keyMode: 0,
    keyClip: 0.25,
    keyGain: 0.2,
    keyColor: [0, 1, 0],
    seedAmt: 0.02,
    feedbackAmt: 1,
    quantize: false,
    bpm: 120,
    cutLen: 0.12,
    period: 1,
    otherAmt: 0.85,
    resolution: 720,
    copyFalloff: 0.78,
  };
}

export type KnobPath =
  | `A.${keyof LoopState}`
  | `B.${keyof LoopState}`
  | `C.${keyof LoopState}`
  | `A.top.${keyof MonitorKnobs}`
  | `A.bot.${keyof MonitorKnobs}`
  | `B.top.${keyof MonitorKnobs}`
  | `B.bot.${keyof MonitorKnobs}`
  | keyof DeviceState;
