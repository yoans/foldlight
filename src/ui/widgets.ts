export type KnobOpts = {
  min: number;
  max: number;
  value: number;
  step?: number;
  unit?: string;
  bipolar?: boolean;
  format?: (v: number) => string;
  /** Plain-language tooltip. */
  help?: string;
  /** Double-click returns here. Defaults to the starting value. */
  home?: number;
  onChange: (v: number) => void;
};

export class Knob {
  el: HTMLElement;
  private opts: KnobOpts;
  private value: number;
  private dragging = false;
  private lastY = 0;
  private pointerId = -1;

  constructor(label: string, opts: KnobOpts) {
    this.opts = opts;
    this.value = opts.value;
    this.el = document.createElement("div");
    this.el.className = "knob-wrap";
    this.el.innerHTML = `
      <div class="knob" role="slider" tabindex="0" aria-label="${label}">
        <div class="knob-face"><i></i></div>
      </div>
      <span class="knob-val"></span>
      <span class="knob-lab">${label}</span>
    `;
    if (opts.help) this.el.title = `${opts.help}\nDrag up or down, scroll, or use the arrow keys. Double-click to reset.`;
    const face = this.el.querySelector(".knob") as HTMLElement;
    face.addEventListener("pointerdown", (e) => {
      this.dragging = true;
      this.lastY = e.clientY;
      this.pointerId = e.pointerId;
      face.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    face.addEventListener("pointermove", (e) => {
      if (!this.dragging || e.pointerId !== this.pointerId) return;
      const fine = e.shiftKey ? 0.12 : 1;
      const dy = (this.lastY - e.clientY) * fine;
      this.lastY = e.clientY;
      const span = this.opts.max - this.opts.min;
      this.set(this.value + (dy / 140) * span);
    });
    const stop = () => {
      this.dragging = false;
    };
    face.addEventListener("pointerup", stop);
    face.addEventListener("pointercancel", stop);
    face.addEventListener("dblclick", () => this.set(this.opts.home ?? opts.value));
    face.addEventListener("keydown", (e) => {
      const span = this.opts.max - this.opts.min;
      if (e.key === "ArrowUp") this.set(this.value + span * 0.02);
      if (e.key === "ArrowDown") this.set(this.value - span * 0.02);
    });
    face.addEventListener("wheel", (e) => {
      e.preventDefault();
      const span = this.opts.max - this.opts.min;
      this.set(this.value + (e.deltaY > 0 ? -1 : 1) * span * 0.02);
    }, { passive: false });
    this.render();
  }

  set(v: number, silent = false): void {
    const stepped = this.opts.step
      ? Math.round(v / this.opts.step) * this.opts.step
      : v;
    this.value = Math.min(this.opts.max, Math.max(this.opts.min, stepped));
    this.render();
    if (!silent) this.opts.onChange(this.value);
  }

  get(): number {
    return this.value;
  }

  get isDragging(): boolean {
    return this.dragging;
  }

  private render(): void {
    const t = (this.value - this.opts.min) / (this.opts.max - this.opts.min);
    const ang = -135 + t * 270;
    const face = this.el.querySelector(".knob-face") as HTMLElement;
    face.style.setProperty("--ang", `${ang}deg`);
    const val = this.el.querySelector(".knob-val") as HTMLElement;
    val.textContent = this.opts.format
      ? this.opts.format(this.value)
      : this.value.toFixed(this.value >= 10 ? 0 : 2);
  }
}

export function toggle(label: string, on: boolean, onChange: (v: boolean) => void): HTMLElement {
  const el = document.createElement("button");
  el.type = "button";
  el.className = `tog ${on ? "on" : ""}`;
  el.innerHTML = `<b></b><span>${label}</span>`;
  el.addEventListener("click", () => {
    on = !on;
    el.classList.toggle("on", on);
    onChange(on);
  });
  return el;
}

export function btn(label: string, kind: string, onClick: () => void, help?: string): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.className = `act ${kind}`;
  b.textContent = label;
  if (help) b.title = help;
  b.addEventListener("click", onClick);
  return b;
}

export function section(title: string): HTMLElement {
  const s = document.createElement("section");
  s.className = "rack";
  s.innerHTML = `<h3>${title}</h3><div class="rack-body"></div>`;
  return s;
}
