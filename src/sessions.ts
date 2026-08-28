import type { SeedKind } from "./engine/seeds";

export type { SeedKind };

export type Session = {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  preset: string;
  seed: SeedKind;
  spin?: number;
};

export const SESSIONS: Session[] = [
  {
    id: "king-glass",
    name: "King Glass",
    tag: "The fractal trick",
    blurb: "Two monitors through 50/50 glass at 90°. This is Peter King’s 1997 move — the one that made Blair’s machine make fractals, not just tunnels.",
    preset: "king-glass",
    seed: "grid",
    spin: 0.06,
  },
  {
    id: "first-light",
    name: "First Light",
    tag: "UCSC 1988",
    blurb: "One camera, one screen, the middlespace. Hue drift like old NTSC. This is the dorm-room loop before the glass.",
    preset: "first-light",
    seed: "sun",
    spin: 0.04,
  },
  {
    id: "fair-captive",
    name: "Fair Captive",
    tag: "Trap a picture",
    blurb: "Arm a seed, then Trap. The image leaves the source and lives only in the loop — Magritte’s canvas in a canvas, the way Hofstadter explained recursion.",
    preset: "fair-captive",
    seed: "portrait",
    spin: 0.03,
  },
  {
    id: "sierpinski",
    name: "Sierpiński",
    tag: "Nested triangles",
    blurb: "Three contracted copies. Hofstadter saw gaskets in Blair’s HD work. Smaller Scale / rod = more generations on screen.",
    preset: "sierpinski",
    seed: "grid",
    spin: 0.04,
  },
  {
    id: "jellyfish",
    name: "Jellyfish",
    tag: "Light creatures",
    blurb: "The HD years: organic, phosphor-smeared animals that should not exist. Herd Bright and Contrast to keep them alive.",
    preset: "jellyfish",
    seed: "burst",
    spin: 0.1,
  },
  {
    id: "fern",
    name: "Fern",
    tag: "IFS foliage",
    blurb: "Unequal copies and a shove. Barnsley-adjacent — the glass fold as a plant.",
    preset: "fern",
    seed: "grid",
    spin: 0.05,
  },
  {
    id: "insanity",
    name: "Insanity",
    tag: "They make each other",
    blurb: "Loop A writes Loop B writes Loop A. Blair’s phrase. Hard to hold. Glorious when it holds.",
    preset: "insanity",
    seed: "plasma",
    spin: 0.08,
  },
  {
    id: "light-hurt",
    name: "Light Hurt",
    tag: "Overdriven",
    blurb: "Delay, hue walk, 24fps stutter. The long session at the end of the 4K video. Turn Contrast until it bites.",
    preset: "light-hurt",
    seed: "burst",
    spin: 0.16,
  },
  {
    id: "kaleid",
    name: "Kaleid",
    tag: "Six-fold",
    blurb: "Rotational copies stacked on the glass mixer. Mandala that still breathes.",
    preset: "kaleid",
    seed: "sun",
    spin: 0.07,
  },
];

export const B3 = {
  home: "https://buildbeyondbelief.com/",
  book: "https://buildbeyondbelief.com/book",
  fit: "https://buildbeyondbelief.com/fit-call",
  blair: "https://www.thelightherder.com/",
  king: "https://sweetandfizzy.com/fractals/",
  portfolio: "https://davidblairportfolio.com/video-feedback-kinetic-sculpture/",
};
