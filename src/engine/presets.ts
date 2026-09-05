import { centerNest, defaultState, knobs, loop, type DeviceState } from "./state";

export type Preset = {
  id: string;
  name: string;
  hint: string;
  apply: () => DeviceState;
};

const base = () => defaultState();

/** Nested-copy look: deep scale, lit structure, extra folds fall off before white. */
function foldShow(opts: {
  zoom: number;
  folds: number;
  copyRotate: number;
  bright: number;
  sat?: number;
  contrast?: number;
  hue?: number;
  hue2?: number;
  copyFalloff?: number;
  persist?: number;
  edge?: number;
  bloom?: number;
  seedAmt?: number;
  copyScale?: number;
  copyOffX?: number;
  copyOffY?: number;
  rotate?: number;
  glassMix?: number;
  kaleido?: number;
  bottomSrc?: 0 | 1 | 2;
  smear?: number;
  warp?: number;
  hueDrift?: number;
  delayFrames?: number;
}): DeviceState {
  const s = base();
  const sat = opts.sat ?? 1.28;
  // Per-generation gain near 1: the nest stays lit for many generations.
  // Wide stacks (5+ glass copies) add up; take a little off the top for them.
  const stack = opts.folds >= 5 ? 0.97 : 1;
  const con = Math.min((opts.contrast ?? 1.36) * 0.82, 1.22) * (opts.folds >= 5 ? 1.04 : 1);
  const br = Math.min(opts.bright * 1.08, 1.06) * stack;
  const hue = opts.hue ?? -0.02;
  s.A = loop({
    zoom: opts.zoom,
    rotate: opts.rotate ?? 0.08,
    glassMix: opts.glassMix ?? 0.5,
    copyRotate: opts.copyRotate,
    copyScale: opts.copyScale ?? 1,
    copyOffX: opts.copyOffX ?? 0,
    copyOffY: opts.copyOffY ?? 0,
    folds: opts.folds,
  });
  s.A.bottomSrc = opts.bottomSrc ?? 0;
  s.A.top = knobs(hue, sat, br, con);
  s.A.bot = knobs(opts.hue2 ?? hue + 0.16, sat * 0.9, br * 0.94, con * 0.96);
  s.edge = opts.edge ?? 0.1;
  s.persist = opts.persist ?? 0.13;
  s.seedAmt = opts.seedAmt ?? 0.03;
  s.bloom = opts.bloom ?? 0.12;
  s.gamma = 0.96;
  s.vignette = 0.08;
  s.copyFalloff = opts.folds >= 5 ? 0.88 : opts.folds >= 3 ? 0.92 : 0.97;
  s.hueDrift = opts.hueDrift ?? 0.0008;
  s.noise = 0.004;
  if (opts.kaleido) s.kaleido = opts.kaleido;
  if (opts.smear) s.smear = opts.smear;
  if (opts.warp) s.warp = opts.warp;
  if (opts.delayFrames != null) {
    s.A.delayFrames = opts.delayFrames;
    s.A.delayMix = opts.delayFrames <= 0 ? 0 : 0.28 + (opts.delayFrames / 30) * 0.42;
  }
  return s;
}

/** Two loops write each other — a fractal inside a fractal, one picture. */
function doubleShow(opts: {
  zoomA: number;
  zoomB: number;
  folds: number;
  bright: number;
  glassMix?: number;
  otherAmt?: number;
}): DeviceState {
  const mix = opts.glassMix ?? 0.45;
  const s = foldShow({
    zoom: opts.zoomA,
    folds: opts.folds,
    copyRotate: Math.PI / 2,
    bright: opts.bright,
    glassMix: mix,
    persist: 0.13,
    copyFalloff: 0.9,
    bloom: 0.1,
  });
  // A nests the seed at full brightness; B nests A. The picture is B: a fractal whose
  // second monitor holds a whole other fractal.
  s.insanity = true;
  s.view = 1;
  s.otherAmt = opts.otherAmt ?? 0.58;
  s.A.bottomSrc = 0;
  s.B = loop({
    zoom: opts.zoomB,
    rotate: -0.1,
    glassMix: 1,
    copyRotate: -Math.PI / 2,
    folds: opts.folds,
  });
  s.B.top = knobs(0.08, 1.15, opts.bright * 0.98, 1.16);
  s.B.bot = knobs(0.12, 1.05, opts.bright * 0.94, 1.12);
  s.B.bottomSrc = 2;
  s.seedAmt = 0.04;
  s.copyFalloff = 0.96;
  return s;
}

const RAW: Preset[] = [
  {
    id: "first-light",
    name: "First Light",
    hint: "Single-loop CRT middlespace, 1988 dorm room",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.91, rotate: 0.05, glassMix: 0.48, copyRotate: 0.35, folds: 1 });
      s.A.top = knobs(0, 1.08, 1.15, 1.24);
      s.A.bot = knobs(0.03, 1.18, 1.05, 1.18);
      s.view = 0;
      s.insanity = false;
      s.hueDrift = 0.004;
      s.noise = 0.008;
      s.barrel = 0.08;
      s.scan = 0.18;
      s.persist = 0.28;
      s.seedAmt = 0.04;
      s.bloom = 0.12;
      s.copyFalloff = 1;
      return s;
    },
  },
  {
    id: "polar-tunnel",
    name: "Polar Rings",
    hint: "One camera, a long tunnel of rings",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.86, rotate: 0.04, glassMix: 0.38, copyRotate: 0.52, copyScale: 1.08, folds: 1 });
      s.A.top = knobs(0.52, 1.48, 1.18, 1.32);
      s.A.bot = knobs(0.64, 1.3, 1.08, 1.24);
      s.hueDrift = 0.003;
      s.barrel = 0.1;
      s.scan = 0.08;
      s.persist = 0.22;
      s.seedAmt = 0.035;
      s.bloom = 0.1;
      s.vignette = 0.16;
      s.copyFalloff = 1;
      s.noise = 0.005;
      return s;
    },
  },
  {
    id: "king-glass",
    name: "King Glass",
    hint: "Peter King 1997 — two monitors through 50/50 glass, 90° fold",
    apply: () => {
      const s = base();
      // Two monitors side by side, camera on the pair: the nest appears inside the right one.
      s.A = loop({
        zoom: 0.5,
        rotate: 0.06,
        glassMix: 1,
        copyRotate: Math.PI / 2,
        copyScale: 1,
        folds: 2,
      });
      s.A.top = knobs(-0.02, 1.16, 1.02, 1.14);
      s.A.bot = knobs(0.05, 1.08, 0.98, 1.1);
      s.view = 0;
      s.edge = 0.1;
      s.persist = 0.14;
      s.seedAmt = 0.018;
      s.bloom = 0.06;
      s.gamma = 0.92;
      s.vignette = 0.1;
      s.copyFalloff = 0.97;
      s.noise = 0.004;
      return s;
    },
  },
  {
    id: "fold-90",
    name: "Deep Fold",
    hint: "90° glass at a smaller scale — more generations on screen",
    apply: () =>
      foldShow({
        zoom: 0.48,
        folds: 2,
        copyRotate: Math.PI / 2,
        bright: 0.9,
        sat: 1.34,
        hue: -0.06,
        hue2: 0.12,
        edge: 0.08,
        persist: 0.12,
        glassMix: 0.5,
      }),
  },
  {
    id: "gasket",
    name: "Gasket",
    hint: "Three contracted copies — nested triangles",
    apply: () =>
      foldShow({
        zoom: 0.46,
        folds: 3,
        copyRotate: (Math.PI * 2) / 3,
        bright: 1.0,
        sat: 1.32,
        hue: -0.08,
        hue2: 0.1,
        contrast: 1.42,
        copyFalloff: 0.9,
        persist: 0.1,
        bloom: 0.08,
        glassMix: 0.46,
        edge: 0.08,
      }),
  },
  {
    id: "mandala",
    name: "Mandala",
    hint: "Six-fold IFS — a hall of copies",
    apply: () =>
      foldShow({
        zoom: 0.52,
        folds: 6,
        copyRotate: Math.PI / 3,
        bright: 1.06,
        sat: 1.38,
        hue: 0.82,
        hue2: 0.08,
        copyFalloff: 0.9,
        persist: 0.12,
        bloom: 0.14,
        edge: 0.12,
        glassMix: 0.7,
        seedAmt: 0.08,
      }),
  },
  {
    id: "pip-deep",
    name: "Many Nests",
    hint: "Tiny 90° scale — picture in picture in picture in picture",
    apply: () =>
      foldShow({
        zoom: 0.44,
        folds: 2,
        copyRotate: Math.PI / 2,
        bright: 1.0,
        sat: 1.3,
        hue: 0.04,
        hue2: 0.22,
        edge: 0.06,
        persist: 0.12,
        glassMix: 0.5,
        copyFalloff: 0.96,
      }),
  },
  {
    id: "double-glass",
    name: "Double Glass",
    hint: "Loop A writes B writes A — a fractal inside a fractal",
    apply: () =>
      doubleShow({
        zoomA: 0.76,
        zoomB: 0.62,
        folds: 2,
        bright: 0.98,
        glassMix: 0.45,
        otherAmt: 0.9,
      }),
  },
  {
    id: "triple-fold",
    name: "Triple Fold",
    hint: "Three contracted copies at a small scale — generations of generations",
    apply: () =>
      foldShow({
        zoom: 0.4,
        folds: 3,
        copyRotate: 2.094395,
        bright: 0.82,
        sat: 1.14,
        contrast: 1.36,
        copyFalloff: 0.9,
        persist: 0.12,
        bloom: 0.1,
        glassMix: 0.48,
        edge: 0.18,
      }),
  },
  {
    id: "four-square",
    name: "Four Square",
    hint: "Four monitors at 90° — a square of squares",
    apply: () =>
      foldShow({
        zoom: 0.42,
        folds: 4,
        copyRotate: Math.PI / 2,
        bright: 0.98,
        sat: 1.28,
        hue: -0.02,
        hue2: 0.18,
        copyFalloff: 0.86,
        persist: 0.1,
        bloom: 0.1,
        glassMix: 0.46,
        edge: 0.08,
      }),
  },
  {
    id: "iso-cams",
    name: "Cube City",
    hint: "Four cameras at 90° on isometric cubes",
    apply: () =>
      foldShow({
        zoom: 0.54,
        folds: 4,
        copyRotate: Math.PI / 2,
        bright: 0.9,
        sat: 1.32,
        hue: 0.08,
        hue2: 0.28,
        copyFalloff: 0.9,
        persist: 0.11,
        bloom: 0.1,
        glassMix: 0.48,
        edge: 0.15,
      }),
  },
  {
    id: "fair-captive",
    name: "Fair Captive",
    hint: "Arm seed, then Trap — Magritte / Hofstadter recursion",
    apply: () => {
      const s = base();
      s.A = loop({
        zoom: 0.6,
        rotate: 0.04,
        glassMix: 0.78,
        copyRotate: 0.85,
        folds: 2,
        delayFrames: 3,
        delayMix: 0.16,
      });
      s.A.bottomSrc = 0;
      s.A.top = knobs(0.01, 1.08, 1.0, 1.14);
      s.A.bot = knobs(0.02, 1.02, 0.94, 1.1);
      s.persist = 0.14;
      s.seedAmt = 0.02;
      s.bloom = 0.06;
      s.gamma = 0.92;
      s.copyFalloff = 0.96;
      s.vignette = 0.1;
      return s;
    },
  },
  {
    id: "insanity",
    name: "Insanity Mode",
    hint: "A makes B makes A — fractals of fractals",
    apply: () => {
      const s = base();
      s.insanity = true;
      // B holds the seed; A nests B. Split view shows both: the nest, and the nest of the nest.
      s.A = loop({ zoom: 0.62, rotate: 0.2, glassMix: 1, copyRotate: 1.57, folds: 2 });
      s.B = loop({ zoom: 0.74, rotate: -0.16, glassMix: 1, copyRotate: -1.4, folds: 2 });
      s.A.bottomSrc = 2;
      s.B.bottomSrc = 0;
      s.A.top = knobs(-0.04, 1.2, 1.0, 1.14);
      s.A.bot = knobs(0.02, 1.1, 0.96, 1.1);
      s.B.top = knobs(0.08, 1.16, 0.98, 1.14);
      s.B.bot = knobs(0.06, 1.08, 0.94, 1.1);
      s.view = 0;
      s.otherAmt = 0.9;
      s.persist = 0.14;
      s.seedAmt = 0.04;
      s.bloom = 0.1;
      s.gamma = 0.92;
      s.copyFalloff = 0.97;
      return s;
    },
  },
  {
    id: "sierpinski",
    name: "Sierpiński Zone",
    hint: "Three contracted copies — nested triangles",
    apply: () => {
      const s = base();
      s.A = loop({
        zoom: 0.5,
        rotate: 0,
        glassMix: 1,
        copyRotate: 2.094395,
        copyScale: 1,
        folds: 3,
      });
      s.A.top = knobs(0.08, 1.2, 0.94, 1.22);
      s.A.bot = knobs(0.08, 1.1, 0.9, 1.18);
      s.gamma = 0.98;
      s.edge = 0.08;
      s.noise = 0.004;
      s.hueDrift = 0;
      s.bloom = 0.04;
      s.persist = 0.1;
      s.seedAmt = 0.03;
      s.vignette = 0.12;
      s.copyFalloff = 0.9;
      return s;
    },
  },
  {
    id: "jellyfish",
    name: "Jellyfish",
    hint: "Organic light creatures from the HD years",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.64, rotate: 0.22, spin: 0.03, glassMix: 1, copyRotate: 1.1, copyScale: 1.05, folds: 2 });
      s.A.top = knobs(0.55, 1.48, 1.1, 1.14);
      s.A.bot = knobs(0.62, 1.28, 1.04, 1.1);
      s.warp = 0.003;
      s.smear = 0.32;
      s.persist = 0.2;
      s.bloom = 0.2;
      s.gamma = 0.9;
      s.soft = 0.18;
      s.hueDrift = 0.002;
      s.seedAmt = 0.03;
      s.copyFalloff = 1;
      s.noise = 0.004;
      return s;
    },
  },
  {
    id: "drift-flow",
    name: "Drift Field",
    hint: "Two cameras close together — line weather, not a 90° nest",
    apply: () =>
      foldShow({
        zoom: 0.8,
        folds: 2,
        copyRotate: 0.36,
        copyScale: 0.92,
        bright: 1.04,
        sat: 1.5,
        hue: 0.12,
        hue2: 0.38,
        persist: 0.2,
        bloom: 0.14,
        glassMix: 0.4,
        edge: 0.22,
        smear: 0.4,
        seedAmt: 0.08,
        warp: 0.002,
        delayFrames: 10,
        rotate: 0.12,
      }),
  },
  {
    id: "fern",
    name: "Barnsley Fern",
    hint: "Unequal copies + offset — foliage from the glass, not a painted plant",
    apply: () =>
      foldShow({
        zoom: 0.78,
        folds: 2,
        copyRotate: 0.72,
        bright: 1.04,
        sat: 1.45,
        hue: 0.22,
        hue2: 0.4,
        copyScale: 0.42,
        copyOffX: 0.14,
        copyOffY: -0.12,
        rotate: 0.18,
        persist: 0.12,
        glassMix: 0.48,
        edge: 0.08,
        seedAmt: 0.09,
        bloom: 0.08,
        bottomSrc: 0,
      }),
  },
  {
    id: "light-hurt",
    name: "Light Hurt",
    hint: "Overdriven session — delay + hue cycle",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.74, rotate: 0.28, spin: 0.05, glassMix: 1, copyRotate: 1.2, folds: 2, delayFrames: 6, delayMix: 0.32 });
      s.B = loop({ zoom: 0.62, rotate: -0.22, spin: -0.04, glassMix: 1, copyRotate: -1.1, folds: 2, delayFrames: 5, delayMix: 0.24 });
      s.insanity = true;
      s.A.bottomSrc = 0;
      s.B.bottomSrc = 2;
      s.A.top = knobs(0, 1.22, 1.0, 1.14);
      s.A.bot = knobs(0.04, 1.1, 0.96, 1.1);
      s.B.top = knobs(0.1, 1.18, 0.98, 1.14);
      s.B.bot = knobs(0.08, 1.08, 0.94, 1.1);
      s.hueDrift = 0.004;
      s.aberration = 0.002;
      s.chromaSep = 0.04;
      s.bloom = 0.12;
      s.view = 3;
      s.fps = 24;
      s.persist = 0.12;
      s.seedAmt = 0.04;
      s.otherAmt = 0.9;
      s.gamma = 0.92;
      s.copyFalloff = 0.97;
      s.noise = 0.005;
      return s;
    },
  },
  {
    id: "stutter-24",
    name: "24fps Stutter",
    hint: "Router frame-rate trick — cinema smear",
    apply: () => {
      const s = base();
      s.fps = 24;
      s.A.delayFrames = 2;
      s.A.delayMix = 0.3;
      s.smear = 0.55;
      s.persist = 0.14;
      s.scan = 0.05;
      return s;
    },
  },
  {
    id: "spiral",
    name: "Spiral Nest",
    hint: "Turn and shrink — a nautilus of nested monitors",
    apply: () =>
      foldShow({
        zoom: 0.88,
        folds: 2,
        copyRotate: 0.32,
        copyScale: 0.94,
        bright: 0.98,
        sat: 1.38,
        hue: 0.06,
        hue2: 0.24,
        persist: 0.11,
        glassMix: 0.48,
        edge: 0.1,
        rotate: 0.03,
        seedAmt: 0.035,
        bloom: 0.08,
        bottomSrc: 1,
      }),
  },
  {
    id: "snowflake",
    name: "Snowflake",
    hint: "Six copies at 60°, half size — a flake from the fold",
    apply: () =>
      foldShow({
        zoom: 0.4,
        folds: 6,
        copyRotate: Math.PI / 3,
        copyScale: 1,
        bright: 1.02,
        sat: 1.32,
        hue: 0.48,
        hue2: 0.62,
        copyFalloff: 0.84,
        persist: 0.08,
        bloom: 0.12,
        glassMix: 0.44,
        edge: 0.08,
        rotate: 0.02,
        seedAmt: 0.09,
        bottomSrc: 0,
      }),
  },
  {
    id: "dragon",
    name: "Dragon Fold",
    hint: "Two copies at 45°, scale 1/√2 — the paper fold",
    apply: () =>
      foldShow({
        zoom: 0.707,
        folds: 2,
        copyRotate: Math.PI / 4,
        copyScale: 1,
        copyOffX: 0.16,
        copyOffY: 0.06,
        bright: 1.0,
        sat: 1.32,
        hue: -0.06,
        hue2: 0.1,
        persist: 0.1,
        glassMix: 0.48,
        edge: 0.12,
        rotate: 0.04,
        seedAmt: 0.035,
        bloom: 0.06,
        bottomSrc: 0,
      }),
  },
  {
    id: "kaleid",
    name: "Kaleid Herd",
    hint: "Six-fold IFS + glass mixer",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.48, rotate: 0.08, spin: 0.02, glassMix: 1, copyRotate: Math.PI / 3, folds: 6 });
      s.A.top = knobs(0.06, 1.18, 1.0, 1.16);
      s.A.bot = knobs(0.08, 1.08, 0.96, 1.12);
      s.bloom = 0.08;
      s.persist = 0.08;
      s.seedAmt = 0.03;
      s.gamma = 0.94;
      s.vignette = 0.12;
      s.edge = 0.08;
      s.copyFalloff = 0.92;
      s.noise = 0.003;
      return s;
    },
  },
  {
    id: "front-cam",
    name: "Front Camera",
    hint: "Rotating monitor loop — objects, poems, guitar",
    apply: () => {
      const s = base();
      s.view = 2;
      s.C = loop({ zoom: 0.7, rotate: 0.15, spin: 0.35, glassMix: 0.4, copyRotate: 0.4, folds: 1 });
      s.C.top = knobs(0.02, 1.12, 0.97, 1.2);
      s.C.bottomSrc = 0;
      return s;
    },
  },
  {
    id: "middlespace",
    name: "Middlespace",
    hint: "Tiny zone between on and off",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.78, rotate: 0.03, glassMix: 0.35, copyRotate: 0.4, folds: 2 });
      s.A.top = knobs(0, 0.75, 0.99, 1.08);
      s.noise = 0.008;
      s.persist = 0.04;
      s.edge = 0.03;
      s.bloom = 0;
      return s;
    },
  },
];

/** Every recipe lands with its nest centred unless it asked for a pan of its own. */
export const PRESETS: Preset[] = RAW.map((p) => ({
  ...p,
  apply: () => {
    const s = p.apply();
    for (const L of [s.A, s.B, s.C]) {
      if (L.panX === 0 && L.panY === 0) centerNest(L);
    }
    return s;
  },
}));
