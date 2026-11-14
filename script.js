const CONFIG = {
  name: "Nasira",
  from: "Saul",
  startDate: "2026-10-28T00:00:00",

  reasons: [
    "You make me feel loved in ways I never knew I needed.",
    "You make me laugh in ways nobody else can.",
    "I love how I can be completely myself around you, without pretending to be anyone else.",
    "Every little thing about you gives me another reason to fall in love with you",
    "You believe in me, even on the days I don't.",
    "The way you care about the people you love inspires me.",
    "No matter how my day goes, talking to you is always one of my favorite parts.",
    "You make me want to be a better man, every single day.",
    "Even our silences feel full and warm with you.",
    "You turn small moments into memories I never want to lose.",
    "You make me feel lucky just by being part of my life.",
    "Because you are you, and I'd choose you in every universe.",
  ],

  letter: [
    "My dearest Nasira,",
    "I wanted to give you something that couldn't be bought in a store. So I built you a little universe, one star for every reason my heart beats a little faster.",
    "Before you, I didn't know that love could feel this calm and this exciting at the same time. You walked into my life and quietly rearranged all the stars.",
    "Thank you for your for loving me exactly as I am. Every day with you is my favorite chapter.",
    "No matter how far we are, I'll always be looking at the same sky as you, thinking of you.",
    "Forever yours,",
  ],
};

const $ = (s) => document.querySelector(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
let W = innerWidth,
  H = innerHeight;
const mouse = { x: W / 2, y: H / 2, active: false };

document.title = `For ${CONFIG.name} ♥`;
$("#nameTitle").textContent = CONFIG.name;
$("#heartName").textContent = CONFIG.name;
$("#finalSig").textContent = `Yours always my love`;

let actx = null,
  soundOn = true;
const SCALE = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
function audio() {
  if (!actx) {
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}
  }
  if (actx && actx.state === "suspended") actx.resume();
  return actx;
}
function chime(freq, vol = 0.12, dur = 1.8) {
  if (!soundOn || !audio()) return;
  const t = actx.currentTime;
  const o = actx.createOscillator(),
    o2 = actx.createOscillator(),
    g = actx.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  o2.type = "triangle";
  o2.frequency.value = freq * 2;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  o2.connect(g);
  g.connect(actx.destination);
  o.start(t);
  o2.start(t);
  o.stop(t + dur);
  o2.stop(t + dur);
}
function arpeggio(notes = [0, 2, 4, 7, 4, 2], gap = 140) {
  notes.forEach((n, i) =>
    setTimeout(() => chime(SCALE[n % SCALE.length], 0.09, 1.6), i * gap),
  );
}
$("#sound").addEventListener("click", (e) => {
  soundOn = !soundOn;
  e.currentTarget.classList.toggle("off", !soundOn);
  e.currentTarget.textContent = soundOn ? "On" : "Off";
});

const bg = $("#bg"),
  bctx = bg.getContext("2d");
const fx = $("#fx"),
  fctx = fx.getContext("2d");
let stars = [];
function resize() {
  W = innerWidth;
  H = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  [bg, fx].forEach((c) => {
    c.width = W * dpr;
    c.height = H * dpr;
  });
  bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.round((W * H) / 5500);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    z: rand(0.2, 1),
    r: rand(0.4, 1.7),
    t: rand(0, Math.PI * 2),
    s: rand(0.01, 0.035),
  }));
}
addEventListener("resize", () => {
  resize();
  layoutStars();
});
resize();

let shooters = [];
function drawBg() {
  bctx.clearRect(0, 0, W, H);
  const px = (mouse.x - W / 2) / W,
    py = (mouse.y - H / 2) / H;
  for (const s of stars) {
    s.t += s.s;
    const a = 0.35 + 0.65 * Math.abs(Math.sin(s.t));
    const x = s.x - px * 30 * s.z,
      y = s.y - py * 30 * s.z;
    bctx.globalAlpha = a;
    bctx.fillStyle = s.z > 0.75 ? "#ffd6e8" : "#fff";
    bctx.beginPath();
    bctx.arc(x, y, s.r * s.z + 0.2, 0, 6.283);
    bctx.fill();
  }
  if (Math.random() < 0.006) {
    shooters.push({
      x: rand(0, W),
      y: rand(0, H * 0.4),
      vx: rand(6, 10),
      vy: rand(2.5, 5),
      life: 1,
    });
  }
  shooters = shooters.filter((s) => s.life > 0);
  for (const s of shooters) {
    bctx.globalAlpha = s.life;
    const g = bctx.createLinearGradient(
      s.x,
      s.y,
      s.x - s.vx * 9,
      s.y - s.vy * 9,
    );
    g.addColorStop(0, "#fff");
    g.addColorStop(1, "transparent");
    bctx.strokeStyle = g;
    bctx.lineWidth = 1.8;
    bctx.beginPath();
    bctx.moveTo(s.x, s.y);
    bctx.lineTo(s.x - s.vx * 9, s.y - s.vy * 9);
    bctx.stroke();
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.018;
  }
  bctx.globalAlpha = 1;
}

let parts = [];
const COLORS = ["#ff6b9d", "#ffd6a5", "#b8a1ff", "#ff9ec4", "#ffffff"];

function sparkle(x, y) {
  parts.push({
    k: "spark",
    x,
    y,
    vx: rand(-0.6, 0.6),
    vy: rand(-0.6, 0.6),
    life: 1,
    d: rand(0.02, 0.04),
    size: rand(1.5, 3.2),
    c: COLORS[(Math.random() * COLORS.length) | 0],
  });
}
function burst(x, y, n = 90) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, 6.283),
      sp = rand(2, 9);
    parts.push({
      k: Math.random() < 0.5 ? "heart" : "spark",
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 2,
      g: 0.12,
      life: 1,
      d: rand(0.008, 0.016),
      size: rand(10, 22),
      c: COLORS[(Math.random() * 4) | 0],
    });
  }
}
function heartRain(n = 60) {
  for (let i = 0; i < n; i++) {
    setTimeout(
      () =>
        parts.push({
          k: "heart",
          x: rand(0, W),
          y: -20,
          vx: rand(-0.4, 0.4),
          vy: rand(1, 2.6),
          life: 1,
          d: 0.0025,
          size: rand(12, 26),
          c: COLORS[(Math.random() * 3) | 0],
          sway: rand(0, 6),
        }),
      i * 90,
    );
  }
}
async function formText(str) {
  try {
    await document.fonts.load('700 60px "Playfair Display"');
  } catch (e) {}
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const c = off.getContext("2d");
  const size = Math.min(W / (str.length * 0.5), 110);
  c.font = `700 ${size}px "Playfair Display", serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillStyle = "#fff";
  c.fillText(str, W / 2, Math.max(H * 0.22, 110));
  const d = c.getImageData(0, 0, W, H).data,
    step = W < 600 ? 4 : 5;
  for (let y = 0; y < H; y += step)
    for (let x = 0; x < W; x += step) {
      if (d[(y * W + x) * 4 + 3] > 140) {
        parts.push({
          k: "text",
          x: rand(0, W),
          y: rand(H * 0.4, H),
          tx: x,
          ty: y,
          life: 1,
          size: rand(1.4, 2.6),
          c: COLORS[(Math.random() * 3) | 0],
          ph: rand(0, 6.28),
        });
      }
    }
}

function drawFx(time) {
  fctx.clearRect(0, 0, W, H);
  fctx.textAlign = "center";
  fctx.textBaseline = "middle";
  for (const p of parts) {
    if (p.k === "text") {
      p.x += (p.tx - p.x) * 0.05;
      p.y += (p.ty - p.y) * 0.05;
      const dx = p.x - mouse.x,
        dy = p.y - mouse.y,
        dist = Math.hypot(dx, dy);
      if (mouse.active && dist < 70) {
        p.x += (dx / dist) * 5;
        p.y += (dy / dist) * 5;
      }
      fctx.globalAlpha = 0.75 + 0.25 * Math.sin(time / 400 + p.ph);
      fctx.fillStyle = p.c;
      fctx.shadowColor = p.c;
      fctx.shadowBlur = 6;
      fctx.fillRect(p.x, p.y, p.size, p.size);
      continue;
    }
    p.life -= p.d;
    p.x +=
      p.vx + (p.sway !== undefined ? Math.sin(time / 600 + p.sway) * 0.6 : 0);
    p.y += p.vy;
    if (p.g) p.vy += p.g;
    fctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
    fctx.shadowBlur = 8;
    fctx.shadowColor = p.c;
    fctx.fillStyle = p.c;
    if (p.k === "heart") {
      fctx.font = `${p.size}px serif`;
      fctx.fillText("♥", p.x, p.y);
    } else {
      fctx.beginPath();
      fctx.arc(p.x, p.y, p.size * Math.max(p.life, 0), 0, 6.283);
      fctx.fill();
    }
  }
  fctx.globalAlpha = 1;
  fctx.shadowBlur = 0;
  parts = parts.filter((p) => p.k === "text" || (p.life > 0 && p.y < H + 40));
}

function frame(t) {
  drawBg();
  drawFx(t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

addEventListener("pointermove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
  if (Math.random() < 0.55) sparkle(e.clientX, e.clientY);
});
addEventListener("pointerleave", () => (mouse.active = false));

function show(id) {
  document
    .querySelectorAll(".scene")
    .forEach((s) => s.classList.toggle("active", s.id === id));
}

//Scene 1 a 2
$("#beginBtn").addEventListener("click", (e) => {
  audio();
  arpeggio();
  burst(e.clientX, e.clientY, 40);
  show("stars");
});

// Scene 2
const stage = $("#stage"),
  linesSvg = $("#lines");
const N = 12;
const points = Array.from({ length: N }, (_, i) => {
  const t = Math.PI + (i * 2 * Math.PI) / N;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return { x: 50 + x * 2.8, y: 50 - (y + 2.5) * 2.7 };
});
const starEls = points.map((p, i) => {
  const b = document.createElement("button");
  b.className = "star";
  b.setAttribute("aria-label", `Star ${i + 1}`);
  b.style.setProperty("--d", `${rand(0, 2).toFixed(2)}s`);
  b.addEventListener("click", () => pickStar(i));
  stage.appendChild(b);
  return b;
});
function layoutStars() {
  starEls.forEach((b, i) => {
    b.style.left = points[i].x + "%";
    b.style.top = points[i].y + "%";
  });
}
layoutStars();

const found = new Set();
let lastIdx = null;
const NS = "http://www.w3.org/2000/svg";

function pickStar(i) {
  audio();
  const el = starEls[i];
  const isNew = !found.has(i);
  starEls.forEach((s) => s.classList.remove("current"));
  el.classList.add("found", "current");
  chime(SCALE[i % SCALE.length] * (i > 7 ? 0.5 : 1), 0.14);
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, isNew ? 26 : 8);

  const box = $("#reason");
  box.classList.remove("swap");
  void box.offsetWidth;
  box.classList.add("swap");
  box.innerHTML = `<span><small>reason #${i + 1}</small>${CONFIG.reasons[i] || ""}</span>`;

  if (isNew) {
    found.add(i);
    if (lastIdx !== null) {
      const ln = document.createElementNS(NS, "line");
      ln.setAttribute("x1", points[lastIdx].x);
      ln.setAttribute("y1", points[lastIdx].y);
      ln.setAttribute("x2", points[i].x);
      ln.setAttribute("y2", points[i].y);
      linesSvg.appendChild(ln);
    }
    lastIdx = i;
    $("#progress").textContent = `${found.size} / ${N} stars found`;
    if (found.size === N) completeHeart();
  }
}

async function completeHeart() {
  await sleep(900);
  const path = document.createElementNS(NS, "path");
  path.setAttribute(
    "d",
    "M" + points.map((p) => `${p.x} ${p.y}`).join(" L") + " Z",
  );
  linesSvg.appendChild(path);
  stage.classList.add("complete");
  arpeggio([0, 2, 4, 5, 7, 5, 4, 7], 150);
  heartRain(40);
  $("#progress").textContent = "Every star is you ♥";
  $("#toLetter").classList.remove("hidden");
}
$("#toLetter").addEventListener("click", () => {
  show("letter");
  startLetter();
});

//Scene 3
let typing = false,
  skip = false,
  typedOnce = false;

async function startLetter() {
  if (typedOnce) return;
  typedOnce = true;
  typing = true;
  skip = false;
  const box = $("#letterText");
  box.innerHTML = "";
  await sleep(900);
  for (let i = 0; i < CONFIG.letter.length; i++) {
    const p = document.createElement("p");
    if (i === 0) p.className = "greeting";
    if (i === CONFIG.letter.length - 1) p.className = "sign";
    box.appendChild(p);
    p.classList.add("caret");
    const text = CONFIG.letter[i];
    for (let c = 0; c < text.length; c++) {
      if (skip) {
        p.textContent = text;
        break;
      }
      p.textContent = text.slice(0, c + 1);
      await sleep(/[.,!?]/.test(text[c]) ? 230 : 28);
    }
    p.classList.remove("caret");
    if (!skip) await sleep(400);
  }
  const sign = document.createElement("p");
  sign.className = "sign";
  sign.textContent = CONFIG.from;
  box.appendChild(sign);
  typing = false;
  $("#skipType").classList.add("hidden");
  $("#together").classList.remove("hidden");
  $("#toAsk").classList.remove("hidden");
  startCounter();
  chime(SCALE[4], 0.1);
}
$("#skipType").addEventListener("click", () => {
  skip = true;
});

function startCounter() {
  const start = new Date(CONFIG.startDate).getTime();
  const el = $("#counter");
  const tick = () => {
    let diff = Math.max(0, Date.now() - start);
    const d = Math.floor(diff / 864e5);
    diff -= d * 864e5;
    const h = Math.floor(diff / 36e5);
    diff -= h * 36e5;
    const m = Math.floor(diff / 6e4);
    diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    el.innerHTML = [
      [d, "days"],
      [h, "hours"],
      [m, "minutes"],
      [s, "seconds"],
    ]
      .map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`)
      .join("");
  };
  tick();
  setInterval(tick, 1000);
}
$("#toAsk").addEventListener("click", () => {
  show("ask");
  arpeggio([4, 2, 0], 200);
});

// Scene 4
const noBtn = $("#noBtn"),
  yesBtn = $("#yesBtn");
let noTries = 0;
const NO_TEXTS = [
  "No",
  "Are you sure?",
  "Really? 🥺",
  "Think again…",
  "Nope 💔",
  "Try the other one ♥",
  "Pretty please?",
];

function dodge(e) {
  if (e) e.preventDefault();
  noTries++;
  noBtn.textContent = NO_TEXTS[Math.min(noTries, NO_TEXTS.length - 1)];
  noBtn.classList.add("run");
  const bw = noBtn.offsetWidth,
    bh = noBtn.offsetHeight;
  noBtn.style.left = rand(10, Math.max(20, W - bw - 10)) + "px";
  noBtn.style.top = rand(70, Math.max(100, H - bh - 10)) + "px";
  yesBtn.style.transform = `scale(${Math.min(1 + noTries * 0.12, 1.9)})`;
  chime(SCALE[(noTries * 2) % 8] * 0.5, 0.07, 0.6);
}
noBtn.addEventListener("pointerenter", dodge);
noBtn.addEventListener("pointerdown", dodge);
noBtn.addEventListener("click", dodge);

yesBtn.addEventListener("click", async (e) => {
  audio();
  noBtn.classList.add("hidden");
  $("#question").classList.add("hidden");
  const r = yesBtn.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 140);
  arpeggio([0, 2, 4, 7, 9, 7, 4, 2, 4, 7, 9, 11], 130);
  await sleep(500);
  burst(W * 0.25, H * 0.5, 80);
  burst(W * 0.75, H * 0.5, 80);
  heartRain(90);
  formText(`I love you, ${CONFIG.name}`);
  $("#final").classList.remove("hidden");
});

$("#replay").addEventListener("click", () => location.reload());
