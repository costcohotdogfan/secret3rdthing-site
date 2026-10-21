// THIRD.EXE engine: window, sound, sequencing. Scenes live in /scenes and register on THIRD.scenes.
(function () {
  const T = (window.THIRD = window.THIRD || {});
  T.scenes = T.scenes || {};
  const THIRD = "SECRET THIRD THING";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SPEED = reduced ? 0 : 38;
  const STOP = { stop: true };
  T.THIRD = THIRD;
  T.reduced = reduced;

  let RUN = 0;
  let mode = "rest";
  let minimized = false;
  let userMuted = false;
  let ac = null;

  // ---------- sound ----------
  function audio() {
    if (userMuted || minimized) return null;
    if (!ac) {
      try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    if (ac.state === "suspended") ac.resume();
    return ac;
  }
  function tone(freq, start, dur, type, vol) {
    const a = audio(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type || "square"; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.06, a.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
    o.connect(g).connect(a.destination);
    o.start(a.currentTime + start); o.stop(a.currentTime + start + dur + 0.02);
  }
  function noise(start, dur, vol, hp) {
    const a = audio(); if (!a) return;
    const len = Math.max(1, Math.floor(a.sampleRate * dur));
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = buf; f.type = "highpass"; f.frequency.value = hp || 2000;
    g.gain.setValueAtTime(vol || 0.05, a.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
    s.connect(f).connect(g).connect(a.destination);
    s.start(a.currentTime + start);
  }
  let lastClack = 0;
  const sfx = {
    click: () => noise(0, 0.018, 0.08, 3000),
    beep: () => tone(1046, 0, 0.12, "square", 0.07),
    buzz: () => tone(110, 0, 0.25, "sawtooth", 0.08),
    clack: () => {
      const n = performance.now();
      if (n - lastClack < 28) return;
      lastClack = n;
      noise(0, 0.012, 0.07, 1200);
    },
    chime: () => { tone(659, 0, 0.6, "sine", 0.09); tone(523, 0.35, 0.9, "sine", 0.09); },
    ding: () => { tone(1318, 0, 1.4, "sine", 0.09); tone(2637, 0, 0.6, "sine", 0.02); },
    grind: () => noise(0, 0.6, 0.06, 150),
    stat: () => noise(0, 0.24, 0.07, 500),
    modem: () => {
      tone(1300, 0, 0.35, "sine", 0.05);
      tone(2100, 0.4, 0.25, "sine", 0.05);
      for (let i = 0; i < 14; i++) tone(1700 + Math.random() * 900, 0.7 + i * 0.07, 0.07, "square", 0.025);
      noise(0.7, 1.0, 0.03, 1500);
    },
  };
  T.sfx = sfx;

  const cursor = document.createElement("span");
  cursor.className = "cur";

  // ---------- context handed to every scene ----------
  function mkctx(id) {
    const ctx = {
      THIRD, reduced, sfx, cursor, SPEED,
      sleep(ms) {
        return new Promise((res, rej) => setTimeout(() => (id === RUN ? res() : rej(STOP)), ms));
      },
      async type(el, text, speed) {
        if (speed === undefined) speed = SPEED;
        const t = document.createElement("span");
        el.appendChild(t); el.appendChild(cursor);
        if (!speed) { t.textContent = text; if (id !== RUN) throw STOP; return; }
        for (let i = 0; i < text.length; i++) {
          t.textContent += text[i];
          if (text[i] !== " " && i % 2 === 0) sfx.click();
          await ctx.sleep(speed);
        }
      },
      pointer(stage, cls) {
        const p = document.createElement("div");
        p.className = "ptr " + (cls || "");
        stage.appendChild(p);
        return {
          el: p,
          async to(target, ms) {
            ms = reduced ? 0 : (ms || 650);
            const s = stage.getBoundingClientRect(), r = target.getBoundingClientRect();
            p.style.transitionDuration = ms + "ms";
            p.style.left = (r.left - s.left + r.width / 2) + "px";
            p.style.top = (r.top - s.top + r.height / 2) + "px";
            await ctx.sleep(ms + 60);
          },
          async press() {
            p.classList.add("down"); sfx.click();
            await ctx.sleep(150);
            p.classList.remove("down");
          },
        };
      },
      refuse(el) {
        sfx.buzz();
        if (!el) return;
        el.classList.remove("nope"); void el.offsetWidth; el.classList.add("nope");
      },
    };
    return ctx;
  }

  // ---------- built-in video scene (for swapping a card to a real clip) ----------
  T.scenes.video = async (stage, card, ctx) => {
    stage.innerHTML = '<video class="v" playsinline muted autoplay></video>';
    const v = stage.querySelector("video");
    v.muted = minimized || userMuted;
    await new Promise((res) => { v.onended = res; v.onerror = res; v.src = card.video; });
    await ctx.sleep(0);
  };

  // ---------- window ----------
  let win, stage, btnMin, btnSnd;
  function minimize() {
    minimized = true;
    win.classList.add("min");
    btnMin.textContent = "[ ]";
    btnMin.setAttribute("aria-label", "Restore THIRD.EXE");
  }
  const SKIP_KEY = "third.skip";
  function skipSaved() { try { return localStorage.getItem(SKIP_KEY) === "1"; } catch (e) { return false; } }
  function saveSkip(on) {
    try { if (on) localStorage.setItem(SKIP_KEY, "1"); else localStorage.removeItem(SKIP_KEY); } catch (e) {}
  }
  function skip() {
    RUN++; // stops any running sequence at its next sleep
    mode = "rest";
    T.terminalRest(stage, (window.THIRD_CARDS || [])[0] || { a: "A", b: "B" });
    minimize();
  }
  function restore() {
    minimized = false;
    win.classList.remove("min");
    btnMin.textContent = "_";
    btnMin.setAttribute("aria-label", "Minimize THIRD.EXE");
  }

  async function glitch(ctx) {
    if (reduced) return;
    stage.classList.add("glitch");
    sfx.stat();
    try { await ctx.sleep(260); } finally { stage.classList.remove("glitch"); }
  }
  async function play(card, ctx, prev) {
    const name = card.video ? "video" : (card.scene && T.scenes[card.scene] ? card.scene : "terminal");
    if (prev && prev !== name) await glitch(ctx);
    stage.innerHTML = "";
    await T.scenes[name](stage, card, ctx);
    return name;
  }

  async function show() {
    if (mode !== "rest") return;
    const cards = window.THIRD_CARDS || [];
    if (!cards.length) return;
    mode = "show";
    const id = ++RUN;
    const ctx = mkctx(id);
    audio();
    try {
      await T.terminalBoot(stage, ctx);
      let prev = "terminal";
      for (const c of cards) prev = await play(c, ctx, prev);
      if (prev !== "terminal") await glitch(ctx);
      await T.terminalCloser(stage, ctx);
      await ctx.sleep(1500);
      minimize();
      mode = "loop";
      prev = "terminal";
      for (;;) { for (const c of cards) prev = await play(c, ctx, prev); }
    } catch (e) {
      if (e !== STOP) console.error(e);
    }
  }

  T.start = function () {
    win = document.getElementById("third");
    stage = document.getElementById("third-stage");
    btnMin = document.getElementById("third-min");
    btnSnd = document.getElementById("third-snd");
    const btnSkip = document.getElementById("third-skip");
    const nag = document.getElementById("third-nag");

    T.terminalRest(stage, (window.THIRD_CARDS || [])[0] || { a: "A", b: "B" });

    // While minimized, any tap restores (and replays if idle) and nothing inside reacts.
    win.addEventListener("click", (e) => {
      if (minimized) { e.stopPropagation(); e.preventDefault(); restore(); if (mode === "rest") show(); }
    }, true);
    btnSkip.addEventListener("click", (e) => { e.stopPropagation(); skip(); });
    nag.addEventListener("click", (e) => e.stopPropagation());
    nag.addEventListener("change", () => saveSkip(nag.checked));
    if (skipSaved()) { nag.checked = true; minimize(); }
    stage.addEventListener("click", () => { if (mode === "rest") show(); });
    btnMin.addEventListener("click", (e) => {
      e.stopPropagation();
      if (minimized) restore(); else minimize();
    });
    btnSnd.addEventListener("click", (e) => {
      e.stopPropagation();
      userMuted = !userMuted;
      btnSnd.textContent = userMuted ? "SOUND: OFF" : "SOUND: ON";
      btnSnd.setAttribute("aria-pressed", String(userMuted));
    });
    document.addEventListener("keydown", (e) => {
      if (e.target === btnMin || e.target === btnSnd || e.target === btnSkip || e.target === nag) return;
      if (e.key === "Escape") { if (minimized) restore(); else minimize(); return; }
      if (mode === "rest" && !minimized) show();
    });
  };
})();
