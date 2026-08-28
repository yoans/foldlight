import { defaultState, knobs, loop, type DeviceState } from "./state";

export type Preset = {
  id: string;
  name: string;
  hint: string;
  apply: () => DeviceState;
};

const base = () => defaultState();

export const PRESETS: Preset[] = [
  {
    id: "first-light",
    name: "First Light",
    hint: "Single-loop CRT middlespace, 1988 dorm room",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.86, rotate: 0.06, glassMix: 0, copyRotate: 0, folds: 1 });
      s.A.top = knobs(0, 0.9, 0.98, 1.15);
      s.A.bot = knobs(0.02, 1.1, 0.94, 1.12);
      s.view = 0;
      s.insanity = false;
      s.hueDrift = 0.01;
      s.noise = 0.025;
      s.barrel = 0.08;
      s.scan = 0.32;
      s.persist = 0.26;
      s.seedAmt = 0.05;
      s.bloom = 0.08;
      s.copyFalloff = 1;
      return s;
    },
  },
  {
    id: "king-glass",
    name: "King Glass",
    hint: "Peter King 1997 — two monitors through 50/50 glass, 90° fold",
    apply: () => {
      const s = base();
      s.A = loop({
        zoom: 0.68,
        rotate: 0.1,
        glassMix: 1,
        copyRotate: Math.PI / 2,
        copyScale: 1,
        folds: 2,
      });
      s.A.top = knobs(-0.02, 1.02, 0.58, 1.36);
      s.A.bot = knobs(0.05, 0.96, 0.54, 1.3);
      s.view = 0;
      s.edge = 0.12;
      s.persist = 0.08;
      s.seedAmt = 0.018;
      s.bloom = 0.03;
      s.gamma = 1.04;
      s.vignette = 0.18;
      s.copyFalloff = 0.72;
      s.decay = 0.98;
      return s;
    },
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
        glassMix: 0.55,
        copyRotate: 0.85,
        folds: 2,
        delayFrames: 3,
        delayMix: 0.12,
      });
      s.A.bottomSrc = 0;
      s.A.top = knobs(0.01, 0.95, 0.55, 1.22);
      s.A.bot = knobs(0.02, 0.9, 0.42, 1.18);
      s.persist = 0.08;
      s.seedAmt = 0.012;
      s.bloom = 0;
      s.gamma = 1.08;
      s.decay = 0.97;
      s.copyFalloff = 0.7;
      s.vignette = 0.16;
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
      s.A = loop({ zoom: 0.55, rotate: 0.2, glassMix: 1, copyRotate: 1.57, folds: 2 });
      s.B = loop({ zoom: 0.52, rotate: -0.16, glassMix: 1, copyRotate: -1.4, folds: 2 });
      s.A.bottomSrc = 2;
      s.B.bottomSrc = 2;
      s.A.top = knobs(-0.04, 1.08, 0.52, 1.3);
      s.A.bot = knobs(0.02, 0.98, 0.48, 1.24);
      s.B.top = knobs(0.08, 1.02, 0.5, 1.28);
      s.B.bot = knobs(0.06, 0.95, 0.46, 1.22);
      s.view = 4;
      s.otherAmt = 0.7;
      s.persist = 0.09;
      s.seedAmt = 0.02;
      s.bloom = 0.05;
      s.gamma = 1.05;
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
      s.A.top = knobs(0.08, 0.78, 0.48, 1.28);
      s.A.bot = knobs(0.08, 0.72, 0.44, 1.24);
      s.gamma = 1.1;
      s.edge = 0.12;
      s.noise = 0.006;
      s.hueDrift = 0;
      s.bloom = 0;
      s.persist = 0.04;
      s.seedAmt = 0.01;
      s.vignette = 0.22;
      s.decay = 0.965;
      s.copyFalloff = 0.62;
      return s;
    },
  },
  {
    id: "jellyfish",
    name: "Jellyfish",
    hint: "Organic light creatures from the HD years",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.64, rotate: 0.35, spin: 0.1, glassMix: 1, copyRotate: 1.1, copyScale: 1.05, folds: 2 });
      s.A.top = knobs(0.55, 1.55, 0.94, 1.28);
      s.A.bot = knobs(0.62, 1.35, 0.94, 1.2);
      s.warp = 0.008;
      s.smear = 0.8;
      s.persist = 0.28;
      s.bloom = 0.35;
      s.soft = 0.35;
      s.hueDrift = 0.005;
      s.seedAmt = 0.05;
      s.copyFalloff = 1;
      return s;
    },
  },
  {
    id: "fern",
    name: "Barnsley Fern",
    hint: "Unequal copies + offset — foliage IFS",
    apply: () => {
      const s = base();
      s.A = loop({
        zoom: 0.54,
        rotate: 0.4,
        glassMix: 1,
        copyRotate: 2.45,
        copyScale: 0.72,
        copyOffX: 0.08,
        copyOffY: -0.04,
        folds: 2,
      });
      s.A.top = knobs(0.18, 1.05, 0.5, 1.28);
      s.A.bot = knobs(0.14, 0.95, 0.44, 1.22);
      s.edge = 0.12;
      s.persist = 0.05;
      s.seedAmt = 0.012;
      s.bloom = 0;
      s.gamma = 1.08;
      s.decay = 0.97;
      s.copyFalloff = 0.68;
      return s;
    },
  },
  {
    id: "light-hurt",
    name: "Light Hurt",
    hint: "Overdriven session — delay + hue cycle",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.57, rotate: 0.5, spin: 0.18, glassMix: 1, copyRotate: 1.2, folds: 2, delayFrames: 6, delayMix: 0.4 });
      s.B = loop({ zoom: 0.53, rotate: -0.4, spin: -0.12, glassMix: 1, copyRotate: -1.1, folds: 2, delayFrames: 5, delayMix: 0.32 });
      s.insanity = true;
      s.A.bottomSrc = 2;
      s.B.bottomSrc = 2;
      s.A.top = knobs(0, 1.2, 0.56, 1.34);
      s.A.bot = knobs(0.04, 1.08, 0.5, 1.28);
      s.hueDrift = 0.01;
      s.aberration = 0.006;
      s.chromaSep = 0.12;
      s.bloom = 0.14;
      s.view = 3;
      s.fps = 24;
      s.persist = 0.1;
      s.seedAmt = 0.02;
      s.gamma = 1.04;
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
      s.smear = 1.4;
      s.persist = 0.18;
      s.scan = 0.08;
      return s;
    },
  },
  {
    id: "kaleid",
    name: "Kaleid Herd",
    hint: "Six-fold IFS + glass mixer",
    apply: () => {
      const s = base();
      s.A = loop({ zoom: 0.48, rotate: 0.08, spin: 0.05, glassMix: 1, copyRotate: Math.PI / 3, folds: 6 });
      s.A.top = knobs(0.06, 1.0, 0.42, 1.28);
      s.A.bot = knobs(0.08, 0.9, 0.36, 1.22);
      s.bloom = 0;
      s.persist = 0.03;
      s.seedAmt = 0.01;
      s.gamma = 1.12;
      s.vignette = 0.24;
      s.edge = 0.08;
      s.decay = 0.96;
      s.copyFalloff = 0.58;
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
      s.noise = 0.03;
      s.persist = 0.04;
      s.edge = 0.03;
      s.bloom = 0;
      return s;
    },
  },
];
