export type SeedKind = "plasma" | "burst" | "sun" | "glyphs" | "noise" | "grid" | "portrait";

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

export function paintSeed(ctx: CanvasRenderingContext2D, kind: SeedKind, t = 0): void {
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
    ctx.fillStyle = "#f4e8c1";
    ctx.font = `700 ${Math.floor(w / 7)}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = ["THE FAIR", "CAPTIVE", "RECURSION", "IS THE KEY"];
    lines.forEach((line, i) => ctx.fillText(line, w / 2, h * (0.22 + i * 0.18)));
    ctx.strokeStyle = "rgba(255,80,40,0.7)";
    ctx.lineWidth = 14;
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
