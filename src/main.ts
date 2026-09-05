import { DigitalHerder } from "./engine/device";
import { PRESETS } from "./engine/presets";
import { makeSeedCanvas, paintSeed, SEED_LABELS, type SeedKind } from "./engine/seeds";
import type { DeviceState, LoopState, MonitorKnobs } from "./engine/state";
import { captureHome, driveHome, type HomePose } from "./engine/evolve";
import { applyListen, Ear } from "./engine/listen";
import { applyLook, LOOKS } from "./engine/palettes";
import { FAMILIES, SESSIONS, type Family } from "./sessions";
import { btn, Knob, section, toggle } from "./ui/widgets";

const canvas = document.querySelector<HTMLCanvasElement>("#view")!;
const desk = document.querySelector<HTMLElement>("#desk")!;
const transport = document.querySelector<HTMLElement>("#transport")!;
const hint = document.querySelector<HTMLElement>("#hint")!;
const fpsEl = document.querySelector<HTMLElement>("#fps")!;
const modeEl = document.querySelector<HTMLElement>("#mode")!;
const sessionsEl = document.querySelector<HTMLElement>("#sessions")!;
const startFilters = document.querySelector<HTMLElement>("#start-filters")!;
const playHerd = document.querySelector<HTMLElement>("#play-herd")!;
const looksEl = document.querySelector<HTMLElement>("#looks")!;
const listenLed = document.querySelector<HTMLElement>("#listen-led")!;
const about = document.querySelector<HTMLElement>("#about")!;
const coach = document.querySelector<HTMLElement>("#coach")!;
const coachCopy = document.querySelector<HTMLElement>("#coach-copy")!;
const panHint = document.querySelector<HTMLElement>("#pan-hint")!;
const playNudge = document.querySelector<HTMLElement>("#play-nudge")!;

const herder = new DigitalHerder(canvas);
const seedCanvas = makeSeedCanvas(1024);
let seedKind: SeedKind = "grid";
let seedLive = false;
let webcam: MediaStream | null = null;
let videoEl: HTMLVideoElement | null = null;
let frames = 0;
let fpsT = performance.now();
let recording = false;
let playing = false;
let rec: DeviceState[] = [];
let recIndex = 0;
let currentPreset = "king-glass";
let currentSession = "king-glass";
let familyFilter: "all" | Family = "all";
let coachStep = 0;
let evolveAmt = 0;
let evolveT0 = 0;
let home: HomePose | null = null;
let playScale: Knob | null = null;
let playTiller: Knob | null = null;
let playCopy: Knob | null = null;
let playFolds: Knob | null = null;
let playDelay: Knob | null = null;
let playBright: Knob | null = null;
let listenAmt = 0.85;
let currentLook: string | null = null;
const ear = new Ear();
let listenBtn: HTMLButtonElement | null = null;
let tourBtn: HTMLButtonElement | null = null;
let tourOn = false;
let tourAt = 0;
const TOUR_MS = 20000;

const COACH = [
  "Every thumbnail up top is a picture folded into itself. Tap one, then another.",
  "Drag the picture to look around. Turn Scale to nest deeper. Double-tap the picture to trap it in the loop.",
  "Tour walks the whole board for you. Full is fullscreen. Listen makes it move to music.",
];

function isPhone(): boolean {
  return window.matchMedia("(max-width: 800px)").matches;
}

function pulseSeed(presetId: string): void {
  herder.clear();
  if (presetId === "first-light" || presetId === "jellyfish") herder.inject(0.7);
  else if (presetId === "double-glass" || presetId === "insanity") herder.inject(0.62);
  else herder.inject(0.5);
}

function hidePanHint(): void {
  panHint.classList.add("gone");
}

paintSeed(seedCanvas.getContext("2d")!, seedKind);
herder.setSeed(seedCanvas);

function sizeCanvas(): void {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, isPhone() ? 1.5 : 2);
  const w = Math.max(480, Math.floor(rect.width * dpr));
  const h = Math.max(270, Math.floor(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
}

function fmt(n: number, d = 2): string {
  return n.toFixed(d);
}

function addKnob(
  body: Element,
  label: string,
  min: number,
  max: number,
  value: number,
  onChange: (v: number) => void,
  format?: (v: number) => string,
  help?: string,
): Knob {
  const k = new Knob(label, { min, max, value, onChange, format, help });
  body.append(k.el);
  return k;
}

function monitorBank(title: string, m: MonitorKnobs): HTMLElement {
  const rack = section(title);
  const body = rack.querySelector(".rack-body")!;
  addKnob(body, "Hue", -0.5, 0.5, m.hue, (v) => (m.hue = v), (v) => fmt(v * 360, 0) + "°");
  addKnob(body, "Sat", 0, 2.2, m.sat, (v) => (m.sat = v));
  addKnob(body, "Bright", 0, 1.4, m.bright, (v) => (m.bright = v));
  addKnob(body, "Contrast", 0.4, 2.2, m.contrast, (v) => (m.contrast = v));
  return rack;
}

function loopOptics(title: string, L: LoopState): HTMLElement {
  const rack = section(title);
  const body = rack.querySelector(".rack-body")!;
  addKnob(body, "Scale / rod", 0.32, 0.92, L.zoom, (v) => (L.zoom = v));
  addKnob(body, "Tiller", -3.14, 3.14, L.rotate, (v) => (L.rotate = v), (v) => fmt((v * 180) / Math.PI, 0) + "°");
  addKnob(body, "Spin", -1.2, 1.2, L.spin, (v) => (L.spin = v));
  addKnob(body, "Pan X", -0.5, 0.5, L.panX, (v) => (L.panX = v));
  addKnob(body, "Pan Y", -0.5, 0.5, L.panY, (v) => (L.panY = v));
  addKnob(body, "Glass", 0, 1, L.glassMix, (v) => (L.glassMix = v));
  addKnob(body, "Copy °", -3.14, 3.14, L.copyRotate, (v) => (L.copyRotate = v), (v) => fmt((v * 180) / Math.PI, 0) + "°");
  addKnob(body, "Copy zm", 0.35, 1.4, L.copyScale, (v) => (L.copyScale = v));
  addKnob(body, "Folds", 1, 8, L.folds, (v) => (L.folds = Math.round(v)), (v) => String(Math.round(v)));
  addKnob(body, "Delay fr", 0, 30, L.delayFrames, (v) => (L.delayFrames = Math.round(v)), (v) => String(Math.round(v)));
  addKnob(body, "Delay mix", 0, 1, L.delayMix, (v) => (L.delayMix = v));
  body.append(
    toggle("Flip H", L.flipH, (v) => (L.flipH = v)),
    toggle("Flip V", L.flipV, (v) => (L.flipV = v)),
  );
  return rack;
}

function startSession(id: string, opts: { fromTour?: boolean } = {}): void {
  const sess = SESSIONS.find((s) => s.id === id) ?? SESSIONS[0];
  if (!opts.fromTour) setTour(false);
  tourAt = performance.now();
  currentPreset = sess.preset;
  currentSession = sess.id;
  const url = new URL(location.href);
  url.searchParams.set("session", sess.id);
  history.replaceState(null, "", url);
  seedKind = sess.seed;
  seedLive = false;
  videoEl = null;
  paintSeed(seedCanvas.getContext("2d")!, seedKind);
  herder.setSeed(seedCanvas);
  const p = PRESETS.find((x) => x.id === sess.preset);
  if (!p) return;
  herder.state = p.apply();
  herder.state.A.spin = sess.spin ?? herder.state.A.spin;
  herder.state.feedbackAmt = Math.max(herder.state.feedbackAmt, 1);
  evolveAmt = sess.evolve ?? 0;
  home = captureHome(herder.state);
  currentLook = null;
  evolveT0 = 0;
  if (isPhone()) herder.resize(540);
  const moving = evolveAmt >= 0.04;
  hint.textContent = `Drag the picture to look around. Scroll or drag a knob to turn it. Double-tap or press Space to trap.${
    moving ? " This one drifts on its own; turn Evolve down to hold it." : " Turn Evolve up if you want it to drift."
  }`;
  playNudge.textContent = `${sess.name} — ${sess.blurb}`;
  pulseSeed(sess.preset);
  buildDesk();
  buildPlayHerd();
  buildLooks();
  buildSessions();
}

function visibleSessions() {
  return familyFilter === "all" ? SESSIONS : SESSIONS.filter((s) => s.family === familyFilter);
}

function surpriseSession(): void {
  const others = visibleSessions().filter((s) => s.id !== currentSession);
  const pick = others[Math.floor(Math.random() * others.length)] ?? SESSIONS[0];
  startSession(pick.id);
}

function stepSession(dir: 1 | -1, fromTour = false): void {
  const pool = visibleSessions();
  const i = pool.findIndex((s) => s.id === currentSession);
  const next = pool[(i + dir + pool.length) % pool.length] ?? pool[0];
  startSession(next.id, { fromTour });
}

function setTour(on: boolean): void {
  tourOn = on;
  tourAt = performance.now();
  tourBtn?.classList.toggle("on", on);
  if (on) hint.textContent = `Tour is on. A new start every ${TOUR_MS / 1000} seconds. Tap any thumbnail or knob to take over.`;
}

function showCoach(): void {
  if (localStorage.getItem("dlh-coached")) return;
  coach.classList.remove("hidden");
  coachCopy.textContent = COACH[coachStep] ?? COACH[0];
}

function advanceCoach(): void {
  coachStep += 1;
  if (coachStep >= COACH.length) {
    coach.classList.add("hidden");
    localStorage.setItem("dlh-coached", "1");
    return;
  }
  coachCopy.textContent = COACH[coachStep];
}

function buildSessions(): void {
  startFilters.replaceChildren();
  for (const fam of FAMILIES) {
    const f = document.createElement("button");
    f.type = "button";
    f.className = `start-filter${fam.id === familyFilter ? " on" : ""}`;
    f.textContent = fam.label;
    f.addEventListener("click", () => {
      familyFilter = fam.id;
      buildSessions();
    });
    startFilters.append(f);
  }

  sessionsEl.replaceChildren();
  const surprise = document.createElement("button");
  surprise.type = "button";
  surprise.className = "start-card surprise";
  surprise.innerHTML = `<span class="start-thumb start-thumb-empty">?</span><b>Wild card</b><span>Surprise me</span>`;
  surprise.addEventListener("click", surpriseSession);
  sessionsEl.append(surprise);

  const shown =
    familyFilter === "all" ? SESSIONS : SESSIONS.filter((s) => s.family === familyFilter);
  for (const sess of shown) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `start-card${sess.id === currentSession ? " on" : ""}`;
    b.title = sess.blurb;
    const thumb = document.createElement("canvas");
    thumb.className = "start-thumb";
    thumb.width = 128;
    thumb.height = 128;
    paintSeed(thumb.getContext("2d")!, sess.seed);
    const meta = document.createElement("span");
    meta.className = "start-meta";
    meta.innerHTML = `<b>${sess.tag}</b>${sess.name}`;
    b.append(thumb, meta);
    b.addEventListener("click", () => startSession(sess.id));
    sessionsEl.append(b);
    if (sess.id === currentSession) queueMicrotask(() => b.scrollIntoView({ block: "nearest", inline: "nearest" }));
  }
}

function setNestDelay(frames: number): void {
  const n = Math.round(Math.max(0, Math.min(30, frames)));
  const mix = n <= 0 ? 0 : 0.28 + (n / 30) * 0.42;
  for (const L of [herder.state.A, herder.state.B, herder.state.C]) {
    L.delayFrames = n;
    L.delayMix = mix;
  }
}

function syncPlayKnobs(): void {
  const A = herder.state.A;
  if (playScale && !playScale.isDragging) playScale.set(A.zoom, true);
  if (playTiller && !playTiller.isDragging) playTiller.set(A.rotate, true);
  if (playCopy && !playCopy.isDragging) playCopy.set(A.copyRotate, true);
  if (playFolds && !playFolds.isDragging) playFolds.set(A.folds, true);
  if (playDelay && !playDelay.isDragging) playDelay.set(A.delayFrames, true);
  if (playBright && !playBright.isDragging) playBright.set(A.top.bright, true);
}

function buildPlayHerd(): void {
  const A = herder.state.A;
  playHerd.replaceChildren();
  const deg = (v: number) => fmt((v * 180) / Math.PI, 0) + "°";
  playScale = addKnob(playHerd, "Scale", 0.32, 0.92, home?.zoom ?? A.zoom, (v) => {
    A.zoom = v;
    if (home) home.zoom = v;
  }, undefined, "How much smaller each copy is. Lower nests deeper; higher fills the screen.");
  playTiller = addKnob(playHerd, "Tiller", -3.14, 3.14, home?.rotate ?? A.rotate, (v) => {
    A.rotate = v;
    if (home) home.rotate = v;
  }, deg, "Turns the whole picture a little each generation. Small turns make spirals.");
  playCopy = addKnob(playHerd, "Copy °", -6.28, 6.28, home?.copyRotate ?? A.copyRotate, (v) => {
    A.copyRotate = v;
    if (home) home.copyRotate = v;
  }, deg, "The angle between copies. 90° is Peter King’s fold; 120° makes gaskets; 60° makes snowflakes.");
  playFolds = addKnob(playHerd, "Folds", 1, 8, home?.folds ?? A.folds, (v) => {
    const n = Math.round(v);
    A.folds = n;
    if (home) home.folds = n;
  }, (v) => String(Math.round(v)), "How many copies sit on the glass at once.");
  playBright = addKnob(playHerd, "Bright", 0, 1.4, A.top.bright, (v) => {
    A.top.bright = v;
    if (home) home.bright = v;
  }, undefined, "Camera brightness. The loop lives in a narrow band: too low fades to black, too high floods.");
  playDelay = addKnob(
    playHerd,
    "Delay",
    0,
    30,
    home?.delayFrames ?? A.delayFrames,
    (v) => {
      setNestDelay(v);
      if (home) home.delayFrames = Math.round(v);
    },
    (v) => (Math.round(v) <= 0 ? "now" : `${Math.round(v)} fr`),
    "Frames of lag between one generation and the next. Turns motion into trails.",
  );
  addKnob(
    playHerd,
    "Evolve",
    0,
    1,
    evolveAmt,
    (v) => (evolveAmt = v),
    (v) => (v < 0.04 ? "still" : v >= 0.97 ? "full" : fmt(v)),
    "Lets the knobs drift on their own. Still holds the picture; full wanders.",
  );
}

function buildLooks(): void {
  looksEl.replaceChildren();
  const lab = document.createElement("span");
  lab.className = "looks-lab";
  lab.textContent = "Look";
  lab.title = "Colour grades for the monitors. Tap one mid-session; the nest keeps its shape.";
  looksEl.append(lab);
  for (const look of LOOKS) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `look${currentLook === look.id ? " on" : ""}`;
    b.innerHTML = `<i style="background:${look.swatch}"></i>${look.name}`;
    b.addEventListener("click", () => {
      currentLook = look.id;
      applyLook(herder.state, look, home);
      buildLooks();
    });
    looksEl.append(b);
  }
}

async function toggleListen(): Promise<void> {
  if (ear.live) {
    ear.stop();
    listenBtn?.classList.remove("on");
    listenLed.classList.add("hidden");
    return;
  }
  try {
    await ear.mic();
    listenBtn?.classList.add("on");
    listenLed.classList.remove("hidden");
    hint.textContent = "Listening. Bass pulls Scale in. Kicks inject light. Drop a song on the picture to use that instead.";
  } catch {
    hint.textContent = "Mic blocked. Drop an audio file on the picture, or pick Song.";
  }
}

async function listenFile(file: File): Promise<void> {
  try {
    await ear.file(file);
    listenBtn?.classList.add("on");
    listenLed.classList.remove("hidden");
    hint.textContent = `Playing ${file.name}. Bass herds Scale. Kicks inject.`;
  } catch {
    hint.textContent = "Could not play that file.";
  }
}

function goFull(): void {
  const box = canvas.closest(".bezel") ?? canvas;
  if (document.fullscreenElement) void document.exitFullscreen();
  else void box.requestFullscreen();
}

function select(opts: { label: string; value: string }[], value: string, onChange: (v: string) => void): HTMLSelectElement {
  const s = document.createElement("select");
  for (const o of opts) {
    const op = document.createElement("option");
    op.value = o.value;
    op.textContent = o.label;
    s.append(op);
  }
  s.value = value;
  s.addEventListener("change", () => onChange(s.value));
  return s;
}

function buildDesk(): void {
  const S = herder.state;
  desk.replaceChildren();

  const presets = section("Presets");
  presets.querySelector(".rack-body")!.append(
    select(
      PRESETS.map((p) => ({ label: p.name, value: p.id })),
      currentPreset,
      (id) => {
        const sess = SESSIONS.find((s) => s.preset === id);
        if (sess) {
          startSession(sess.id);
          return;
        }
        currentPreset = id;
        const p = PRESETS.find((x) => x.id === id);
        if (!p) return;
        herder.state = p.apply();
        hint.textContent = p.hint;
        buildDesk();
        buildPlayHerd();
        pulseSeed(id);
      },
    ),
  );
  desk.append(presets);

  const seed = section("Seed / playback unit");
  const seedBody = seed.querySelector(".rack-body")!;
  seedBody.append(
    select(
      SEED_LABELS,
      seedKind,
      (v) => {
        seedKind = v as SeedKind;
        seedLive = false;
        paintSeed(seedCanvas.getContext("2d")!, seedKind);
        herder.setSeed(seedCanvas);
      },
    ),
    btn("Inject seed", "", () => herder.inject(0.9)),
  );
  addKnob(seedBody, "Seed leak", 0, 0.25, S.seedAmt, (v) => (S.seedAmt = v));
  const file = document.createElement("label");
  file.className = "file";
  file.textContent = "Load image / video";
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*,video/*";
  input.addEventListener("change", () => {
    const f = input.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (f.type.startsWith("video")) {
      const vid = document.createElement("video");
      vid.src = url;
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      void vid.play();
      videoEl = vid;
      seedLive = true;
    } else {
      const img = new Image();
      img.onload = () => {
        const ctx = seedCanvas.getContext("2d")!;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, seedCanvas.width, seedCanvas.height);
        ctx.drawImage(img, 0, 0, seedCanvas.width, seedCanvas.height);
        herder.setSeed(seedCanvas);
        seedLive = false;
        videoEl = null;
      };
      img.src = url;
    }
  });
  file.append(input);
  seedBody.append(file);
  seedBody.append(
    btn("Webcam", "", async () => {
      if (webcam) {
        webcam.getTracks().forEach((t) => t.stop());
        webcam = null;
        videoEl = null;
        seedLive = false;
        return;
      }
      webcam = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      const vid = document.createElement("video");
      vid.srcObject = webcam;
      vid.muted = true;
      vid.playsInline = true;
      await vid.play();
      videoEl = vid;
      seedLive = true;
    }),
  );
  desk.append(seed);

  const view = section("Switcher / router");
  const viewBody = view.querySelector(".rack-body")!;
  viewBody.append(
    select(
      [
        { label: "View A (left structure)", value: "0" },
        { label: "View B (right structure)", value: "1" },
        { label: "View C (front camera)", value: "2" },
        { label: "Mix A+B", value: "3" },
        { label: "Split A | B", value: "4" },
      ],
      String(S.view),
      (v) => (S.view = Number(v) as DeviceState["view"]),
    ),
    select(
      [
        { label: "60 fps smooth", value: "60" },
        { label: "30 fps", value: "30" },
        { label: "24 fps stutter", value: "24" },
      ],
      String(S.fps),
      (v) => (S.fps = Number(v)),
    ),
    select(
      [
        { label: "960×540", value: "540" },
        { label: "1280×720", value: "720" },
        { label: "1920×1080", value: "1080" },
      ],
      String(S.resolution),
      (v) => herder.resize(Number(v) as DeviceState["resolution"]),
    ),
    toggle("Linked rods", S.linkedRods, (v) => (S.linkedRods = v)),
    toggle("Insanity", S.insanity, (v) => (S.insanity = v)),
    toggle("Quantize cuts", S.quantize, (v) => (S.quantize = v)),
  );
  addKnob(viewBody, "Evolve", 0, 1, evolveAmt, (v) => (evolveAmt = v), (v) => (v < 0.04 ? "still" : v >= 0.97 ? "full" : fmt(v)));
  addKnob(viewBody, "Listen", 0, 1, listenAmt, (v) => (listenAmt = v), (v) => (v < 0.04 ? "off" : fmt(v)));
  addKnob(viewBody, "Mix A/B", 0, 1, S.mixAB, (v) => (S.mixAB = v));
  addKnob(viewBody, "BPM", 40, 200, S.bpm, (v) => (S.bpm = v), (v) => String(Math.round(v)));
  addKnob(viewBody, "Cut len", 0.02, 0.9, S.cutLen, (v) => (S.cutLen = v));
  addKnob(viewBody, "Period", 0.25, 8, S.period, (v) => (S.period = v));
  addKnob(viewBody, "Cross mix", 0, 1, S.otherAmt, (v) => (S.otherAmt = v));
  desk.append(view);

  const key = section("Keyer (luma / chroma)");
  const keyBody = key.querySelector(".rack-body")!;
  keyBody.append(
    select(
      [
        { label: "Key off", value: "0" },
        { label: "Luma key", value: "1" },
        { label: "Chroma key", value: "2" },
      ],
      String(S.keyMode),
      (v) => (S.keyMode = Number(v) as DeviceState["keyMode"]),
    ),
  );
  addKnob(keyBody, "Clip", 0, 1, S.keyClip, (v) => (S.keyClip = v));
  addKnob(keyBody, "Gain", 0.01, 1, S.keyGain, (v) => (S.keyGain = v));
  desk.append(key);

  desk.append(loopOptics("Structure A — rod + glass", S.A));
  desk.append(monitorBank("Monitor A top  H/S/B/C", S.A.top));
  desk.append(monitorBank("Monitor A bottom  H/S/B/C", S.A.bot));
  desk.append(loopOptics("Structure B — linked or free", S.B));
  desk.append(monitorBank("Monitor B top  H/S/B/C", S.B.top));
  desk.append(monitorBank("Monitor B bottom  H/S/B/C", S.B.bot));
  desk.append(loopOptics("Front camera / rotating monitor", S.C));
  desk.append(monitorBank("Monitor C  H/S/B/C", S.C.top));

  const fx = section("Effects rack");
  const fxBody = fx.querySelector(".rack-body")!;
  addKnob(fxBody, "Noise", 0, 0.12, S.noise, (v) => (S.noise = v));
  addKnob(fxBody, "Hue drift", 0, 0.03, S.hueDrift, (v) => (S.hueDrift = v));
  addKnob(fxBody, "Aberration", 0, 0.02, S.aberration, (v) => (S.aberration = v));
  addKnob(fxBody, "Persist", 0, 0.8, S.persist, (v) => (S.persist = v));
  addKnob(fxBody, "Decay", 0.9, 1.02, S.decay, (v) => (S.decay = v));
  addKnob(fxBody, "Barrel", 0, 0.25, S.barrel, (v) => (S.barrel = v));
  addKnob(fxBody, "Edge", 0, 0.8, S.edge, (v) => (S.edge = v));
  addKnob(fxBody, "Soft", 0, 4, S.soft, (v) => (S.soft = v));
  addKnob(fxBody, "Bloom", 0, 1.4, S.bloom, (v) => (S.bloom = v));
  addKnob(fxBody, "Smear", 0, 4, S.smear, (v) => (S.smear = v));
  addKnob(fxBody, "Warp", 0, 0.05, S.warp, (v) => (S.warp = v));
  addKnob(fxBody, "Kaleido", 0, 12, S.kaleido, (v) => (S.kaleido = Math.round(v)), (v) => String(Math.round(v)));
  addKnob(fxBody, "Poster", 0, 12, S.poster, (v) => (S.poster = v));
  addKnob(fxBody, "Invert", 0, 1, S.invert, (v) => (S.invert = v));
  addKnob(fxBody, "Chroma", 0, 0.5, S.chromaSep, (v) => (S.chromaSep = v));
  addKnob(fxBody, "Gamma", 0.5, 1.6, S.gamma, (v) => (S.gamma = v));
  addKnob(fxBody, "Scan", 0, 0.7, S.scan, (v) => (S.scan = v));
  addKnob(fxBody, "Vignette", 0, 0.8, S.vignette, (v) => (S.vignette = v));
  addKnob(fxBody, "Feedback", 0.6, 1.15, S.feedbackAmt, (v) => (S.feedbackAmt = v));
  desk.append(fx);
}

function buildTransport(): void {
  transport.replaceChildren();
  tourBtn = btn("Tour", "play-keep", () => setTour(!tourOn), "Walk the whole board, a new start every 20 seconds.");
  transport.append(
    tourBtn,
    btn("Next", "play-keep", () => stepSession(1), "Jump to the next start. Keyboard: N"),
    btn("Trap", "cut play-keep", () => herder.trap("all"), "Lock the picture into the loop so it lives without its source. Space or double-tap."),
    btn("Flash", "play-keep", () => herder.inject(0.9), "Push the seed picture back into the loop for one frame."),
    btn("Trap A", "cut console-only", () => herder.trap("A")),
    btn("Trap B", "cut console-only", () => herder.trap("B")),
    btn("Into fractal", "cut console-only", () => {
      herder.state.A.bottomSrc = 2;
      herder.state.B.bottomSrc = 2;
      herder.trap("A");
    }),
    btn("Reset", "play-keep", () => {
      herder.clear();
      herder.inject(0.8);
    }, "Black the loop and start this picture over. Keyboard: R"),
    btn("Freeze", "console-only", () => {
      herder.state.frozen = !herder.state.frozen;
    }),
    btn("Rec knobs", "rec console-only", () => {
      recording = !recording;
      playing = false;
      if (recording) rec = [];
    }),
    btn("Play knobs", "console-only", () => {
      if (rec.length < 2) return;
      playing = !playing;
      recording = false;
      recIndex = 0;
    }),
    btn("Save", "play-keep", () => {
      const a = document.createElement("a");
      a.download = `foldlight-${currentSession}-${Date.now()}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    }, "Download this frame as a PNG."),
  );
  listenBtn = btn("Listen", "play-keep", () => {
    void toggleListen();
  }, "Use the microphone. Bass pulls Scale in; kicks flash light. Keyboard: L");
  transport.append(listenBtn);
  const song = document.createElement("label");
  song.className = "act file play-keep";
  song.title = "Play an audio file through the loop. You can also drop one on the picture.";
  song.textContent = "Song";
  const songIn = document.createElement("input");
  songIn.type = "file";
  songIn.accept = "audio/*";
  songIn.addEventListener("change", () => {
    const f = songIn.files?.[0];
    if (f) void listenFile(f);
  });
  song.append(songIn);
  transport.append(song);
  transport.append(btn("Full", "play-keep", goFull, "Fullscreen. Esc to leave."));
}

buildTransport();

const params = new URLSearchParams(location.search);
if (params.has("eval")) {
  localStorage.setItem("dlh-coached", "1");
  coach.classList.add("hidden");
  panHint.classList.add("gone");
}

startSession(params.get("session") ?? "king-glass");
if (params.has("tour")) setTour(true);

Object.assign(window, {
  __foldlight: {
    start: startSession,
    ids: () => SESSIONS.map((s) => s.id),
    pose: () => {
      const A = herder.state.A;
      const S = herder.state;
      return {
        zoom: A.zoom,
        rotate: A.rotate,
        copyRotate: A.copyRotate,
        copyScale: A.copyScale,
        folds: A.folds,
        delay: A.delayFrames,
        glass: A.glassMix,
        smear: S.smear,
        kaleido: S.kaleido,
        hue: A.top.hue,
      };
    },
  },
});

showCoach();
document.querySelector("#coach-next")?.addEventListener("click", advanceCoach);
document.querySelector("#coach-skip")?.addEventListener("click", () => {
  coach.classList.add("hidden");
  localStorage.setItem("dlh-coached", "1");
});

const openAbout = () => about.classList.remove("hidden");
const closeAbout = () => about.classList.add("hidden");
document.querySelector("#open-about")?.addEventListener("click", openAbout);
document.querySelector("#close-about")?.addEventListener("click", closeAbout);
about.addEventListener("click", (e) => {
  if (e.target === about) closeAbout();
});

document.querySelector("#mode-play")?.addEventListener("click", () => {
  document.body.classList.remove("mode-console");
  document.body.classList.add("mode-play");
});
document.querySelector("#mode-console")?.addEventListener("click", () => {
  document.body.classList.remove("mode-play");
  document.body.classList.add("mode-console");
});

if (isPhone()) herder.resize(540);

// Touching a knob or the picture takes over from the Tour.
for (const el of [playHerd, canvas, looksEl]) {
  el.addEventListener("pointerdown", () => {
    if (tourOn) setTour(false);
  });
}

canvas.addEventListener("pointerdown", (e) => {
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!e.buttons) return;
  const dx = e.movementX * 0.0015;
  const dy = -e.movementY * 0.0015;
  herder.state.A.panX += dx;
  herder.state.A.panY += dy;
  if (home) {
    home.panX += dx;
    home.panY += dy;
  }
  hidePanHint();
});
let lastTap = 0;
canvas.addEventListener("pointerup", (e) => {
  if (e.pointerType !== "touch") return;
  const t = performance.now();
  if (t - lastTap < 280) herder.trap("all");
  lastTap = t;
});
canvas.addEventListener("dblclick", () => herder.trap("all"));
canvas.addEventListener("dragover", (e) => e.preventDefault());
canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const f = e.dataTransfer?.files[0];
  if (f?.type.startsWith("audio")) void listenFile(f);
});

window.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
  const A = herder.state.A;
  if (e.code === "Space") {
    e.preventDefault();
    herder.trap("all");
  }
  if (e.key === "l") void toggleListen();
  if (e.key === "n") stepSession(1);
  if (e.key === "p") stepSession(-1);
  if (e.key === "t") setTour(!tourOn);
  if (e.key === "f") herder.state.frozen = !herder.state.frozen;
  if (e.key === "r") {
    herder.clear();
    herder.inject(0.8);
  }
  if (e.key === "q") {
    A.rotate -= 0.04;
    if (home) home.rotate -= 0.04;
  }
  if (e.key === "e") {
    A.rotate += 0.04;
    if (home) home.rotate += 0.04;
  }
  if (e.key === "w") {
    A.zoom = Math.min(0.92, A.zoom + 0.01);
    if (home) home.zoom = A.zoom;
  }
  if (e.key === "s") {
    A.zoom = Math.max(0.34, A.zoom - 0.01);
    if (home) home.zoom = A.zoom;
  }
  if (e.key === "a" || e.key === "ArrowLeft") {
    A.panX -= 0.01;
    if (home) home.panX -= 0.01;
    hidePanHint();
  }
  if (e.key === "d" || e.key === "ArrowRight") {
    A.panX += 0.01;
    if (home) home.panX += 0.01;
    hidePanHint();
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    A.panY += 0.01;
    if (home) home.panY += 0.01;
    hidePanHint();
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    A.panY -= 0.01;
    if (home) home.panY -= 0.01;
    hidePanHint();
  }
  if (e.key >= "1" && e.key <= "9") {
    const sess = SESSIONS[Number(e.key) - 1];
    if (sess) startSession(sess.id);
  }
});

function loop(now: number): void {
  sizeCanvas();
  if (seedLive && videoEl && videoEl.readyState >= 2) herder.setSeed(videoEl);
  if (recording) {
    if (rec.length < 2400) rec.push(structuredClone(herder.state));
  }
  if (playing && rec.length) {
    recIndex = (recIndex + 1) % rec.length;
    const snap = rec[recIndex];
    const live = herder.state;
    live.A = snap.A;
    live.B = snap.B;
    live.C = snap.C;
    live.insanity = snap.insanity;
    live.noise = snap.noise;
    live.hueDrift = snap.hueDrift;
    live.decay = snap.decay;
  } else if (home && !herder.state.frozen) {
    const evolving = evolveAmt >= 0.04;
    if (evolving) {
      if (!evolveT0) evolveT0 = now;
      driveHome(herder.state, home, (now - evolveT0) / 1000, evolveAmt);
    }
    if (ear.live && listenAmt >= 0.04) {
      const bands = ear.poll(now);
      applyListen(herder.state, home, bands, listenAmt, !evolving);
      if (bands.kick) herder.inject(0.55);
    }
  }
  herder.tick(now);
  syncPlayKnobs();
  if (tourOn && now - tourAt > TOUR_MS && document.visibilityState === "visible") stepSession(1, true);
  frames++;
  if (now - fpsT > 500) {
    const fps = Math.round((frames * 1000) / (now - fpsT));
    fpsEl.textContent = `${fps} FPS · ${herder.state.fps} lock`;
    frames = 0;
    fpsT = now;
  }
  const src = herder.state.A.bottomSrc;
  modeEl.textContent = herder.state.insanity
    ? "INSANITY"
    : src === 0
      ? "SEED ARMED"
      : src === 2
        ? "CROSS LOOP"
        : "TRAPPED";
  requestAnimationFrame(loop);
}

window.addEventListener("resize", sizeCanvas);
requestAnimationFrame(loop);
