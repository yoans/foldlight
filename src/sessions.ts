import type { SeedKind } from "./engine/seeds";

export type { SeedKind };

export type Family = "glass" | "tiles" | "flow" | "radial" | "iso";

export type Session = {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  preset: string;
  seed: SeedKind;
  family: Family;
  spin?: number;
};

export const FAMILIES: { id: "all" | Family; label: string }[] = [
  { id: "all", label: "All" },
  { id: "glass", label: "Glass" },
  { id: "tiles", label: "Tiles" },
  { id: "flow", label: "Flow" },
  { id: "radial", label: "Radial" },
  { id: "iso", label: "Iso" },
];

export const SESSIONS: Session[] = [
  {
    id: "king-glass",
    name: "King Glass",
    tag: "The fractal trick",
    blurb: "Two monitors through 50/50 glass at 90°. Peter King’s 1997 move — fractals, nested copies.",
    preset: "king-glass",
    seed: "grid",
    family: "glass",
    spin: 0.06,
  },
  {
    id: "first-light",
    name: "First Light",
    tag: "UCSC 1988",
    blurb: "One camera, one screen, the middlespace. Hue drift like old NTSC.",
    preset: "first-light",
    seed: "sun",
    family: "glass",
    spin: 0.04,
  },
  {
    id: "fair-captive",
    name: "Fair Captive",
    tag: "Trap a picture",
    blurb: "Arm a seed, then Trap. The image leaves the source and lives only in the loop.",
    preset: "fair-captive",
    seed: "portrait",
    family: "glass",
    spin: 0.03,
  },
  {
    id: "sierpinski",
    name: "Sierpiński",
    tag: "Nested triangles",
    blurb: "Three contracted copies. Smaller Scale / rod = more generations on screen.",
    preset: "sierpinski",
    seed: "grid",
    family: "glass",
    spin: 0.04,
  },
  {
    id: "jellyfish",
    name: "Jellyfish",
    tag: "Light creatures",
    blurb: "Organic, phosphor-smeared animals. Herd Bright and Contrast to keep them alive.",
    preset: "jellyfish",
    seed: "burst",
    family: "glass",
    spin: 0.1,
  },
  {
    id: "fern",
    name: "Fern",
    tag: "IFS foliage",
    blurb: "Unequal copies and a shove. The glass fold as a plant.",
    preset: "fern",
    seed: "grid",
    family: "glass",
    spin: 0.05,
  },
  {
    id: "insanity",
    name: "Insanity",
    tag: "They make each other",
    blurb: "Loop A writes Loop B writes Loop A. Hard to hold. Glorious when it holds.",
    preset: "insanity",
    seed: "plasma",
    family: "glass",
    spin: 0.08,
  },
  {
    id: "light-hurt",
    name: "Light Hurt",
    tag: "Overdriven",
    blurb: "Delay, hue walk, 24fps stutter. Turn Contrast until it bites.",
    preset: "light-hurt",
    seed: "burst",
    family: "glass",
    spin: 0.16,
  },
  {
    id: "kaleid",
    name: "Kaleid",
    tag: "Six-fold",
    blurb: "Rotational copies stacked on the glass mixer. Mandala that still breathes.",
    preset: "kaleid",
    seed: "sun",
    family: "glass",
    spin: 0.07,
  },
  {
    id: "arc-floor",
    name: "Arc Floor",
    tag: "Truchet tiles",
    blurb: "Quarter-arcs on a grid — a 1704 tiling, then folded through glass.",
    preset: "king-glass",
    seed: "arcs",
    family: "tiles",
    spin: 0.05,
  },
  {
    id: "fold-chevrons",
    name: "Fold Chevrons",
    tag: "Stacked Vs",
    blurb: "Hard chevrons into nested triangles. Scale down to multiply the folds.",
    preset: "sierpinski",
    seed: "chevrons",
    family: "tiles",
    spin: 0.04,
  },
  {
    id: "drift-field",
    name: "Drift Field",
    tag: "Line weather",
    blurb: "Hash-steered ribbons. Delay and smear turn them into creatures.",
    preset: "jellyfish",
    seed: "drift",
    family: "flow",
    spin: 0.09,
  },
  {
    id: "packed-bloom",
    name: "Packed Bloom",
    tag: "Phyllotaxis",
    blurb: "Vogel spiral packing. Six-fold glass turns a flower into a hall of flowers.",
    preset: "kaleid",
    seed: "bloom",
    family: "radial",
    spin: 0.06,
  },
  {
    id: "polar-rings",
    name: "Polar Rings",
    tag: "Spokes + rings",
    blurb: "Concentric bands and radial spokes. First Light lets the middlespace chew them.",
    preset: "first-light",
    seed: "rings",
    family: "radial",
    spin: 0.07,
  },
  {
    id: "iso-stack",
    name: "Iso Stack",
    tag: "Cube city",
    blurb: "Isometric cubes as seed tiles. Glass at 90° stacks cities inside cities.",
    preset: "king-glass",
    seed: "iso",
    family: "iso",
    spin: 0.05,
  },
];

export const B3 = {
  home: "https://buildbeyondbelief.com/",
  book: "https://buildbeyondbelief.com/book",
  fit: "https://buildbeyondbelief.com/fit-call",
  blair: "https://www.thelightherder.com/",
  king: "https://sweetandfizzy.com/fractals/",
  portfolio: "https://davidblairportfolio.com/video-feedback-kinetic-sculpture/",
  shapes: "https://bookofshapes.com/",
};
