import type { DeviceState } from "./state";
import type { HomePose } from "./evolve";

/** Named monitor grades — tap mid-session the way Photism taps palettes. */
export type Look = {
  id: string;
  name: string;
  swatch: string;
  hue: number;
  hue2: number;
  sat: number;
  sat2: number;
  bright: number;
  contrast: number;
};

export const LOOKS: Look[] = [
  { id: "tungsten", name: "Tungsten", swatch: "#d4a06a", hue: 0.06, hue2: 0.1, sat: 1.28, sat2: 1.12, bright: 0.92, contrast: 1.28 },
  { id: "cyanotype", name: "Cyanotype", swatch: "#6aa8d4", hue: -0.42, hue2: -0.36, sat: 1.45, sat2: 1.22, bright: 0.86, contrast: 1.36 },
  { id: "sodium", name: "Sodium", swatch: "#e0a020", hue: 0.08, hue2: 0.04, sat: 1.72, sat2: 1.4, bright: 0.9, contrast: 1.48 },
  { id: "night", name: "Night", swatch: "#3a4a8a", hue: -0.32, hue2: -0.22, sat: 0.82, sat2: 0.7, bright: 0.74, contrast: 1.42 },
  { id: "acid", name: "Acid", swatch: "#b8e04a", hue: -0.18, hue2: 0.28, sat: 1.95, sat2: 1.7, bright: 0.94, contrast: 1.38 },
  { id: "blood", name: "Blood", swatch: "#c42a28", hue: -0.02, hue2: 0.04, sat: 1.68, sat2: 1.35, bright: 0.84, contrast: 1.55 },
  { id: "ice", name: "Ice", swatch: "#c8e8f4", hue: -0.46, hue2: -0.4, sat: 0.95, sat2: 0.82, bright: 1.02, contrast: 1.22 },
  { id: "honey", name: "Honey", swatch: "#e8c060", hue: 0.04, hue2: 0.08, sat: 1.52, sat2: 1.28, bright: 0.96, contrast: 1.3 },
  { id: "silver", name: "Silver", swatch: "#c0c4c8", hue: 0, hue2: 0.02, sat: 0.28, sat2: 0.22, bright: 0.9, contrast: 1.62 },
  { id: "magenta", name: "Magenta", swatch: "#e060c0", hue: -0.16, hue2: 0.38, sat: 1.58, sat2: 1.45, bright: 0.88, contrast: 1.34 },
];

export function applyLook(S: DeviceState, look: Look, home: HomePose | null): void {
  const paint = (m: { hue: number; sat: number; bright: number; contrast: number }, hue: number, sat: number) => {
    m.hue = hue;
    m.sat = sat;
    m.bright = look.bright;
    m.contrast = look.contrast;
  };
  paint(S.A.top, look.hue, look.sat);
  paint(S.A.bot, look.hue2, look.sat2);
  paint(S.B.top, look.hue + 0.03, look.sat * 0.96);
  paint(S.B.bot, look.hue2 - 0.02, look.sat2 * 0.94);
  paint(S.C.top, look.hue, look.sat * 0.9);
  if (!home) return;
  home.hue = look.hue;
  home.hue2 = look.hue2;
  home.sat = look.sat;
  home.sat2 = look.sat2;
  home.bright = look.bright;
  home.contrast = look.contrast;
}
