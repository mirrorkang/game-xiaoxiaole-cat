/* =========================================================
   猫猫拉面屋 · 第一关
   纯前端 / 无框架
   ========================================================= */
(() => {
  'use strict';

  const ROWS = 8;
  const COLS = 8;
  const MOVES = 18;
  const GAUGE_MAX = 20;
  const ORDER = { noodle: 10, egg: 6, chashu: 4, nori: 6 };
  const REQUIRED_TOTAL = Object.values(ORDER).reduce((n, v) => n + v, 0);
  const ORDER_TYPES = Object.keys(ORDER);
  const TYPES = ['noodle', 'egg', 'chashu', 'nori', 'scallion'];

  const TYPE_NAMES = { noodle: '面条', egg: '鸡蛋', chashu: '叉烧', nori: '海苔', scallion: '葱花', naruto: '鱼板' };
  const typeName = (type) => TYPE_NAMES[type] || type;

  const TYPE_COLORS = {
    noodle: ['#ffd15e', '#ffb347', '#fff3c4'],
    egg: ['#fffaf0', '#ffc44d', '#ff9d2e'],
    chashu: ['#ffc2bd', '#f07a7a', '#d9534f'],
    nori: ['#4d8a70', '#2e6351', '#b6d8c4'],
    scallion: ['#c4ef9d', '#7fc95a', '#5fae4e']
  };

  /* ---------------- ingredient art ---------------- */
  const ICONS = {
    noodle: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M7 15 Q13 8 19 15 T31 15 T43 15" stroke="#b96b1e" stroke-width="5" stroke-linecap="round"/>
      <path d="M7 24 Q13 17 19 24 T31 24 T43 24" stroke="#cf7d27" stroke-width="5" stroke-linecap="round"/>
      <path d="M7 33 Q13 26 19 33 T31 33 T43 33" stroke="#b96b1e" stroke-width="5" stroke-linecap="round"/>
      <path d="M11 10 Q18 6 25 10" stroke="#fff3c4" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>
      <rect x="8" y="18" width="9" height="17" rx="4" fill="#2f5d50" opacity=".9"/>
    </svg>`,
    egg: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <ellipse cx="24" cy="25" rx="17" ry="14.5" fill="#fffaf0" stroke="#d9b98b" stroke-width="2.5"/>
      <circle cx="25" cy="25" r="9" fill="#ffae2b" stroke="#e08d1c" stroke-width="2"/>
      <ellipse cx="21" cy="21.5" rx="3.4" ry="2" fill="#ffe08a" opacity=".9" transform="rotate(-24 21 21.5)"/>
      <path d="M10 20 Q13 13 21 12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
    </svg>`,
    chashu: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="17.5" fill="#f7a29c" stroke="#c95f5a" stroke-width="2.5"/>
      <circle cx="24" cy="24" r="12.5" fill="#ffd0c6" stroke="#d47a73" stroke-width="2"/>
      <path d="M24 13 C33 13 36 21 31 27 C26 33 17 30 16 23 C15 17 19 13 24 13Z" fill="none" stroke="#c95f5a" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M14 15 Q20 11 26 13" stroke="#fff1e4" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
    </svg>`,
    nori: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="9" y="7" width="30" height="34" rx="5" fill="#2e5e4e" stroke="#183e35" stroke-width="2.5"/>
      <path d="M14 14 H34 M14 21 H34 M14 28 H34 M14 35 H34" stroke="#5f977f" stroke-width="2.2" opacity=".55"/>
      <path d="M12 10 L21 10" stroke="#b6d8c4" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>
    </svg>`,
    scallion: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <g stroke="#5fae4e" stroke-width="5.5" stroke-linecap="round">
        <circle cx="16" cy="16" r="6"/><circle cx="32" cy="14" r="5"/>
        <circle cx="23" cy="30" r="7"/><circle cx="36" cy="31" r="4"/>
      </g>
      <g fill="#d8f5c5" opacity=".9"><circle cx="14" cy="14" r="2"/><circle cx="30" cy="12" r="1.6"/><circle cx="21" cy="28" r="2.2"/></g>
    </svg>`,
    cleaver: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M7 20 L32 14 L35 28 L12 34 Z" fill="#e8eef4" stroke="#7a8794" stroke-width="2.4" stroke-linejoin="round"/>
      <rect x="31" y="18" width="14" height="8" rx="4" fill="#8b5a3b" stroke="#4a2a18" stroke-width="2" transform="rotate(-11 38 22)"/>
      <path d="M12 23 L25 19" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>
    </svg>`,
    firecracker: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M25 4c3 10 13 12 11 24-1 8-7 14-15 14S7 36 7 28c0-9 8-10 10-18 2 5 6 6 8-6Z" fill="#ffc44d" stroke="#8f2a1b" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M23 23c2 5 7 6 6 12-1 4-4 6-8 6-4 0-7-3-7-7 0-4 4-5 5-9 1 2 3 3 4-2Z" fill="#fff2cf"/>
    </svg>`,
    rainbow: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="17" fill="#fff7e7" stroke="#d8b789" stroke-width="2"/>
      <path d="M24 8c9 0 16 7 16 16S33 40 24 40 8 33 8 24c0-6 3-11 8-14" fill="none" stroke="#e85d3f" stroke-width="5" stroke-linecap="round"/>
      <path d="M24 14c6 0 10 4 10 10s-4 10-10 10-10-4-10-10c0-4 2-7 5-9" fill="none" stroke="#ffc44d" stroke-width="5" stroke-linecap="round"/>
      <circle cx="24" cy="24" r="4" fill="#e85d3f"/>
    </svg>`,
    paw: `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><ellipse cx="16" cy="21" rx="7" ry="6"/><circle cx="7.5" cy="14" r="3"/><circle cx="13" cy="8.5" r="3.2"/><circle cx="20" cy="8.5" r="3.2"/><circle cx="25.5" cy="14" r="3"/></svg>`,
    star: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.2 20.1 12l10.4 1.1-7.9 7 2.4 10.2L16 24.9 6.9 30.3l2.4-10.2-7.9-7L11.9 12 16 2.2Z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`
  };

  const SPECIAL_ICONS = {
    cleaver: ICONS.cleaver,
    firecracker: ICONS.firecracker,
    rainbow: ICONS.rainbow
  };

  /* ---------------- DOM ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const dom = {
    titleScreen: $('#titleScreen'),
    gameScreen: $('#gameScreen'),
    startBtn: $('#startBtn'),
    titleSoundBtn: $('#titleSoundBtn'),
    bestRecord: $('#bestRecord'),
    backBtn: $('#backBtn'),
    soundBtn: $('#soundBtn'),
    pauseBtn: $('#pauseBtn'),
    movesCard: $('.moves-card'),
    movesCount: $('#movesCount'),
    orderCard: $('#orderCard'),
    orderItems: $$('.order-item'),
    orderCount: $('#orderCount'),
    orderBar: $('#orderBar'),
    orderStamp: $('#orderStamp'),
    praiseBubble: $('#praiseBubble'),
    comboPulse: $('#comboPulse'),
    bowlSplash: $('#bowlSplash'),
    board: $('#board'),
    boardWrap: $('.board-wrap'),
    boardHint: $('#boardHint'),
    bowl: $('#bowl'),
    bowlCount: $('#bowlCount'),
    broth: $('#broth'),
    chef: $('#chef'),
    chefWrap: $('.chef-wrap'),
    gaugeBlock: $('.gauge-block'),
    gaugeFill: $('#gaugeFill'),
    gaugeNum: $('#gaugeNum'),
    ultimateBtn: $('#ultimateBtn'),
    hintBtn: $('#hintBtn'),
    tutorialTip: $('#tutorialTip'),
    toast: $('#toast'),
    comboBadge: $('#comboBadge'),
    comboBanner: $('#comboBanner'),
    comboBannerNum: $('#comboBannerNum'),
    comboBannerTitle: $('#comboBannerTitle'),
    comboBannerSub: $('#comboBannerSub'),
    comboBannerPips: $('#comboBannerPips'),
    successBanner: $('#successBanner'),
    streakChip: $('#streakChip'),
    streakCount: $('#streakCount'),
    ultimateBanner: $('#ultimateBanner'),
    flash: $('#flash'),
    fx: $('#fx'),
    serveOverlay: $('#serveOverlay'),
    serveStars: $('#serveStars'),
    winOverlay: $('#winOverlay'),
    winStars: $('#winStars'),
    winStats: $('#winStats'),
    playAgainBtn: $('#playAgainBtn'),
    nextLevelBtn: $('#nextLevelBtn'),
    winTitleBtn: $('#winTitleBtn'),
    failOverlay: $('#failOverlay'),
    rescueBtn: $('#rescueBtn'),
    retryBtn: $('#retryBtn'),
    failTitleBtn: $('#failTitleBtn'),
    failHint: $('#failHint'),
    pauseOverlay: $('#pauseOverlay'),
    resumeBtn: $('#resumeBtn'),
    pauseRestartBtn: $('#pauseRestartBtn'),
    pauseSoundBtn: $('#pauseSoundBtn'),
    pauseTitleBtn: $('#pauseTitleBtn')
  };

  /* ---------------- utilities ---------------- */
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const keyOf = (r, c) => `${r},${c}`;
  const parseKey = (k) => k.split(',').map(Number);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (min, max) => min + Math.random() * (max - min);
  const centerOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* =========================================================
     SOUND
     ========================================================= */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.musicGain = null;
      this.noiseBuffer = null;
      this.ambientBuffer = null;
      this.enabled = true;
      this.musicOn = false;
      this.musicTimer = null;
      this.ambientGain = null;
      this.ambientSources = [];
      this.ambientTimer = null;
      this.energy = 0;
      this.lastPraise = 0;
      this.lastSplash = 0;
      this.progression = [
        [220, 261.63, 329.63, 392.00],
        [174.61, 220, 261.63, 329.63],
        [196, 246.94, 293.66, 349.23],
        [164.81, 196, 246.94, 293.66]
      ];
      this.barIndex = 0;
    }

    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.enabled ? 0.55 : 0;
        this.master.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.9;
        this.musicGain.connect(this.master);
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.value = 0.8;
        this.ambientGain.connect(this.master);
        const len = Math.floor(this.ctx.sampleRate * 0.7);
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        this.noiseBuffer = buf;
        const ambLen = Math.floor(this.ctx.sampleRate * 2.6);
        const ambBuf = this.ctx.createBuffer(1, ambLen, this.ctx.sampleRate);
        const ambData = ambBuf.getChannelData(0);
        for (let i = 0; i < ambLen; i++) ambData[i] = Math.random() * 2 - 1;
        this.ambientBuffer = ambBuf;
      } catch (e) {
        this.ctx = null;
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    }

    setEnabled(v) {
      this.enabled = !!v;
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(this.enabled ? 0.55 : 0, this.ctx.currentTime, 0.03);
      }
      if (!this.enabled) this.stopMusic();
    }

    tone(freq, dur, opts = {}) {
      if (!this.ctx || !this.enabled) return;
      const {
        type = 'sine', vol = 0.08, delay = 0, slide = null,
        attack = 0.006, release = 0.06, dest = null
      } = opts;
      const t = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(20, freq), t);
      if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g);
      g.connect(dest || this.master);
      osc.start(t);
      osc.stop(t + dur + release + 0.02);
    }

    noise(dur, opts = {}) {
      if (!this.ctx || !this.enabled || !this.noiseBuffer) return;
      const { vol = 0.03, delay = 0, freq = 1200, q = 1, type = 'bandpass', dest = null } = opts;
      const t = this.ctx.currentTime + delay;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const f = this.ctx.createBiquadFilter();
      f.type = type;
      f.frequency.setValueAtTime(freq, t);
      f.Q.value = q;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(dest || this.master);
      src.start(t);
      src.stop(t + dur + 0.03);
    }

    click() {
      this.tone(520, 0.055, { type: 'triangle', vol: 0.035, slide: 660 });
    }

    invalid() {
      this.tone(155, 0.12, { type: 'sine', vol: 0.055, slide: 95 });
      this.noise(0.1, { vol: 0.018, freq: 320, type: 'lowpass' });
    }

    match(combo = 1) {
      const base = 430 * Math.pow(2, Math.min(combo, 7) / 12);
      this.tone(base, 0.07, { type: 'triangle', vol: 0.055, slide: base * 1.12 });
      this.tone(base * 1.5, 0.1, { type: 'sine', vol: 0.035, delay: 0.035 });
      this.noise(0.045, { vol: 0.012, freq: 1800, q: 1.2 });
    }

    special(kind) {
      if (kind === 'cleaver') {
        this.noise(0.16, { vol: 0.055, freq: 2600, q: 2.5 });
        this.tone(880, 0.12, { type: 'triangle', vol: 0.06, slide: 1320, delay: 0.02 });
      } else if (kind === 'firecracker') {
        this.noise(0.22, { vol: 0.09, freq: 320, type: 'lowpass' });
        this.tone(150, 0.28, { type: 'sawtooth', vol: 0.045, slide: 70 });
      } else if (kind === 'rainbow') {
        [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => this.tone(n, 0.18, { type: 'sine', vol: 0.04, delay: i * 0.055 }));
      }
    }

    ultimate() {
      this.noise(0.42, { vol: 0.13, freq: 420, type: 'lowpass' });
      this.tone(82, 0.5, { type: 'sawtooth', vol: 0.07, slide: 50 });
      [440, 554, 659, 880, 1108].forEach((n, i) => this.tone(n, 0.26, { type: 'triangle', vol: 0.045, delay: 0.12 + i * 0.06 }));
      this.tone(1320, 0.3, { type: 'sine', vol: 0.03, delay: 0.42 });
    }

    gaugeFull() {
      [660, 880, 1320].forEach((n, i) => this.tone(n, 0.2, { type: 'sine', vol: 0.04, delay: i * 0.08 }));
    }

    serve() {
      this.noise(0.22, { vol: 0.03, freq: 900, q: 0.8 });
      this.tone(880, 0.25, { type: 'sine', vol: 0.05 });
      this.tone(1320, 0.35, { type: 'sine', vol: 0.04, delay: 0.15 });
      this.tone(1760, 0.45, { type: 'sine', vol: 0.025, delay: 0.32 });
      this.tone(700, 0.18, { type: 'triangle', vol: 0.03, delay: 0.55, slide: 980 });
    }

    win() {
      [523, 659, 784, 1046].forEach((n, i) => this.tone(n, 0.32, { type: 'triangle', vol: 0.045, delay: i * 0.13 }));
    }

    fail() {
      this.tone(330, 0.3, { type: 'sine', vol: 0.045, slide: 220 });
      this.tone(220, 0.45, { type: 'sine', vol: 0.04, delay: 0.2, slide: 150 });
    }

    sneeze() {
      this.noise(0.14, { vol: 0.04, freq: 900, q: 1.4 });
      this.tone(320, 0.12, { type: 'triangle', vol: 0.03, slide: 180, delay: 0.04 });
    }

    swapSuccess() {
      this.noise(0.075, { vol: 0.018, freq: 1500, q: 1.6 });
      this.tone(620, 0.075, { type: 'triangle', vol: 0.035, slide: 840 });
      this.tone(980, 0.13, { type: 'sine', vol: 0.025, delay: 0.035 });
    }

    chain(combo) {
      const base = 660 * Math.pow(2, Math.min(combo, 6) / 12);
      this.tone(base, 0.08, { type: 'sine', vol: 0.024, delay: 0.015 });
      this.tone(base * 1.5, 0.1, { type: 'triangle', vol: 0.015, delay: 0.055 });
    }

    comboMilestone(combo) {
      const root = combo >= 5 ? 392 : combo === 4 ? 440 : 523.25;
      [0, 4, 7, 12].forEach((semi, i) => {
        const f = root * Math.pow(2, semi / 12);
        this.tone(f, 0.2, { type: 'triangle', vol: 0.03, delay: i * 0.055 });
        this.tone(f * 2, 0.16, { type: 'sine', vol: 0.012, delay: i * 0.055 + 0.025 });
      });
      this.noise(0.18, { vol: 0.025, freq: combo >= 4 ? 2600 : 2200, q: 1.1, delay: 0.04 });
    }

    tripleSuccess() {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((n, i) => {
        this.tone(n, 0.26, { type: 'triangle', vol: 0.04, delay: i * 0.065 });
        this.tone(n * 2, 0.18, { type: 'sine', vol: 0.012, delay: i * 0.065 + 0.02 });
      });
      this.noise(0.22, { vol: 0.028, freq: 3200, q: 0.9, delay: 0.08 });
      this.tone(130.8, 0.4, { type: 'sine', vol: 0.025, slide: 196, delay: 0.02 });
    }

    orderDone(index = 0) {
      const base = 740 + index * 70;
      this.tone(base, 0.1, { type: 'sine', vol: 0.03 });
      this.tone(base * 1.5, 0.16, { type: 'triangle', vol: 0.022, delay: 0.07 });
      this.noise(0.035, { vol: 0.008, freq: 3000, q: 1.4 });
    }

    orderAllDone() {
      [660, 880, 1108, 1320].forEach((n, i) => this.tone(n, 0.3, { type: 'triangle', vol: 0.04, delay: i * 0.09 }));
      this.noise(0.16, { vol: 0.015, freq: 4200, q: 1.2, delay: 0.1 });
    }

    star(index = 0) {
      const notes = [880, 1108, 1320];
      this.tone(notes[index] || 1320, 0.22, { type: 'sine', vol: 0.035 });
      this.tone((notes[index] || 1320) * 1.5, 0.28, { type: 'sine', vol: 0.02, delay: 0.06 });
    }

    splash() {
      const now = Date.now();
      if (now - this.lastSplash < 95) return;
      this.lastSplash = now;
      this.noise(0.07, { vol: 0.026, freq: 640, type: 'lowpass' });
      this.tone(420, 0.07, { type: 'sine', vol: 0.022, slide: 280 });
    }

    praise() {
      const now = Date.now();
      if (now - this.lastPraise < 760) return;
      this.lastPraise = now;
      this.tone(650, 0.1, { type: 'triangle', vol: 0.028, slide: 900 });
      this.tone(900, 0.14, { type: 'triangle', vol: 0.018, slide: 720, delay: 0.09 });
    }

    rescue() {
      [523, 659, 784].forEach((n, i) => this.tone(n, 0.18, { type: 'triangle', vol: 0.03, delay: i * 0.07 }));
      this.tone(1046, 0.28, { type: 'sine', vol: 0.022, delay: 0.23 });
    }

    setEnergy(v) {
      this.energy = Math.max(0, Math.min(1, v));
    }

    startAmbience() {
      this.init();
      if (!this.ctx || !this.enabled || !this.noiseBuffer || this.ambientSources.length) return;
      const src = this.ctx.createBufferSource();
      src.buffer = this.ambientBuffer || this.noiseBuffer;
      src.loop = true;
      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 380;
      const g = this.ctx.createGain();
      g.gain.value = 0.011;
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.12;
      lfoGain.gain.value = 0.003;
      lfo.connect(lfoGain); lfoGain.connect(g.gain);
      src.connect(f); f.connect(g); g.connect(this.ambientGain);
      src.start(); lfo.start();
      this.ambientSources.push(src, lfo);
      this.ambientTimer = setInterval(() => {
        if (this.musicOn && this.enabled) this.ambientBell();
      }, 21000);
    }

    stopAmbience() {
      if (this.ambientTimer) {
        clearInterval(this.ambientTimer);
        this.ambientTimer = null;
      }
      this.ambientSources.forEach(src => {
        try { src.stop(); } catch (e) {}
      });
      this.ambientSources = [];
    }

    ambientBell() {
      this.tone(1046.5, 0.45, { type: 'sine', vol: 0.007, attack: 0.02, release: 0.4 });
      this.tone(1318.5, 0.5, { type: 'sine', vol: 0.0045, delay: 0.17, release: 0.45 });
      this.noise(0.25, { vol: 0.004, freq: 4000, q: 1.1, delay: 0.03 });
    }

    startMusic() {
      this.init();
      if (!this.ctx || !this.enabled || this.musicOn) return;
      this.musicOn = true;
      this.startAmbience();
      this.playBar();
      this.musicTimer = setInterval(() => this.playBar(), 3400);
    }

    stopMusic() {
      this.musicOn = false;
      this.stopAmbience();
      if (this.musicTimer) {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
    }

    playBar() {
      if (!this.ctx || !this.enabled || !this.musicOn) return;
      const chord = this.progression[this.barIndex % this.progression.length];
      const energy = this.energy;
      this.barIndex++;

      // warm pad + walking bass
      chord.forEach((freq, i) => {
        this.tone(freq, 3.15, {
          type: i === 0 ? 'sine' : 'triangle',
          vol: i === 0 ? 0.021 : 0.012,
          delay: i * 0.035,
          attack: 0.4,
          release: 0.7,
          dest: this.musicGain
        });
      });
      this.tone(chord[0] / 2, 1.55, { type: 'sine', vol: 0.026, attack: 0.15, release: 0.4, dest: this.musicGain });
      this.tone(chord[2] / 2, 1.35, { type: 'triangle', vol: 0.012, delay: 1.72, attack: 0.1, release: 0.35, dest: this.musicGain });

      // soft kick + brushed shaker
      [0, 1.7].forEach((beat, i) => {
        this.tone(112, 0.2, { type: 'sine', vol: i === 0 ? 0.018 : 0.013, slide: 52, delay: beat, attack: 0.004, release: 0.1, dest: this.musicGain });
      });
      for (let i = 0; i < 8; i++) {
        this.noise(0.032, {
          vol: i % 2 === 0 ? 0.0055 : 0.0032,
          freq: 5600, q: 1.6, delay: i * 0.425,
          dest: this.musicGain
        });
      }

      // sparse plucked melody
      const melody = [chord[2] * 2, chord[3] * 2, chord[1] * 2, chord[2] * 2];
      [0.55, 1.1, 2.1, 2.55].forEach((delay, i) => {
        this.tone(melody[i], 0.25, { type: 'triangle', vol: 0.011, delay, dest: this.musicGain });
      });

      // cheap dynamic layers: more energy = brighter and busier
      if (energy > 0.35) {
        [0.85, 1.7, 2.55].forEach((delay, i) => {
          this.tone(chord[(i + 2) % chord.length] * 2, 0.18, {
            type: 'sine', vol: 0.007 + energy * 0.006, delay, dest: this.musicGain
          });
        });
      }
      if (energy > 0.7) {
        [0, 0.85, 1.7, 2.55].forEach((beat, i) => {
          this.noise(0.05, { vol: 0.0035 + energy * 0.003, freq: 7800, q: 2, delay: beat + 0.21, dest: this.musicGain });
        });
        this.tone(chord[2] * 4, 0.22, { type: 'triangle', vol: 0.006, delay: 2.9, dest: this.musicGain });
      }
    }
  }

  /* =========================================================
     PARTICLES
     ========================================================= */
  class FXSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.rings = [];
      this.w = 0;
      this.h = 0;
      this.dpr = 1;
      this.running = false;
      this.last = 0;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.canvas.width = Math.floor(this.w * this.dpr);
      this.canvas.height = Math.floor(this.h * this.dpr);
      this.canvas.style.width = this.w + 'px';
      this.canvas.style.height = this.h + 'px';
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    add(p) {
      if (this.particles.length > 650) return;
      this.particles.push(p);
      this.start();
    }

    burst(x, y, colors, count, opts = {}) {
      const {
        speedMin = 60, speedMax = 260, gravity = 420, sizeMin = 2, sizeMax = 6,
        lifeMin = 0.35, lifeMax = 0.8, shape = 'circle', angle = null, spread = Math.PI * 2,
        additive = false
      } = opts;
      for (let i = 0; i < count; i++) {
        const a = angle == null ? Math.random() * spread : angle + (Math.random() - 0.5) * spread;
        const sp = rand(speedMin, speedMax);
        this.add({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          gravity, size: rand(sizeMin, sizeMax), color: pick(colors),
          life: rand(lifeMin, lifeMax), maxLife: 1, shape,
          rot: Math.random() * Math.PI, vr: rand(-9, 9), additive
        });
        const p = this.particles[this.particles.length - 1];
        p.maxLife = p.life;
      }
    }

    ingredientBurst(x, y, type) {
      const colors = TYPE_COLORS[type] || ['#ffd166', '#fff2cf'];
      this.burst(x, y, colors, 5, {
        speedMin: 50, speedMax: 190, gravity: 460, sizeMin: 2, sizeMax: 5.5,
        lifeMin: 0.32, lifeMax: 0.7, shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
      if (Math.random() > 0.55) {
        this.burst(x, y, ['#fff2cf', '#ffd166'], 2, {
          speedMin: 20, speedMax: 80, gravity: -40, sizeMin: 2, sizeMax: 4,
          lifeMin: 0.5, lifeMax: 0.9, shape: 'circle', additive: true
        });
      }
    }

    fireBurst(x, y, count = 70) {
      this.burst(x, y, ['#ffcf6b', '#ff9b3d', '#e85d3f', '#fff2cf'], count, {
        speedMin: 90, speedMax: 420, gravity: -170, sizeMin: 2, sizeMax: 8,
        lifeMin: 0.42, lifeMax: 1.05, shape: 'circle', angle: -Math.PI / 2, spread: Math.PI * 1.5,
        additive: true
      });
    }

    sparkle(x, y, count = 12) {
      this.burst(x, y, ['#fff2cf', '#ffd166', '#ffc44d'], count, {
        speedMin: 15, speedMax: 120, gravity: -30, sizeMin: 1.5, sizeMax: 4.5,
        lifeMin: 0.45, lifeMax: 1.1, additive: true
      });
    }

    confetti() {
      const colors = ['#ffc44d', '#e85d3f', '#7fc95a', '#fff2cf', '#f08a3c', '#9fd6c3'];
      for (let i = 0; i < 110; i++) {
        this.add({
          x: rand(0, this.w), y: rand(-60, -5), vx: rand(-60, 60), vy: rand(60, 210),
          gravity: 90, size: rand(3, 7), color: pick(colors),
          life: rand(2.2, 3.6), maxLife: 3.6, shape: 'rect',
          rot: Math.random() * Math.PI, vr: rand(-8, 8), additive: false
        });
      }
      this.start();
    }

    ring(x, y, color = '#ffd166', max = 90) {
      this.rings.push({ x, y, color, max, age: 0, life: 0.62 });
      this.start();
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.loop.bind(this));
    }

    loop(now) {
      const dt = Math.min(0.05, (now - this.last) / 1000 || 0.016);
      this.last = now;
      this.ctx.clearRect(0, 0, this.w, this.h);
      for (let i = this.rings.length - 1; i >= 0; i--) {
        const r = this.rings[i];
        r.age += dt;
        if (r.age >= r.life) { this.rings.splice(i, 1); continue; }
        const t = r.age / r.life;
        const radius = r.max * (0.35 + t * 0.85);
        this.ctx.save();
        this.ctx.globalAlpha = (1 - t) * 0.75;
        this.ctx.strokeStyle = r.color;
        this.ctx.lineWidth = Math.max(1.5, 4 * (1 - t));
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
        p.rot += p.vr * dt;
        const alpha = clamp(p.life / p.maxLife, 0, 1);
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        if (p.additive) this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rot);
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }
      if (this.particles.length > 0 || this.rings.length > 0) {
        this.raf = requestAnimationFrame(this.loop.bind(this));
      } else {
        this.running = false;
      }
    }
  }

  /* =========================================================
     STATE
     ========================================================= */
  const state = {
    running: false, paused: false, busy: false, levelComplete: false, gameOver: false, serving: false,
    board: [], tileById: new Map(), nextId: 1, slots: [],
    moves: MOVES,
    collected: { noodle: 0, egg: 0, chashu: 0, nori: 0 },
    totalCollected: 0,
    gauge: 0, ultimateReady: false, ultimateUsed: false,
    combo: 0, maxCombo: 0, successStreak: 0, maxSuccessStreak: 0, tripleCount: 0, rescueUsed: false,
    selected: null, levelId: 0, hintTiles: [], hintTimer: null, idleTimer: null,
    cell: 0, gap: 0, stars: 0, serveTimer: null, specialCreated: 0, specialActivated: 0,
    pointer: null,
    flags: { firstSpecial: false, firstSwap: false, gaugeToast: false, tutorialShown: false },
    suppressHint: false
  };

  let sound = null;
  let fx = null;
  let toastTimer = null;
  let tutorialTimer = null;
  let comboTimer = null;
  let shakeTimer = null;
  let praiseTimer = null;
  let comboPulseTimer = null;
  let comboBannerTimer = null;
  let successBannerTimer = null;
  let streakResetTimer = null;
  let streakCelebrate = false;
  let lastPraiseAt = 0;
  let lastBowlSplash = 0;
  let orderAnnounced = false;
  let flashTimer = null;
  let layoutRaf = null;
  let hasPlayed = false;

  /* =========================================================
     BOARD / TILES
     ========================================================= */
  function createTile(type, r, c) {
    const tile = {
      id: state.nextId++,
      type,
      special: null,
      orientation: null,
      r,
      c,
      el: null,
      inner: null
    };
    state.tileById.set(tile.id, tile);
    return tile;
  }

  function tileAt(r, c) {
    return state.board[r] ? state.board[r][c] : null;
  }

  function makeBoard() {
    const grid = generateGrid(true);
    state.board = grid.map((row, r) => row.map((type, c) => createTile(type, r, c)));
    state.tileById.clear();
    state.board.forEach(row => row.forEach(t => state.tileById.set(t.id, t)));
  }

  function createTileEl(tile) {
    const el = document.createElement('div');
    el.className = 'tile type-' + tile.type;
    el.dataset.id = tile.id;
    el.dataset.type = tile.type;
    el.style.width = state.cell ? state.cell + 'px' : '0px';
    el.style.height = state.cell ? state.cell + 'px' : '0px';
    const inner = document.createElement('div');
    inner.className = 'tile-inner';
    el.appendChild(inner);
    dom.board.appendChild(el);
    tile.el = el;
    tile.inner = inner;
    updateTileVisual(tile);
    if (state.cell) setTileSize(tile);
    return tile;
  }

  function setTileSize(tile) {
    if (!tile || !tile.el) return;
    tile.el.style.width = state.cell + 'px';
    tile.el.style.height = state.cell + 'px';
    if (tile.inner) {
      const radius = Math.max(7, state.cell * 0.28);
      tile.inner.style.borderRadius = radius + 'px';
    }
  }

  function updateTileVisual(tile) {
    if (!tile || !tile.el) return;
    tile.el.className = 'tile type-' + tile.type + (tile.special ? ' is-special' : '');
    tile.el.dataset.type = tile.type;
    if (!tile.inner) tile.inner = tile.el.querySelector('.tile-inner');
    tile.inner.className = 'tile-inner';
    const badge = tile.special
      ? `<span class="special-badge">${SPECIAL_ICONS[tile.special] || ICONS.star}</span>`
      : '';
    tile.inner.innerHTML = ICONS[tile.type] + badge;
    const radius = Math.max(7, state.cell * 0.28);
    tile.inner.style.borderRadius = radius + 'px';
  }

  function positionTile(tile) {
    if (!tile || !tile.el) return;
    const step = state.cell + state.gap;
    tile.el.style.transform = `translate(${tile.c * step}px, ${tile.r * step}px)`;
  }

  function positionSlot(slot, r, c) {
    const step = state.cell + state.gap;
    slot.style.width = state.cell + 'px';
    slot.style.height = state.cell + 'px';
    slot.style.transform = `translate(${c * step}px, ${r * step}px)`;
    slot.style.borderRadius = Math.max(7, state.cell * 0.28) + 'px';
  }

  function buildBoardDOM() {
    dom.board.innerHTML = '';
    state.slots = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        dom.board.appendChild(slot);
        state.slots.push({ el: slot, r, c });
      }
    }
    state.board.forEach(row => row.forEach(tile => {
      if (tile) createTileEl(tile);
    }));
    layoutBoard();
  }

  function layoutBoard() {
    if (!dom.board) return;
    const w = dom.board.clientWidth;
    if (!w || w < 40) return;
    const gap = Math.max(3, w * 0.012);
    const cell = (w - gap * (COLS - 1)) / COLS;
    state.cell = cell;
    state.gap = gap;
    dom.board.classList.add('no-anim');
    state.slots.forEach(({ el, r, c }) => positionSlot(el, r, c));
    state.tileById.forEach(tile => {
      setTileSize(tile);
      positionTile(tile);
    });
    requestAnimationFrame(() => dom.board.classList.remove('no-anim'));
  }

  function scheduleLayout() {
    if (layoutRaf) cancelAnimationFrame(layoutRaf);
    layoutRaf = requestAnimationFrame(() => {
      layoutRaf = null;
      layoutBoard();
    });
  }

  /* =========================================================
     GRID HELPERS / MATCHING
     ========================================================= */
  function generateGrid(preferNoodle = true) {
    let fallback = null;
    for (let attempt = 0; attempt < 260; attempt++) {
      const g = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const banned = new Set();
          if (c >= 2 && g[r][c - 1] === g[r][c - 2]) banned.add(g[r][c - 1]);
          if (r >= 2 && g[r - 1][c] === g[r - 2][c]) banned.add(g[r - 1][c]);
          const choices = TYPES.filter(t => !banned.has(t));
          g[r][c] = pick(choices.length ? choices : TYPES);
        }
      }
      const moves = validMovesOnGrid(g);
      if (!moves.length) continue;
      if (!preferNoodle) return g;
      if (moves.some(m => m.runs.some(run => run.type === 'noodle'))) return g;
      fallback = fallback || g;
    }
    if (fallback) return fallback;
    return generateGrid(false);
  }

  function gridFromBoard() {
    return state.board.map(row => row.map(t => t ? t.type : null));
  }

  function findRunsOnGrid(grid) {
    const runs = [];
    for (let r = 0; r < ROWS; r++) {
      let c = 0;
      while (c < COLS) {
        const type = grid[r][c];
        if (!type) { c++; continue; }
        let end = c + 1;
        while (end < COLS && grid[r][end] === type) end++;
        const len = end - c;
        if (len >= 3) {
          const cells = [];
          for (let x = c; x < end; x++) cells.push([r, x]);
          runs.push({ dir: 'h', type, cells });
        }
        c = end;
      }
    }
    for (let c = 0; c < COLS; c++) {
      let r = 0;
      while (r < ROWS) {
        const type = grid[r][c];
        if (!type) { r++; continue; }
        let end = r + 1;
        while (end < ROWS && grid[end][c] === type) end++;
        const len = end - r;
        if (len >= 3) {
          const cells = [];
          for (let y = r; y < end; y++) cells.push([y, c]);
          runs.push({ dir: 'v', type, cells });
        }
        r = end;
      }
    }
    return runs;
  }

  function findRunsOnBoard() {
    return findRunsOnGrid(gridFromBoard());
  }

  function matchedKeys(runs) {
    const set = new Set();
    runs.forEach(run => run.cells.forEach(([r, c]) => set.add(keyOf(r, c))));
    return set;
  }

  function simulateSwap(grid, r1, c1, r2, c2) {
    const t = grid[r1][c1];
    grid[r1][c1] = grid[r2][c2];
    grid[r2][c2] = t;
  }

  function validMovesOnGrid(grid) {
    const moves = [];
    const g = grid.map(row => row.slice());
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
          const r2 = r + dr, c2 = c + dc;
          if (r2 >= ROWS || c2 >= COLS) continue;
          simulateSwap(g, r, c, r2, c2);
          const runs = findRunsOnGrid(g);
          if (runs.length) moves.push({ a: [r, c], b: [r2, c2], runs });
          simulateSwap(g, r, c, r2, c2);
        }
      }
    }
    return moves;
  }

  function hasValidMove() {
    const moves = validMovesOnGrid(gridFromBoard());
    if (moves.length) return true;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const t = tileAt(r, c);
        if (!t || !t.special) continue;
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
          const t2 = tileAt(r + dr, c + dc);
          if (!t2) continue;
          if (t.special === 'rainbow' || t2.special === 'rainbow') return true;
          if (t.special && t2.special) return true;
        }
      }
    }
    return false;
  }

  function findHint(preferredType = null) {
    const moves = validMovesOnGrid(gridFromBoard());
    let best = null;
    for (const m of moves) {
      const types = new Set(m.runs.map(run => run.type));
      const size = m.runs.reduce((n, run) => n + run.cells.length, 0);
      const matchesPreferred = preferredType ? types.has(preferredType) : true;
      const score = size + (matchesPreferred ? 20 : 0);
      if (!best || score > best.score) best = { ...m, score, types };
    }
    if (!best) {
      // special swap fallback
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const t = tileAt(r, c);
          if (!t || !t.special) continue;
          for (const [dr, dc] of [[0, 1], [1, 0]]) {
            const t2 = tileAt(r + dr, c + dc);
            if (!t2) continue;
            if (t.special === 'rainbow' || t2.special === 'rainbow' || (t.special && t2.special)) {
              return { a: [r, c], b: [t2.r, t2.c] };
            }
          }
        }
      }
      return null;
    }
    return { a: best.a, b: best.b };
  }

  function findSpecialCreations(runs, swapTiles = null) {
    const changed = new Set((swapTiles || []).map(t => keyOf(t.r, t.c)));
    const hAt = new Map();
    const vAt = new Map();
    runs.forEach(run => {
      const map = run.dir === 'h' ? hAt : vAt;
      run.cells.forEach(([r, c]) => map.set(keyOf(r, c), run));
    });
    const candidates = new Map();

    function addCandidate(r, c, data) {
      const k = keyOf(r, c);
      const existing = candidates.get(k);
      if (existing && existing.priority >= data.priority) return;
      candidates.set(k, { ...data, r, c, key: k });
    }

    // T / L intersections
    for (const [k, hRun] of hAt) {
      const vRun = vAt.get(k);
      if (!vRun || hRun.type !== vRun.type) continue;
      if (hRun.cells.length >= 3 && vRun.cells.length >= 3) {
        const [r, c] = parseKey(k);
        addCandidate(r, c, { priority: 3, special: 'firecracker', type: hRun.type });
      }
    }

    function pickCellForRun(run) {
      const cells = run.cells.slice();
      const preferred = cells.filter(([r, c]) => changed.has(keyOf(r, c)));
      const ordered = [...preferred, ...cells];
      for (const [r, c] of ordered) {
        const k = keyOf(r, c);
        if (candidates.has(k)) continue;
        const tile = tileAt(r, c);
        if (tile && tile.special) continue;
        return [r, c];
      }
      return null;
    }

    // 5+ => rainbow
    for (const run of runs) {
      if (run.cells.length >= 5) {
        const cell = pickCellForRun(run);
        if (cell) addCandidate(cell[0], cell[1], { priority: 4, special: 'rainbow', type: run.type });
      }
    }
    // 4 => cleaver
    for (const run of runs) {
      if (run.cells.length === 4) {
        const cell = pickCellForRun(run);
        if (cell) addCandidate(cell[0], cell[1], { priority: 2, special: 'cleaver', type: run.type, orientation: run.dir });
      }
    }

    const sorted = Array.from(candidates.values()).sort((a, b) => b.priority - a.priority);
    const chosen = [];
    for (const cand of sorted) {
      if (chosen.length >= 2) break;
      if (chosen.some(c => c.key === cand.key)) continue;
      const tile = tileAt(cand.r, cand.c);
      if (!tile || tile.special) continue;
      chosen.push(cand);
    }
    return chosen;
  }

  /* =========================================================
     UI
     ========================================================= */
  function initOrderUI() {
    dom.orderItems.forEach(item => {
      const type = item.dataset.type;
      const icon = item.querySelector('.oi-icon');
      if (icon) icon.innerHTML = ICONS[type];
      const b = item.querySelector('b');
      if (b) b.innerHTML = `<i>0</i>/${ORDER[type] || 0}`;
      item.dataset.last = '0';
    });
    const needEl = document.getElementById('orderTotalNeed');
    if (needEl) needEl.textContent = REQUIRED_TOTAL;
    const bowlTotal = document.getElementById('bowlTotal');
    if (bowlTotal) bowlTotal.textContent = REQUIRED_TOTAL;
    $$('.topping').forEach(t => {
      t.innerHTML = ICONS[t.dataset.top] || '';
    });
  }

  function updateOrderUI() {
    let total = 0;
    dom.orderItems.forEach(item => {
      const type = item.dataset.type;
      const need = ORDER[type] || 0;
      const have = state.collected[type] || 0;
      total += have;
      const i = item.querySelector('b i');
      if (i) i.textContent = have;
      const done = have >= need;
      const wasDone = item.dataset.wasDone === '1';
      item.classList.toggle('done', done);
      if (done && !wasDone) {
        item.classList.remove('just-done');
        void item.offsetWidth;
        item.classList.add('just-done');
        setTimeout(() => item.classList.remove('just-done'), 620);
        if (sound) sound.orderDone(ORDER_TYPES.indexOf(type));
        const r = item.getBoundingClientRect();
        floatText('✓ 齐了', r.left + r.width / 2, r.top - 4);
      }
      item.dataset.wasDone = done ? '1' : '0';
      const last = Number(item.dataset.last || 0);
      if (have > last) {
        item.classList.remove('bump');
        void item.offsetWidth;
        item.classList.add('bump');
        setTimeout(() => item.classList.remove('bump'), 320);
      }
      item.dataset.last = String(have);
    });
    state.totalCollected = total;
    if (dom.orderCount) dom.orderCount.textContent = total;
    if (dom.orderBar) dom.orderBar.style.width = Math.min(100, total / REQUIRED_TOTAL * 100) + '%';
    updateBowl();
    if (total >= REQUIRED_TOTAL) announceOrderComplete();
  }

  function updateBowl() {
    const pct = Math.min(1, state.totalCollected / REQUIRED_TOTAL);
    const fill = Math.max(48, 48 + pct * 52);
    dom.bowl.style.setProperty('--fill', fill + '%');
    dom.bowl.classList.toggle('full', pct >= 1);
    if (dom.bowlCount) dom.bowlCount.textContent = state.totalCollected;
    $$('.topping').forEach(t => {
      const type = t.dataset.top;
      t.classList.toggle('show', (state.collected[type] || 0) > 0);
    });
  }

  function updateGaugeUI() {
    const pct = clamp(state.gauge / GAUGE_MAX, 0, 1);
    const ready = state.gauge >= GAUGE_MAX - 0.001;
    const wasReady = state.ultimateReady;
    state.ultimateReady = ready;
    if (dom.gaugeFill) dom.gaugeFill.style.width = (pct * 100) + '%';
    if (dom.gaugeNum) dom.gaugeNum.textContent = Math.round(pct * 100) + '%';
    if (dom.gaugeBlock) dom.gaugeBlock.classList.toggle('full', ready);
    if (dom.ultimateBtn) dom.ultimateBtn.classList.toggle('hidden', !ready || state.levelComplete || state.gameOver);
    if (dom.board) dom.board.classList.toggle('ultimate-ready', ready && !state.levelComplete);
    if (sound) sound.setEnergy(clamp(pct * 0.72 + state.combo * 0.055, 0, 1));
    if (ready && !wasReady && state.running) {
      if (dom.gaugeBlock) {
        const flame = dom.gaugeBlock.querySelector('.gauge-flame');
        if (flame) {
          flame.classList.remove('burst');
          void flame.offsetWidth;
          flame.classList.add('burst');
          setTimeout(() => flame.classList.remove('burst'), 700);
          if (fx) {
            const r = flame.getBoundingClientRect();
            fx.fireBurst(r.left + r.width / 2, r.top + r.height / 2, 26);
            fx.ring(r.left + r.width / 2, r.top + r.height / 2, '#ffd166', 62);
          }
        }
      }
      pulseCombo();
      if (!state.flags.gaugeToast) {
        state.flags.gaugeToast = true;
        if (sound) sound.gaugeFull();
        showToast('<b>锅气满了！</b> 点棋盘任意位置，爆炒！', 3200);
        bumpChef('excited');
      }
    }
  }

  function updateMoves() {
    if (dom.movesCount) dom.movesCount.textContent = state.moves;
    if (dom.movesCard) {
      dom.movesCard.classList.toggle('low', state.moves <= 3);
      dom.movesCard.classList.remove('bump');
      void dom.movesCard.offsetWidth;
      dom.movesCard.classList.add('bump');
      clearTimeout(dom.movesCard._bumpTimer);
      dom.movesCard._bumpTimer = setTimeout(() => dom.movesCard.classList.remove('bump'), 320);
    }
  }

  function updateAllUI() {
    updateOrderUI();
    updateGaugeUI();
    updateMoves();
    resetStarGoals();
  }

  function resetStarGoals() {
    $$('.star-goal').forEach(goal => {
      goal.classList.remove('earned');
      const icon = goal.querySelector('.star-icon');
      if (icon) icon.classList.add('hollow');
    });
  }

  function markStarGoals(stars) {
    $$('.star-goal').forEach(goal => {
      const n = Number(goal.dataset.star);
      goal.classList.toggle('earned', n <= stars);
      const icon = goal.querySelector('.star-icon');
      if (icon) icon.classList.toggle('hollow', n > stars);
    });
  }

  function addGauge(amount) {
    state.gauge = clamp(state.gauge + amount, 0, GAUGE_MAX);
    updateGaugeUI();
  }

  function bumpChef(mode = 'happy') {
    if (!dom.chefWrap) return;
    dom.chefWrap.classList.remove('happy', 'excited');
    void dom.chefWrap.offsetWidth;
    dom.chefWrap.classList.add(mode);
    setTimeout(() => dom.chefWrap.classList.remove(mode), mode === 'excited' ? 1200 : 1000);
  }

  function showToast(html, duration = 2800) {
    if (!dom.toast) return;
    clearTimeout(toastTimer);
    hideTutorial();
    dom.toast.innerHTML = html;
    dom.toast.classList.remove('hidden');
    toastTimer = setTimeout(() => dom.toast.classList.add('hidden'), duration);
  }

  function showTutorial(html, duration = 4200) {
    if (!dom.tutorialTip) return;
    clearTimeout(tutorialTimer);
    hideToast();
    dom.tutorialTip.innerHTML = html;
    dom.tutorialTip.classList.remove('hidden');
    tutorialTimer = setTimeout(() => dom.tutorialTip.classList.add('hidden'), duration);
  }

  function hideToast() {
    clearTimeout(toastTimer);
    if (dom.toast) dom.toast.classList.add('hidden');
  }

  function hideTutorial() {
    clearTimeout(tutorialTimer);
    if (dom.tutorialTip) dom.tutorialTip.classList.add('hidden');
  }

  function showCombo(n) {
    clearTimeout(comboTimer);
    if (n >= 3) {
      if (dom.comboBadge) dom.comboBadge.classList.add('hidden');
      showComboBanner(n);
    } else if (dom.comboBadge) {
      dom.comboBadge.innerHTML = `<svg class="icon"><use href="#i-flame"></use></svg>连击 <b>x${n}</b>`;
      dom.comboBadge.classList.remove('hidden');
      dom.comboBadge.style.animation = 'none';
      void dom.comboBadge.offsetWidth;
      dom.comboBadge.style.animation = '';
      comboTimer = setTimeout(() => dom.comboBadge.classList.add('hidden'), 760);
    }
    pulseCombo();
    if (sound) sound.chain(n);
    const boardRect = dom.board.getBoundingClientRect();
    if (fx) fx.ring(boardRect.left + boardRect.width / 2, boardRect.top + boardRect.height / 2, '#ffd166', n >= 3 ? 128 : 110);
    if (n >= 4) randomPraise(PRAISE.combo);
  }

  function updateStreakChip() {
    if (!dom.streakChip) return;
    const n = streakCelebrate ? 3 : Math.min(3, state.successStreak);
    dom.streakChip.classList.toggle('complete', n >= 3);
    if (dom.streakCount) dom.streakCount.textContent = n >= 3 ? '3' : String(n);
    const pips = dom.streakChip.querySelectorAll('.streak-pips i');
    pips.forEach((p, i) => p.classList.toggle('on', i < n));
  }

  function registerSuccess() {
    if (!state.running || state.levelComplete || state.gameOver) return;
    streakCelebrate = false;
    clearTimeout(streakResetTimer);
    state.successStreak++;
    state.maxSuccessStreak = Math.max(state.maxSuccessStreak, state.successStreak);
    if (state.successStreak >= 3) {
      state.successStreak = 0;
      streakCelebrate = true;
      updateStreakChip();
      triggerTripleSuccess();
      clearTimeout(streakResetTimer);
      streakResetTimer = setTimeout(() => {
        streakCelebrate = false;
        updateStreakChip();
      }, 1150);
    } else {
      updateStreakChip();
    }
  }

  function resetSuccessStreak() {
    clearTimeout(streakResetTimer);
    streakCelebrate = false;
    state.successStreak = 0;
    updateStreakChip();
  }

  function showSuccessBanner() {
    if (!dom.successBanner) return;
    dom.successBanner.classList.remove('hidden', 'show');
    void dom.successBanner.offsetWidth;
    dom.successBanner.classList.add('show');
    clearTimeout(successBannerTimer);
    successBannerTimer = setTimeout(() => {
      dom.successBanner.classList.add('hidden');
      dom.successBanner.classList.remove('show');
    }, 1450);
  }

  function triggerTripleSuccess() {
    state.tripleCount++;
    addGauge(2);
    showSuccessBanner();
    if (sound) sound.tripleSuccess();
    bumpChef('excited');
    pulseCombo();
    const boardRect = dom.board.getBoundingClientRect();
    const cx = boardRect.left + boardRect.width / 2;
    const cy = boardRect.top + boardRect.height / 2;
    if (fx) {
      fx.ring(cx, cy, '#ffd166', 130);
      fx.sparkle(cx, cy, 22);
      fx.burst(cx, cy, ['#ffd166', '#ff9b3d', '#fff2cf', '#e85d3f'], 34, {
        speedMin: 80, speedMax: 330, gravity: 260, sizeMin: 2, sizeMax: 6,
        lifeMin: 0.4, lifeMax: 0.95, shape: 'circle'
      });
    }
    floatText('三连成功 · 锅气 +2', cx, boardRect.top + 16);
  }

  function showComboBanner(n) {
    if (!dom.comboBanner) return;
    const tiers = {
      3: { title: '三连击!', sub: '火候正好' },
      4: { title: '四连击!', sub: '火力全开' },
      5: { title: '五连击!', sub: '停不下来' }
    };
    const tier = n >= 6 ? { title: '灶台要飞了!', sub: '这锅要封神' } : tiers[n] || tiers[3];
    if (dom.comboBannerNum) dom.comboBannerNum.textContent = String(n);
    if (dom.comboBannerTitle) dom.comboBannerTitle.textContent = tier.title;
    if (dom.comboBannerSub) dom.comboBannerSub.textContent = tier.sub;
    if (dom.comboBannerPips) {
      Array.from(dom.comboBannerPips.children).forEach((p, i) => p.classList.toggle('on', i < Math.min(5, n)));
    }
    dom.comboBanner.className = 'combo-banner' + (n === 4 ? ' tier-4' : n >= 5 ? ' tier-5' : '');
    dom.comboBanner.classList.remove('hidden');
    void dom.comboBanner.offsetWidth;
    dom.comboBanner.classList.add('show');
    clearTimeout(comboBannerTimer);
    comboBannerTimer = setTimeout(() => {
      dom.comboBanner.classList.add('hidden');
      dom.comboBanner.classList.remove('show');
    }, 1200);
    if (sound) sound.comboMilestone(n);
  }

  const PRAISE = {
    swap: ['好香！', '漂亮！', '这手稳！', '再来！', '火候正好！'],
    combo: ['连击！', '香起来了！', '这一锅稳了！', '漂亮！'],
    order: ['齐了！', '可以下锅了！', '这碗有戏！']
  };

  function showPraise(text, duration = 980) {
    if (!dom.praiseBubble) return;
    dom.praiseBubble.textContent = text;
    dom.praiseBubble.classList.remove('hidden', 'show');
    void dom.praiseBubble.offsetWidth;
    dom.praiseBubble.classList.add('show');
    clearTimeout(praiseTimer);
    praiseTimer = setTimeout(() => {
      dom.praiseBubble.classList.add('hidden');
      dom.praiseBubble.classList.remove('show');
    }, duration);
    if (sound) sound.praise();
  }

  function randomPraise(list = PRAISE.swap) {
    const now = Date.now();
    if (now - lastPraiseAt < 1400) return;
    lastPraiseAt = now;
    showPraise(pick(list));
  }

  function floatText(text, x, y) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  function pulseCombo() {
    if (!dom.comboPulse) return;
    dom.comboPulse.classList.remove('on');
    void dom.comboPulse.offsetWidth;
    dom.comboPulse.classList.add('on');
    clearTimeout(comboPulseTimer);
    comboPulseTimer = setTimeout(() => dom.comboPulse.classList.remove('on'), 620);
  }

  function bowlSplash(strength = 1) {
    if (!dom.bowlSplash) return;
    const now = Date.now();
    if (now - lastBowlSplash < 110) return;
    lastBowlSplash = now;
    const count = strength > 1.2 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const ripple = document.createElement('span');
      ripple.className = 'bowl-ripple';
      ripple.style.left = (46 + Math.random() * 9) + '%';
      ripple.style.top = (43 + Math.random() * 10) + '%';
      ripple.style.animationDelay = (i * 70) + 'ms';
      dom.bowlSplash.appendChild(ripple);
      setTimeout(() => ripple.remove(), 900);
    }
    dom.bowl.classList.remove('splash');
    void dom.bowl.offsetWidth;
    dom.bowl.classList.add('splash');
    setTimeout(() => dom.bowl.classList.remove('splash'), 480);
    const r = dom.bowl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.45;
    fx.burst(cx, cy, ['#ffd166', '#fff2cf', '#f08a3c'], Math.round(5 + strength * 4), {
      speedMin: 25, speedMax: 120, gravity: 130, sizeMin: 1.5, sizeMax: 4,
      lifeMin: 0.25, lifeMax: 0.55, additive: true
    });
    if (sound) sound.splash();
  }

  function celebrateSwap(a, b) {
    [a, b].forEach(t => {
      if (!t || !t.el) return;
      t.el.classList.add('is-success');
      setTimeout(() => { if (t.el) t.el.classList.remove('is-success'); }, 460);
    });
    const rects = [a, b].map(t => t.el && t.el.getBoundingClientRect()).filter(Boolean);
    if (rects.length) {
      const midX = (rects[0].left + rects[1].left + rects[0].width / 2 + rects[1].width / 2) / 2;
      const midY = (rects[0].top + rects[1].top + rects[0].height / 2 + rects[1].height / 2) / 2;
      fx.ring(midX, midY, '#ffe0a1', 74);
      fx.sparkle(midX, midY, 10);
    }
    if (sound) sound.swapSuccess();
    if (!state.flags.firstSwap) {
      state.flags.firstSwap = true;
      showPraise('漂亮！', 1200);
    } else if (Math.random() < 0.5) {
      randomPraise(PRAISE.swap);
    }
  }

  function announceOrderComplete() {
    if (orderAnnounced) return;
    orderAnnounced = true;
    if (dom.orderCard) dom.orderCard.classList.add('complete');
    if (dom.orderStamp) {
      dom.orderStamp.classList.remove('hidden');
      dom.orderStamp.classList.remove('show');
      void dom.orderStamp.offsetWidth;
      dom.orderStamp.classList.add('show');
    }
    if (sound) sound.orderAllDone();
    showPraise('订单齐了！', 1200);
    pulseCombo();
    if (dom.orderCard) {
      const r = dom.orderCard.getBoundingClientRect();
      floatText('叮！订单完成', r.left + r.width / 2, r.top + r.height + 6);
    }
  }

  function flash() {
    if (!dom.flash) return;
    clearTimeout(flashTimer);
    dom.flash.classList.add('on');
    flashTimer = setTimeout(() => dom.flash.classList.remove('on'), 95);
  }

  function shake() {
    if (!dom.gameScreen) return;
    clearTimeout(shakeTimer);
    dom.gameScreen.classList.remove('shake');
    void dom.gameScreen.offsetWidth;
    dom.gameScreen.classList.add('shake');
    shakeTimer = setTimeout(() => dom.gameScreen.classList.remove('shake'), 320);
  }

  function showUltimateBanner() {
    if (!dom.ultimateBanner) return;
    dom.ultimateBanner.classList.remove('hidden');
    clearTimeout(dom.ultimateBanner._timer);
    dom.ultimateBanner._timer = setTimeout(() => dom.ultimateBanner.classList.add('hidden'), 950);
  }

  function toggleSound() {
    sound.init();
    sound.resume();
    sound.setEnabled(!sound.enabled);
    try { localStorage.setItem('catRamenSound', sound.enabled ? '1' : '0'); } catch (e) {}
    updateSoundUI();
    if (sound.enabled && state.running && !state.paused && !state.levelComplete) {
      sound.startMusic();
    } else {
      sound.stopMusic();
    }
  }

  function updateSoundUI() {
    const href = sound.enabled ? '#i-sound' : '#i-mute';
    [dom.soundBtn, dom.titleSoundBtn].forEach(btn => {
      if (!btn) return;
      const use = btn.querySelector('use');
      if (use) use.setAttribute('href', href);
      btn.classList.toggle('is-muted', !sound.enabled);
      btn.setAttribute('aria-label', sound.enabled ? '关闭音效' : '开启音效');
    });
    if (dom.pauseSoundBtn) dom.pauseSoundBtn.textContent = '音效：' + (sound.enabled ? '开' : '关');
  }

  function showBestRecord() {
    if (!dom.bestRecord) return;
    let best = 0;
    try { best = Number(localStorage.getItem('catRamenBest') || 0); } catch (e) {}
    if (best > 0) {
      dom.bestRecord.innerHTML = `上次最好：<span class="stars">${'★'.repeat(best)}${'☆'.repeat(3 - best)}</span>`;
      dom.bestRecord.classList.remove('hidden');
    } else {
      dom.bestRecord.classList.add('hidden');
    }
  }

  function saveBest(stars) {
    let best = 0;
    try { best = Number(localStorage.getItem('catRamenBest') || 0); } catch (e) {}
    if (stars > best) {
      try { localStorage.setItem('catRamenBest', String(stars)); } catch (e) {}
    }
    showBestRecord();
  }

  /* =========================================================
     SPECIAL EFFECTS / CLEARING
     ========================================================= */
  function mostCommonType() {
    const counts = {};
    state.board.forEach(row => row.forEach(t => {
      if (t) counts[t.type] = (counts[t.type] || 0) + 1;
    }));
    let best = 'noodle', n = -1;
    Object.keys(counts).forEach(type => {
      if (counts[type] > n) { n = counts[type]; best = type; }
    });
    return best;
  }

  function specialEffectKeys(tile, rainbowType = null) {
    const keys = [];
    if (!tile || !tile.special) return keys;
    if (tile.special === 'cleaver') {
      if (tile.orientation === 'v') {
        for (let r = 0; r < ROWS; r++) keys.push(keyOf(r, tile.c));
      } else {
        for (let c = 0; c < COLS; c++) keys.push(keyOf(tile.r, c));
      }
    } else if (tile.special === 'firecracker') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = tile.r + dr, c = tile.c + dc;
          if (r >= 0 && r < ROWS && c >= 0 && c < COLS) keys.push(keyOf(r, c));
        }
      }
    } else if (tile.special === 'rainbow') {
      const target = rainbowType || mostCommonType();
      state.board.forEach((row, r) => row.forEach((t, c) => {
        if (t && t.type === target) keys.push(keyOf(r, c));
      }));
    }
    return keys;
  }

  async function processClear(clearSet, options = {}) {
    const { creations = [], combo = 1, rainbowType = null } = options;
    const protectedKeys = new Set(creations.map(c => keyOf(c.r, c.c)));
    protectedKeys.forEach(k => clearSet.delete(k));

    // activate specials in the clear set, recursively
    const queue = [];
    for (const k of clearSet) {
      const [r, c] = parseKey(k);
      const t = tileAt(r, c);
      if (t && t.special) queue.push(k);
    }
    const activated = new Set();
    let activationCount = 0;
    while (queue.length && activationCount < 80) {
      activationCount++;
      const k = queue.pop();
      if (activated.has(k)) continue;
      const [r, c] = parseKey(k);
      const t = tileAt(r, c);
      if (!t || !t.special) continue;
      activated.add(k);
      clearSet.add(k);
      sound.special(t.special);
      state.specialActivated++;
      const extras = specialEffectKeys(t, rainbowType);
      for (const ek of extras) {
        clearSet.add(ek);
        const [er, ec] = parseKey(ek);
        const et = tileAt(er, ec);
        if (et && et.special && !activated.has(ek)) queue.push(ek);
      }
      const center = t.el ? centerOf(t.el) : null;
      if (center) fx.sparkle(center.x, center.y, 9);
    }

    // protect special creation cells even from special effects
    protectedKeys.forEach(k => clearSet.delete(k));

    const clearedTiles = [];
    let flyBudget = 8;
    for (const k of clearSet) {
      const [r, c] = parseKey(k);
      const t = tileAt(r, c);
      if (!t || t._clearing) continue;
      t._clearing = true;
      clearedTiles.push(t);
      const before = state.collected[t.type] || 0;
      const need = ORDER[t.type] || 0;
      if (need && before < need) state.collected[t.type] = before + 1;
      const after = state.collected[t.type] || 0;
      const counted = after > before;
      const rect = t.el ? t.el.getBoundingClientRect() : null;
      if (rect) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        fx.ingredientBurst(cx, cy, t.type);
        if (counted && flyBudget > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          flyIngredient(t.type, rect);
          flyBudget--;
        }
      }
      t.el.classList.add('is-removing');
    }

    const gain = Math.round(clearedTiles.length * (1 + Math.max(0, combo - 1) * 0.28));
    if (clearedTiles.length) {
      addGauge(gain);
      const centers = clearedTiles.map(t => t.el ? centerOf(t.el) : null).filter(Boolean);
      if (centers.length && fx) {
        const cx = centers.reduce((n, p) => n + p.x, 0) / centers.length;
        const cy = centers.reduce((n, p) => n + p.y, 0) / centers.length;
        fx.ring(cx, cy, combo >= 3 ? '#ff9b3d' : '#ffe0a1', 82 + Math.min(60, clearedTiles.length * 4));
      }
      bowlSplash(clearedTiles.length >= 8 ? 1.35 : 0.9);
      if (combo >= 2) randomPraise(PRAISE.combo);
    }
    updateOrderUI();
    updateGaugeUI();

    await sleep(230);

    clearedTiles.forEach(t => {
      if (t.el) t.el.remove();
      if (state.board[t.r] && state.board[t.r][t.c] === t) state.board[t.r][t.c] = null;
      state.tileById.delete(t.id);
    });

    // create new specials
    state.specialCreated += creations.length;
    creations.forEach(c => {
      const t = tileAt(c.r, c.c);
      if (!t) return;
      t.special = c.special;
      t.orientation = c.orientation || null;
      updateTileVisual(t);
      t.el.classList.add('is-created');
      setTimeout(() => { if (t.el) t.el.classList.remove('is-created'); }, 680);
      const rect = t.el.getBoundingClientRect();
      fx.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
      fx.ring(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ffd166', 58);
      sound.special(c.special);
      state.gauge = clamp(state.gauge + 2, 0, GAUGE_MAX);
      if (!state.flags.firstSpecial) {
        state.flags.firstSpecial = true;
        const label = c.special === 'cleaver' ? '刀光' : c.special === 'firecracker' ? '火爆' : '彩虹汤';
        const tip = c.special === 'cleaver' ? '清一整行或列' : c.special === 'firecracker' ? '炸掉周围 3×3' : '消掉场上一种食材';
        showToast(`<b>${label}！</b> ${tip}`, 3000);
        floatText(label + '！', rect.left + rect.width / 2, rect.top - 8);
      }
      if (state.flags.firstSpecial) bumpChef('happy');
    });
    updateGaugeUI();
    updateOrderUI();

    await dropAndRefill();
    return { orderComplete: state.totalCollected >= REQUIRED_TOTAL, cleared: clearedTiles.length };
  }

  async function dropAndRefill() {
    const step = state.cell + state.gap;
    const newTiles = [];
    for (let c = 0; c < COLS; c++) {
      const remaining = [];
      for (let r = ROWS - 1; r >= 0; r--) {
        const t = tileAt(r, c);
        if (t) remaining.push(t);
      }
      // clear column then re-place from bottom
      for (let r = 0; r < ROWS; r++) state.board[r][c] = null;
      let write = ROWS - 1;
      remaining.forEach(t => {
        t.r = write;
        t.c = c;
        state.board[write][c] = t;
        positionTile(t);
        write--;
      });
      // new tiles above
      const emptyCount = write + 1;
      for (let r = write; r >= 0; r--) {
        const type = pick(TYPES);
        const t = createTile(type, r, c);
        state.board[r][c] = t;
        createTileEl(t);
        const startY = -((write - r + 1) * step + state.cell);
        t.el.style.transition = 'none';
        t.el.style.transform = `translate(${c * step}px, ${startY}px)`;
        void t.el.offsetHeight;
        t.el.style.transition = '';
        newTiles.push(t);
      }
    }
    if (newTiles.length) {
      requestAnimationFrame(() => {
        newTiles.forEach(t => {
          if (t.el && state.board[t.r] && state.board[t.r][t.c] === t) positionTile(t);
        });
      });
    }
    await sleep(340);
  }

  function flyIngredient(type, rect) {
    if (!dom.bowl) return;
    const bowlRect = dom.bowl.getBoundingClientRect();
    if (!bowlRect.width) return;
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const endX = bowlRect.left + bowlRect.width / 2;
    const endY = bowlRect.top + bowlRect.height * 0.42;
    const dx = endX - startX;
    const dy = endY - startY;
    const el = document.createElement('div');
    el.className = 'flying-ingredient';
    el.innerHTML = ICONS[type] || '';
    document.body.appendChild(el);
    const size = 30;
    const anim = el.animate([
      { transform: `translate(${startX - size / 2}px, ${startY - size / 2}px) scale(1) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${startX + dx * 0.55 - size / 2}px, ${startY + dy * 0.35 - 60 - size / 2}px) scale(.78) rotate(25deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${endX - size / 2}px, ${endY - size / 2}px) scale(.18) rotate(70deg)`, opacity: 0 }
    ], {
      duration: 430 + Math.random() * 160,
      easing: 'cubic-bezier(.2,.7,.3,1)',
      fill: 'forwards'
    });
    anim.onfinish = () => {
      el.remove();
      fx.sparkle(endX, endY, 5);
    };
  }

  /* =========================================================
     CASCADES / SWAPS
     ========================================================= */
  async function resolveCascades(options = {}) {
    let combo = 0;
    let swapTiles = options.swapTiles || null;
    let rainbowType = options.rainbowType || null;
    for (let loop = 0; loop < 25; loop++) {
      const runs = findRunsOnBoard();
      if (!runs.length) break;
      combo++;
      state.combo = combo;
      state.maxCombo = Math.max(state.maxCombo, combo);
      sound.match(combo);
      if (combo >= 2) {
        showCombo(combo);
        if (combo >= 4) shake();
      }
      if (combo === 2) bumpChef('happy');
      const matched = matchedKeys(runs);
      const creations = findSpecialCreations(runs, swapTiles);
      swapTiles = null;
      creations.forEach(c => matched.delete(keyOf(c.r, c.c)));
      const result = await processClear(matched, { creations, combo, rainbowType });
      rainbowType = null;
      updateOrderUI();
      updateGaugeUI();
      if (result.orderComplete) break;
    }
    state.combo = 0;
    return combo;
  }

  async function attemptSwap(a, b) {
    if (!state.running || state.paused || state.busy || state.levelComplete || state.gameOver) return;
    if (!a || !b || a === b) return;
    if (!areAdjacent(a, b)) return;
    clearSelection();
    clearHint();
    hideTutorial();
    state.busy = true;
    resetIdle();
    swapBoard(a, b);
    positionTile(a);
    positionTile(b);
    sound.click();
    await sleep(150);

    const aIsSpecial = !!a.special;
    const bIsSpecial = !!b.special;
    const hasRainbow = a.special === 'rainbow' || b.special === 'rainbow';
    const specialSwap = (aIsSpecial && bIsSpecial) || hasRainbow;
    const runs = findRunsOnBoard();

    if (!specialSwap && !runs.length) {
      swapBoard(a, b);
      positionTile(a);
      positionTile(b);
      await sleep(170);
      sound.invalid();
      resetSuccessStreak();
      state.busy = false;
      scheduleHint();
      return;
    }

    celebrateSwap(a, b);
    state.moves = Math.max(0, state.moves - 1);
    updateMoves();

    if (specialSwap) {
      await handleSpecialSwap(a, b);
    } else {
      await resolveCascades({ swapTiles: [a, b] });
    }
    registerSuccess();
    await finalizeTurn();
  }

  function swapBoard(a, b) {
    const ar = a.r, ac = a.c, br = b.r, bc = b.c;
    state.board[ar][ac] = b;
    state.board[br][bc] = a;
    a.r = br; a.c = bc;
    b.r = ar; b.c = ac;
  }

  function areAdjacent(a, b) {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
  }

  async function handleSpecialSwap(a, b) {
    const bothSpecial = !!(a.special && b.special);
    const clearSet = new Set();
    let rainbowType = null;
    if (bothSpecial) {
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) clearSet.add(keyOf(r, c));
      showToast('<b>满锅爆炒！</b> 全屏食材一起飞！', 2600);
      flash(); shake(); fx.fireBurst(window.innerWidth / 2, window.innerHeight * 0.45, 100);
    } else {
      const rainbowTile = a.special === 'rainbow' ? a : b;
      const other = rainbowTile === a ? b : a;
      rainbowType = other.type;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const t = tileAt(r, c);
          if (t && t.type === other.type) clearSet.add(keyOf(r, c));
        }
      }
      clearSet.add(keyOf(rainbowTile.r, rainbowTile.c));
      showToast(`<b>彩虹汤！</b> 清掉所有${typeName(other.type)}！`, 2400);
      flash();
    }
    await sleep(180);
    await processClear(clearSet, { creations: [], combo: 1, rainbowType });
    await resolveCascades();
  }

  async function finalizeTurn() {
    if (state.levelComplete || state.gameOver) {
      state.busy = false;
      return;
    }
    if (state.totalCollected >= REQUIRED_TOTAL) {
      await handleOrderComplete();
      return;
    }
    if (state.moves <= 0) {
      state.busy = false;
      showFail();
      return;
    }
    if (!hasValidMove()) {
      await shuffleBoard();
    }
    state.busy = false;
    scheduleHint();
  }

  async function handleOrderComplete() {
    if (state.serving) return;
    state.serving = true;
    if (!state.ultimateUsed && state.gauge >= GAUGE_MAX * 0.5) {
      await performUltimate(3, 3, { auto: true });
    }
    await serveDish();
  }

  /* =========================================================
     ULTIMATE
     ========================================================= */
  async function performUltimate(r, c, options = {}) {
    const { auto = false } = options;
    if (!auto && (!state.ultimateReady || state.busy || state.levelComplete || state.gameOver)) return;
    state.ultimateUsed = true;
    state.ultimateReady = false;
    state.gauge = 0;
    updateGaugeUI();
    state.busy = true;
    clearSelection();
    clearHint();
    sound.ultimate();
    showUltimateBanner();
    flash();
    shake();
    bumpChef('excited');
    const boardRect = dom.board.getBoundingClientRect();
    fx.fireBurst(boardRect.left + boardRect.width / 2, boardRect.top + boardRect.height / 2, 110);
    await sleep(260);

    const clearSet = new Set();
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const rr = r + dr, cc = c + dc;
        if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) clearSet.add(keyOf(rr, cc));
      }
    }
    // all specials on the board join the show
    state.board.forEach(row => row.forEach(t => {
      if (t && t.special) clearSet.add(keyOf(t.r, t.c));
    }));

    await processClear(clearSet, { creations: [], combo: 1 });
    // The ultimate spends the full gauge; refill only from the cascades after it.
    state.gauge = 0;
    state.ultimateReady = false;
    updateGaugeUI();
    await resolveCascades();
    if (!auto) await finalizeTurn();
  }

  async function triggerUltimate(r, c) {
    if (!state.ultimateReady || !state.running || state.paused || state.busy || state.levelComplete || state.gameOver) return;
    await performUltimate(r, c);
  }

  /* =========================================================
     SHUFFLE
     ========================================================= */
  async function shuffleBoard() {
    state.busy = true;
    clearHint();
    clearSelection();
    sound.sneeze();
    showToast('<b>阿汤打了个喷嚏！</b> 食材重新摆好啦。', 2400);
    dom.board.classList.add('is-shuffling');
    await sleep(280);
    state.board = [];
    state.tileById.clear();
    makeBoard();
    buildBoardDOM();
    requestAnimationFrame(() => layoutBoard());
    updateOrderUI();
    updateGaugeUI();
    await sleep(360);
    dom.board.classList.remove('is-shuffling');
    state.busy = false;
  }

  /* =========================================================
     SERVE / WIN / FAIL
     ========================================================= */
  function calculateStars() {
    let stars = 1;
    if (state.moves >= 2) stars++;
    if (state.ultimateUsed) stars++;
    return clamp(stars, 1, 3);
  }

  async function serveDish() {
    if (state.levelComplete) return;
    state.levelComplete = true;
    state.busy = true;
    state.stars = calculateStars();
    clearHint();
    clearSelection();
    hideTutorial();
    dom.bowl.style.setProperty('--fill', '100%');
    dom.bowl.classList.add('full');
    dom.chefWrap.classList.add('happy');
    dom.chefWrap.classList.add('cheer');
    sound.stopMusic();
    bowlSplash(1.8);
    showPraise('上菜！', 1500);
    sound.serve();
    dom.serveStars.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 32 32');
      svg.classList.add('star-slot');
      if (i < state.stars) {
        setTimeout(() => {
          svg.classList.add('show');
          if (sound) sound.star(i);
        }, 450 + i * 230);
      }
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#i-star');
      svg.appendChild(use);
      dom.serveStars.appendChild(svg);
    }
    dom.serveOverlay.classList.remove('hidden');
    clearTimeout(state.serveTimer);
    const token = state.levelId;
    state.serveTimer = setTimeout(() => finishServe(token), 2850);
    saveBest(state.stars);
  }

  function finishServe(token) {
    if (token != null && token !== state.levelId) return;
    if (!state.serving && state.serveOverlay.classList.contains('hidden')) return;
    clearTimeout(state.serveTimer);
    state.serveTimer = null;
    dom.serveOverlay.classList.add('hidden');
    dom.chefWrap.classList.remove('happy');
    showWin();
  }

  function showWin() {
    markStarGoals(state.stars);
    if (dom.winStars) {
      dom.winStars.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.classList.add('star-slot');
        if (i < state.stars) svg.classList.add('on');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', '#i-star');
        svg.appendChild(use);
        dom.winStars.appendChild(svg);
      }
    }
    if (dom.winStats) {
      dom.winStats.innerHTML = `
        <span>剩余步数 <b>${state.moves}</b></span>
        <span>最高连击 <b>x${state.maxCombo || 1}</b></span>
        <span>三连成功 <b>x${state.tripleCount || 0}</b></span>
        <span>锅气全开 <b>${state.ultimateUsed ? '✓' : '—'}</b></span>
      `;
    }
    dom.winOverlay.classList.remove('hidden');
    sound.win();
    if (state.stars >= 3) fx.confetti();
  }

  function showFail() {
    if (state.gameOver) return;
    state.gameOver = true;
    state.busy = true;
    clearHint();
    clearSelection();
    hideTutorial();
    sound.stopMusic();
    sound.fail();
    if (dom.rescueBtn) dom.rescueBtn.classList.toggle('hidden', state.rescueUsed);
    if (dom.failHint) {
      dom.failHint.textContent = state.rescueUsed ? '救场机会已经用过了。' : '每关只有一次救场机会。';
    }
    dom.failOverlay.classList.remove('hidden');
  }

  async function rescue() {
    if (state.rescueUsed || !state.gameOver) return;
    state.rescueUsed = true;
    state.gameOver = false;
    state.moves = 3;
    state.busy = false;
    dom.failOverlay.classList.add('hidden');
    updateMoves();
    hideToast();
    showToast('<b>再煮三分钟！</b> 阿汤又给你添了 3 步。', 2600);
    showPraise('再煮三分钟！', 1500);
    sound.rescue();
    if (!hasValidMove()) await shuffleBoard();
    scheduleHint();
  }

  /* =========================================================
     HINTS / INPUT / PAUSE
     ========================================================= */
  function clearHint() {
    clearTimeout(state.hintTimer);
    state.hintTiles.forEach(t => {
      if (!t || !t.el) return;
      t.el.classList.remove('is-hint');
      const paw = t.el.querySelector('.paw-hint');
      if (paw) paw.remove();
    });
    state.hintTiles = [];
  }

  function showHint(move, duration = 5200) {
    clearHint();
    if (!move || state.busy || state.levelComplete || state.gameOver) return;
    const t1 = tileAt(move.a[0], move.a[1]);
    const t2 = tileAt(move.b[0], move.b[1]);
    if (!t1 || !t2) return;
    [t1, t2].forEach(t => {
      if (t.el) t.el.classList.add('is-hint');
    });
    if (t2.el) {
      const paw = document.createElement('span');
      paw.className = 'paw-hint';
      paw.innerHTML = ICONS.paw;
      t2.el.appendChild(paw);
    }
    state.hintTiles = [t1, t2];
    state.hintTimer = setTimeout(clearHint, duration);
  }

  function scheduleHint() {
    clearTimeout(state.idleTimer);
    if (!state.running || state.busy || state.paused || state.levelComplete || state.gameOver) return;
    state.idleTimer = setTimeout(() => {
      if (!state.running || state.busy || state.paused || state.levelComplete || state.gameOver) return;
      const move = findHint('noodle') || findHint();
      if (move) showHint(move, 5200);
    }, 6500);
  }

  function resetIdle() {
    clearTimeout(state.idleTimer);
  }

  function clearSelection() {
    if (state.selected && state.selected.el) state.selected.el.classList.remove('is-selected');
    state.selected = null;
  }

  function selectTile(tile) {
    if (!tile || !tile.el) return;
    if (state.selected && state.selected !== tile) state.selected.el.classList.remove('is-selected');
    state.selected = tile;
    tile.el.classList.add('is-selected');
    sound.click();
  }

  function getTileFromEvent(e) {
    const target = e.target;
    if (!target || !target.closest) return null;
    const el = target.closest('.tile');
    if (!el || !dom.board.contains(el)) return null;
    const id = Number(el.dataset.id);
    return state.tileById.get(id) || null;
  }

  function onBoardPointerDown(e) {
    if (!state.running || state.paused || state.busy || state.levelComplete || state.gameOver) return;
    if (e.button != null && e.button !== 0) return;
    const tile = getTileFromEvent(e);
    if (!tile) return;
    e.preventDefault();
    sound.init();
    sound.resume();
    hideTutorial();
    clearHint();
    resetIdle();

    if (state.ultimateReady) {
      triggerUltimate(tile.r, tile.c);
      return;
    }

    if (state.selected) {
      if (state.selected === tile) {
        clearSelection();
        return;
      }
      if (areAdjacent(state.selected, tile)) {
        const a = state.selected;
        clearSelection();
        attemptSwap(a, tile);
        return;
      }
      selectTile(tile);
    } else {
      selectTile(tile);
    }

    state.pointer = {
      tile,
      startX: e.clientX,
      startY: e.clientY,
      id: e.pointerId
    };
    window.addEventListener('pointermove', onBoardPointerMove);
    window.addEventListener('pointerup', onBoardPointerUp);
    window.addEventListener('pointercancel', onBoardPointerUp);
  }

  function onBoardPointerMove(e) {
    const p = state.pointer;
    if (!p || !p.tile || state.busy || !state.running) return;
    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;
    const threshold = Math.max(14, state.cell * 0.32);
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;
    const tile = p.tile;
    let target = null;
    if (Math.abs(dx) > Math.abs(dy)) {
      target = tileAt(tile.r, tile.c + (dx > 0 ? 1 : -1));
    } else {
      target = tileAt(tile.r + (dy > 0 ? 1 : -1), tile.c);
    }
    clearPointer();
    clearSelection();
    if (target) attemptSwap(tile, target);
  }

  function onBoardPointerUp() {
    clearPointer();
  }

  function clearPointer() {
    state.pointer = null;
    window.removeEventListener('pointermove', onBoardPointerMove);
    window.removeEventListener('pointerup', onBoardPointerUp);
    window.removeEventListener('pointercancel', onBoardPointerUp);
  }

  function openPause() {
    if (!state.running || state.levelComplete || state.gameOver) return;
    if (state.busy) {
      showToast('等这一手消完，再歇一会儿～', 1800);
      return;
    }
    clearHint();
    state.paused = true;
    sound.stopMusic();
    updateSoundUI();
    dom.pauseOverlay.classList.remove('hidden');
  }

  function resumeGame() {
    dom.pauseOverlay.classList.add('hidden');
    state.paused = false;
    if (sound.enabled) sound.startMusic();
    scheduleHint();
  }

  /* =========================================================
     FLOW
     ========================================================= */
  function resetState() {
    state.running = true;
    state.paused = false;
    state.busy = false;
    state.levelComplete = false;
    state.gameOver = false;
    state.serving = false;
    state.board = [];
    state.tileById.clear();
    state.nextId = 1;
    state.moves = MOVES;
    state.collected = { noodle: 0, egg: 0, chashu: 0, nori: 0 };
    state.totalCollected = 0;
    state.gauge = 0;
    state.ultimateReady = false;
    state.ultimateUsed = false;
    state.combo = 0;
    state.maxCombo = 0;
    state.successStreak = 0;
    state.maxSuccessStreak = 0;
    state.tripleCount = 0;
    state.rescueUsed = false;
    state.selected = null;
    state.hintTiles = [];
    state.hintTimer = null;
    state.idleTimer = null;
    state.stars = 0;
    state.specialCreated = 0;
    state.specialActivated = 0;
    clearTimeout(state.serveTimer);
    state.serveTimer = null;
    state.pointer = null;
    state.levelId++;
    state.flags = { firstSpecial: false, firstSwap: false, gaugeToast: false, tutorialShown: false };
    clearTimeout(praiseTimer);
    clearTimeout(comboPulseTimer);
    clearTimeout(comboBannerTimer);
    clearTimeout(successBannerTimer);
    clearTimeout(streakResetTimer);
    streakCelebrate = false;
    orderAnnounced = false;
    updateStreakChip();
    if (dom.comboBanner) { dom.comboBanner.classList.add('hidden'); dom.comboBanner.classList.remove('show'); }
    if (dom.successBanner) { dom.successBanner.classList.add('hidden'); dom.successBanner.classList.remove('show'); }
    dom.bowl.style.setProperty('--fill', '48%');
    dom.bowl.classList.remove('full', 'splash');
    dom.chefWrap.classList.remove('happy', 'excited', 'cheer');
    if (dom.praiseBubble) { dom.praiseBubble.classList.add('hidden'); dom.praiseBubble.classList.remove('show'); }
    if (dom.comboPulse) dom.comboPulse.classList.remove('on');
    if (dom.bowlSplash) dom.bowlSplash.innerHTML = '';
    if (dom.orderStamp) { dom.orderStamp.classList.add('hidden'); dom.orderStamp.classList.remove('show'); }
    if (dom.orderCard) dom.orderCard.classList.remove('complete');
    dom.orderItems.forEach(item => {
      item.dataset.wasDone = '0';
      item.dataset.last = '0';
      item.classList.remove('done', 'just-done', 'bump');
    });
    if (dom.gaugeBlock) {
      const flame = dom.gaugeBlock.querySelector('.gauge-flame');
      if (flame) flame.classList.remove('burst');
    }
    if (sound) sound.setEnergy(0);
    if (dom.rescueBtn) dom.rescueBtn.classList.remove('hidden');
    if (dom.failHint) dom.failHint.textContent = '每关只有一次救场机会。';
    clearHint();
    clearSelection();
    hideToast();
    hideTutorial();
    dom.comboBadge.classList.add('hidden');
    dom.ultimateBanner.classList.add('hidden');
    dom.flash.classList.remove('on');
  }

  function startLevel() {
    [dom.winOverlay, dom.failOverlay, dom.pauseOverlay, dom.serveOverlay].forEach(o => {
      if (o) o.classList.add('hidden');
    });
    dom.titleScreen.classList.add('hidden');
    dom.gameScreen.classList.remove('hidden');
    resetState();
    makeBoard();
    buildBoardDOM();
    updateAllUI();
    requestAnimationFrame(() => {
      layoutBoard();
      updateAllUI();
      state.busy = false;
      sound.init();
      sound.resume();
      if (sound.enabled) {
        sound.startMusic();
        sound.ambientBell();
      }
      if (!hasPlayed) {
        hasPlayed = true;
        showTutorial('阿汤：先找三团面条，<b>拖一下</b>试试！', 4800);
        const hint = findHint('noodle') || findHint();
        if (hint) showHint(hint, 6000);
      } else {
        showToast('再煮一碗，火还旺着呢！', 1800);
      }
      scheduleHint();
    });
  }

  function returnToTitle() {
    state.running = false;
    state.paused = false;
    state.busy = true;
    clearTimeout(state.serveTimer);
    clearTimeout(state.idleTimer);
    clearHint();
    clearSelection();
    hideToast();
    hideTutorial();
    dom.serveOverlay.classList.add('hidden');
    dom.winOverlay.classList.add('hidden');
    dom.failOverlay.classList.add('hidden');
    dom.pauseOverlay.classList.add('hidden');
    dom.comboBadge.classList.add('hidden');
    dom.ultimateBanner.classList.add('hidden');
    sound.stopMusic();
    dom.gameScreen.classList.add('hidden');
    dom.titleScreen.classList.remove('hidden');
    showBestRecord();
    state.busy = false;
    state.levelComplete = false;
    state.gameOver = false;
  }

  async function finalizeAfterUltimate() {
    await finalizeTurn();
  }

  /* =========================================================
     INIT
     ========================================================= */
  function bindUI() {
    dom.startBtn.addEventListener('click', () => {
      sound.init();
      sound.resume();
      startLevel();
    });
    dom.titleSoundBtn.addEventListener('click', toggleSound);
    dom.soundBtn.addEventListener('click', toggleSound);
    dom.pauseBtn.addEventListener('click', openPause);
    dom.backBtn.addEventListener('click', openPause);
    dom.hintBtn.addEventListener('click', () => {
      if (state.busy || !state.running) return;
      const move = findHint() || findHint('noodle');
      if (move) {
        showHint(move, 4500);
        sound.click();
      }
    });
    dom.ultimateBtn.addEventListener('click', () => {
      if (!state.ultimateReady) return;
      showToast('<b>点棋盘任意位置，爆炒！</b>', 2200);
      bumpChef('excited');
    });
    dom.board.addEventListener('pointerdown', onBoardPointerDown);
    dom.playAgainBtn.addEventListener('click', startLevel);
    dom.nextLevelBtn.addEventListener('click', () => {
      showToast('第 2 关正在熬汤，先再来一碗吧！', 2400);
    });
    dom.winTitleBtn.addEventListener('click', returnToTitle);
    dom.rescueBtn.addEventListener('click', rescue);
    dom.retryBtn.addEventListener('click', startLevel);
    dom.failTitleBtn.addEventListener('click', returnToTitle);
    dom.resumeBtn.addEventListener('click', resumeGame);
    dom.pauseRestartBtn.addEventListener('click', startLevel);
    dom.pauseSoundBtn.addEventListener('click', toggleSound);
    dom.pauseTitleBtn.addEventListener('click', returnToTitle);
    dom.serveOverlay.addEventListener('click', () => finishServe());
    window.addEventListener('resize', scheduleLayout);
    if (window.ResizeObserver) {
      new ResizeObserver(scheduleLayout).observe(dom.board);
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!dom.pauseOverlay.classList.contains('hidden')) resumeGame();
        else openPause();
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.running && !state.busy && !state.paused && !state.levelComplete && !state.gameOver) {
        openPause();
      }
    });
  }

  function init() {
    sound = new SoundEngine();
    fx = new FXSystem(dom.fx);
    let pref = '1';
    try { pref = localStorage.getItem('catRamenSound') || '1'; } catch (e) {}
    sound.enabled = pref !== '0';
    updateSoundUI();
    initOrderUI();
    resetState();
    state.running = false;
    dom.titleScreen.classList.remove('hidden');
    dom.gameScreen.classList.add('hidden');
    showBestRecord();
    bindUI();
  }

  // debug helpers for automated testing / tweaking
  window.__ramen = {
    state,
    startLevel,
    attemptSwap,
    triggerUltimate,
    performUltimate,
    resolveCascades,
    shuffleBoard,
    findHint,
    layoutBoard,
    handleOrderComplete,
    finalizeTurn,
    serveDish,
    showWin,
    showFail,
    showComboBanner,
    finishServe,
    tileAt,
    setGauge(n) { state.gauge = clamp(n, 0, GAUGE_MAX); updateGaugeUI(); },
    setMoves(n) { state.moves = n; updateMoves(); },
    setOrder(obj) {
      ORDER_TYPES.forEach(t => { state.collected[t] = clamp(Number(obj[t] || 0), 0, ORDER[t]); });
      state.totalCollected = ORDER_TYPES.reduce((n, t) => n + state.collected[t], 0);
      updateOrderUI();
    },
    setGrid(grid) {
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const t = state.board[r] && state.board[r][c];
        if (!t || !grid[r] || !grid[r][c]) continue;
        t.type = grid[r][c]; t.special = null; t.orientation = null;
        updateTileVisual(t);
      }
      layoutBoard();
      updateAllUI();
    }
  };

  init();
})();
