export type SeedKind =
  | "plasma"
  | "burst"
  | "sun"
  | "glyphs"
  | "noise"
  | "grid"
  | "portrait"
  | "arcs"
  | "bloom"
  | "chevrons"
  | "drift"
  | "iso"
  | "rings";

export const SEED_LABELS: { label: string; value: SeedKind }[] = [
  { label: "Tiles / monitors", value: "grid" },
  { label: "Arc tiles", value: "arcs" },
  { label: "Packed bloom", value: "bloom" },
  { label: "Chevrons", value: "chevrons" },
  { label: "Drift field", value: "drift" },
  { label: "Iso stack", value: "iso" },
  { label: "Polar rings", value: "rings" },
  { label: "Color burst", value: "burst" },
  { label: "Plasma", value: "plasma" },
  { label: "Sun", value: "sun" },
  { label: "Glyphs / poem", value: "glyphs" },
  { label: "Noise", value: "noise" },
  { label: "Fair captive", value: "portrait" },
];

export function makeSeedCanvas(size = 1024): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  return c;
}

function hash(i: number): number {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function applyAperture(ctx: CanvasRenderingContext2D, kind: SeedKind): void {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const cx = w * 0.5;
  const cy = h * 0.5;
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.filter = `blur(${Math.max(10, w * 0.022)}px)`;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  if (kind === "sun" || kind === "bloom" || kind === "rings" || kind === "burst") {
    ctx.arc(cx, cy, Math.min(w, h) * 0.4, 0, Math.PI * 2);
  } else if (kind === "glyphs" || kind === "portrait") {
    ctx.ellipse(cx, cy, w * 0.36, h * 0.42, 0.08, 0, Math.PI * 2);
  } else if (kind === "chevrons") {
    const r = Math.min(w, h) * 0.42;
    for (let i = 0; i <= 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else if (kind === "plasma" || kind === "noise" || kind === "drift") {
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const r = Math.min(w, h) * (0.38 + 0.06 * Math.sin(3 * a) + 0.03 * Math.sin(5 * a + 1.2));
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else {
    ctx.ellipse(cx, cy, w * 0.4, h * 0.4, 0, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export function paintSeed(ctx: CanvasRenderingContext2D, kind: SeedKind, t = 0): void {
  paintSeedBody(ctx, kind, t);
  applyAperture(ctx, kind);
}

function paintSeedBody(ctx: CanvasRenderingContext2D, kind: SeedKind, t: number): void {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  if (kind === "plasma") {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const u = x / w;
        const v = y / h;
        const n =
          0.5 +
          0.5 *
            Math.sin(u * 12 + t) *
            Math.sin(v * 9 - t * 0.7) *
            Math.sin((u + v) * 7 + t * 0.3);
        const r = (0.5 + 0.5 * Math.sin(n * 6.2 + 0.2)) * 255;
        const g = (0.5 + 0.5 * Math.sin(n * 5.1 + 2.1)) * 255;
        const b = (0.5 + 0.5 * Math.sin(n * 7.4 + 4.2)) * 255;
        const i = (y * w + x) * 4;
        img.data[i] = r;
        img.data[i + 1] = g;
        img.data[i + 2] = b;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    ctx.filter = "blur(8px)";
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.filter = "none";
    return;
  }

  if (kind === "burst") {
    for (let i = 0; i < 40; i++) {
      const x = hash(i + 1) * w;
      const y = hash(i + 9) * h;
      const r = 40 + hash(i + 17) * 180;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `hsla(${(hash(i) * 360 + t * 40) % 360}, 90%, 62%, 0.85)`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    return;
  }

  if (kind === "sun") {
    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.42);
    g.addColorStop(0, "#fff6d0");
    g.addColorStop(0.25, "#ffb347");
    g.addColorStop(0.55, "#ff3355");
    g.addColorStop(1, "#000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,220,120,0.35)";
    ctx.lineWidth = 6;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + t * 0.2;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.5);
      ctx.lineTo(w * 0.5 + Math.cos(a) * w * 0.48, h * 0.5 + Math.sin(a) * h * 0.48);
      ctx.stroke();
    }
    return;
  }

  if (kind === "glyphs") {
    ctx.fillStyle = "#0a0610";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#fff8e8";
    ctx.font = `700 ${Math.floor(w / 6.2)}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = ["THE FAIR", "CAPTIVE", "RECURSION", "IS THE KEY"];
    lines.forEach((line, i) => ctx.fillText(line, w / 2, h * (0.22 + i * 0.18)));
    ctx.strokeStyle = "#ff4a28";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.5, w * 0.38, h * 0.42, 0.1, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }

  if (kind === "noise") {
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v;
      img.data[i + 1] = v * 0.85;
      img.data[i + 2] = v * 0.7;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return;
  }

  if (kind === "grid") {
    const cols = ["#e23d2b", "#f4c430", "#2ec4b6", "#7b5cff", "#ff7a18", "#f5f0e6"];
    const n = 4;
    const step = w / n;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        ctx.fillStyle = cols[(x + y * 2) % cols.length];
        ctx.fillRect(x * step, y * step, step + 1, step + 1);
      }
    }
    ctx.strokeStyle = "#0a0604";
    ctx.lineWidth = 18;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.strokeRect(w * 0.18, h * 0.18, w * 0.64, h * 0.64);
    return;
  }

  // Public geometry, drawn here — not copies of anyone's SVG catalog.
  if (kind === "arcs") {
    const n = 10;
    const s = w / n;
    ctx.fillStyle = "#12080c";
    ctx.fillRect(0, 0, w, h);
    const pal = ["#e23d2b", "#f4c430", "#2ec4b6", "#7b5cff", "#f5f0e6"];
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const cx = (x + 0.5) * s;
        const cy = (y + 0.5) * s;
        const flip = hash(x * 19 + y * 41) > 0.5;
        ctx.strokeStyle = pal[(x + y) % pal.length];
        ctx.lineWidth = Math.max(4, s * 0.24);
        ctx.beginPath();
        if (flip) {
          ctx.arc(x * s, y * s, s * 0.5, 0, Math.PI / 2);
        } else {
          ctx.arc((x + 1) * s, y * s, s * 0.5, Math.PI / 2, Math.PI);
        }
        ctx.stroke();
        ctx.beginPath();
        if (flip) {
          ctx.arc((x + 1) * s, (y + 1) * s, s * 0.5, Math.PI, Math.PI * 1.5);
        } else {
          ctx.arc(x * s, (y + 1) * s, s * 0.5, Math.PI * 1.5, Math.PI * 2);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, s * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = pal[(x + y + 2) % pal.length];
        ctx.fill();
      }
    }
    return;
  }

  if (kind === "bloom") {
    ctx.fillStyle = "#08060c";
    ctx.fillRect(0, 0, w, h);
    const c = w * 0.018;
    const gold = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < 420; i++) {
      const a = i * gold;
      const r = c * Math.sqrt(i);
      const x = w * 0.5 + Math.cos(a) * r;
      const y = h * 0.5 + Math.sin(a) * r;
      const rad = 4 + (i % 7);
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(i * 4 + 20) % 360}, 78%, ${48 + (i % 20)}%, 0.92)`;
      ctx.fill();
    }
    return;
  }

  if (kind === "chevrons") {
    ctx.fillStyle = "#100806";
    ctx.fillRect(0, 0, w, h);
    const pal = ["#e23d2b", "#c9a227", "#2ec4b6", "#1a120c", "#f5f0e6"];
    const band = h / 12;
    for (let row = -2; row < 16; row++) {
      ctx.fillStyle = pal[((row % pal.length) + pal.length) % pal.length];
      ctx.beginPath();
      const y0 = row * band;
      ctx.moveTo(0, y0);
      ctx.lineTo(w * 0.5, y0 + band * 1.4);
      ctx.lineTo(w, y0);
      ctx.lineTo(w, y0 + band);
      ctx.lineTo(w * 0.5, y0 + band * 2.4);
      ctx.lineTo(0, y0 + band);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }

  if (kind === "drift") {
    ctx.fillStyle = "#07060a";
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = Math.max(3, w / 160);
    ctx.lineCap = "round";
    for (let i = 0; i < 70; i++) {
      let x = hash(i + 3) * w;
      let y = hash(i + 11) * h;
      ctx.strokeStyle = `hsla(${(hash(i) * 280 + 10) % 360}, 85%, 58%, 0.88)`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let k = 0; k < 28; k++) {
        const a = (hash(i * 17 + k) - 0.5) * 1.4 + Math.sin(y * 0.01 + i) * 0.6;
        x += Math.cos(a) * (w * 0.028);
        y += Math.sin(a) * (h * 0.028);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    return;
  }

  if (kind === "iso") {
    ctx.fillStyle = "#0c0a08";
    ctx.fillRect(0, 0, w, h);
    const size = w / 9;
    const faces = ["#ff4530", "#8f6cff", "#2ee0c8"];
    const iso = (col: number, row: number, shade: number) => {
      const x = w * 0.5 + (col - row) * size * 0.86;
      const y = h * 0.12 + (col + row) * size * 0.5;
      ctx.fillStyle = faces[shade];
      ctx.beginPath();
      if (shade === 0) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size * 0.86, y + size * 0.5);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size * 0.86, y + size * 0.5);
      } else if (shade === 1) {
        ctx.moveTo(x, y + size);
        ctx.lineTo(x + size * 0.86, y + size * 0.5);
        ctx.lineTo(x + size * 0.86, y + size * 1.5);
        ctx.lineTo(x, y + size * 2);
      } else {
        ctx.moveTo(x, y + size);
        ctx.lineTo(x - size * 0.86, y + size * 0.5);
        ctx.lineTo(x - size * 0.86, y + size * 1.5);
        ctx.lineTo(x, y + size * 2);
      }
      ctx.closePath();
      ctx.fill();
    };
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (hash(col * 8 + row) < 0.22) continue;
        iso(col, row, 0);
        iso(col, row, 1);
        iso(col, row, 2);
      }
    }
    return;
  }

  if (kind === "rings") {
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(0, 0, w, h);
    const cx = w * 0.5;
    const cy = h * 0.5;
    for (let i = 1; i < 18; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, i * (w * 0.028), 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${200 + i * 8}, 80%, ${40 + (i % 5) * 8}%, 0.9)`;
      ctx.lineWidth = i % 3 === 0 ? 16 : 6;
      ctx.stroke();
    }
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.strokeStyle = "#f4c430";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * w * 0.08, cy + Math.sin(a) * h * 0.08);
      ctx.lineTo(cx + Math.cos(a) * w * 0.46, cy + Math.sin(a) * h * 0.46);
      ctx.stroke();
    }
    return;
  }

  // portrait — a crude Magritte-ish sun/tuba stand-in
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#6aa8e8");
  sky.addColorStop(1, "#f3d5a0");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#c45c2a";
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, w * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a120c";
  ctx.fillRect(w * 0.42, h * 0.55, w * 0.16, h * 0.28);
  ctx.beginPath();
  ctx.ellipse(w * 0.62, h * 0.62, w * 0.16, h * 0.08, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `italic 700 ${Math.floor(w / 18)}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.fillText("trap me", w / 2, h * 0.92);
}
