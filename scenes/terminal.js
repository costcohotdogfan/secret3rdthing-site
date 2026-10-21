// Terminal scene: home base. Also owns the boot, closer, and resting frame.
(function () {
  const T = window.THIRD;

  function mount(stage) {
    stage.innerHTML = '<div class="t-wrap"><div class="t-term" role="log" aria-live="polite"></div></div>';
    return stage.querySelector(".t-term");
  }
  function line(term, cls) {
    const d = document.createElement("div");
    d.className = "t-line" + (cls ? " " + cls : "");
    term.appendChild(d);
    return d;
  }
  function row(term, key, rows) {
    const r = line(term, "t-row");
    r.dataset.key = key;
    r.tabIndex = 0;
    const k = document.createElement("span"); k.textContent = key + ")";
    const t = document.createElement("span");
    r.append(k, t);
    r.txt = t;
    rows.push(r);
    return r;
  }
  function sel(rows, r, cursor) {
    rows.forEach((x) => x.classList.remove("sel"));
    if (r) { r.classList.add("sel"); if (cursor) r.txt.appendChild(cursor); }
  }

  T.terminalRest = function (stage, card) {
    const term = mount(stage);
    line(term).textContent = "> SELECT ONE:";
    const rows = [];
    [["A", card.a], ["B", card.b], ["C", T.THIRD]].forEach(([k, t]) => { row(term, k, rows).txt.textContent = t; });
    sel(rows, rows[2]);
    line(term);
    line(term, "t-dim").textContent = "TAP TO BOOT";
  };

  T.terminalBoot = async function (stage, ctx) {
    const term = mount(stage);
    ctx.sfx.modem();
    const lines = [
      "SECRET3RDTHING BIOS V3.0",
      "MEMORY TEST... 640K OK",
      "SCANNING WORLD...",
      "TWO SIDES DETECTED.",
      "SEARCHING FOR A THIRD...",
    ];
    for (const l of lines) { await ctx.type(line(term), l, ctx.reduced ? 0 : 22); await ctx.sleep(260); }
    await ctx.sleep(500);
    await ctx.type(line(term), "FOUND.");
    ctx.sfx.beep();
    await ctx.sleep(1000);
  };

  T.scenes.terminal = async function (stage, card, ctx) {
    const term = mount(stage);
    const rows = [];
    let refused = false;
    term.addEventListener("click", (e) => {
      const r = e.target.closest(".t-row");
      if (!r || r.dataset.key === "C" || rows.length < 3) return;
      refused = true;
      ctx.sfx.buzz();
      if (!term.querySelector(".t-invalid")) line(term, "t-dim t-invalid").textContent = "INVALID SELECTION.";
      sel(rows, rows[2], ctx.cursor);
    });

    await ctx.type(line(term), "> SELECT ONE:");
    await ctx.sleep(250);
    for (const [k, t] of [["A", card.a], ["B", card.b], ["C", ctx.THIRD]]) {
      const r = row(term, k, rows);
      await ctx.type(r.txt, t, card.slow && k !== "C" && !ctx.reduced ? 140 : ctx.SPEED);
      await ctx.sleep(120);
    }
    await ctx.sleep(450);
    if (!refused) { sel(rows, rows[0], ctx.cursor); ctx.sfx.click(); await ctx.sleep(650); }
    if (!refused) {
      sel(rows, rows[1], ctx.cursor); ctx.sfx.click();
      if (card.tempt) {
        rows[1].classList.add("shake");
        await ctx.sleep(1700);
        rows[1].classList.remove("shake");
      } else {
        await ctx.sleep(650);
      }
    }
    sel(rows, rows[2], ctx.cursor);
    ctx.sfx.beep();
    await ctx.sleep(1150);
  };

  T.terminalCloser = async function (stage, ctx) {
    const term = mount(stage);
    for (const l of window.THIRD_CLOSER || []) {
      const d = line(term);
      if (l) await ctx.type(d, l, ctx.reduced ? 0 : 70);
      await ctx.sleep(l ? 700 : 300);
    }
    await ctx.sleep(600);
    await ctx.type(line(term), "> " + ctx.THIRD, ctx.reduced ? 0 : 90);
    await ctx.sleep(3000);
    const t2 = mount(stage);
    await ctx.type(line(t2, "t-big"), window.THIRD_DOMAIN || "SECRET3RDTHING.CO", ctx.reduced ? 0 : 60);
    ctx.sfx.beep();
    const play = window.THIRD_PLAY;
    if (play && play.label) {
      await ctx.sleep(700);
      line(t2);
      const a = document.createElement("a");
      a.className = "t-play";
      a.href = play.href || "#play";
      a.textContent = play.label;
      line(t2).appendChild(a);
      ctx.sfx.chime();
      await ctx.sleep(5500);
    }
  };
})();
