// Split-flap departures board. A and B get cancelled; the third thing boards.
(function () {
  const T = window.THIRD;
  const CH = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$-'.,?!";

  function tiles(parent, n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      const t = document.createElement("span");
      t.className = "sf-tile";
      t.textContent = " ";
      parent.appendChild(t);
      arr.push(t);
    }
    return arr;
  }
  function flip(t) { t.classList.remove("f"); void t.offsetWidth; t.classList.add("f"); }

  function flap(ctx, ts, text) {
    const s = text.toUpperCase().padEnd(ts.length, " ").slice(0, ts.length);
    return Promise.all(ts.map(async (t, i) => {
      const target = s[i];
      let ti = CH.indexOf(target);
      if (ti < 0) ti = 0;
      const steps = ctx.reduced || target === " " ? 0 : 4 + Math.floor(Math.random() * 9);
      await ctx.sleep(i * 30);
      for (let k = steps; k > 0; k--) {
        t.textContent = CH[(ti - k + CH.length * 4) % CH.length];
        flip(t);
        ctx.sfx.clack();
        await ctx.sleep(55);
      }
      t.textContent = target;
      flip(t);
    }));
  }

  T.scenes.splitflap = async function (stage, card, ctx) {
    const W = Math.min(24, Math.max(card.a.length, card.b.length, ctx.THIRD.length));
    stage.innerHTML =
      '<div class="sf" style="--n:' + (W + 2) + '">' +
      '<div class="sf-head"><span>DEPARTURES</span><span>GATE</span></div>' +
      '<div class="sf-rows"></div></div>';
    const rowsEl = stage.querySelector(".sf-rows");
    const mk = (key) => {
      const r = document.createElement("div"); r.className = "sf-row"; r.dataset.key = key;
      const dest = document.createElement("div"); dest.className = "sf-dest";
      const gate = document.createElement("div"); gate.className = "sf-gate";
      const st = document.createElement("div"); st.className = "sf-status";
      r.append(dest, gate, st);
      rowsEl.appendChild(r);
      return { r, dest: tiles(dest, W), gate: tiles(gate, 1), st };
    };
    const A = mk("A"), B = mk("B"), C = mk("C");

    rowsEl.addEventListener("click", (e) => {
      const r = e.target.closest(".sf-row");
      if (!r || r.dataset.key === "C") return;
      const o = r.dataset.key === "A" ? A : B;
      o.st.textContent = "NOT AN OPTION";
      o.st.className = "sf-status bad";
      ctx.refuse(r);
    });

    await ctx.sleep(300);
    await Promise.all([flap(ctx, A.dest, card.a), flap(ctx, A.gate, "A")]);
    A.st.textContent = "BOARDING";
    await Promise.all([flap(ctx, B.dest, card.b), flap(ctx, B.gate, "B")]);
    B.st.textContent = "BOARDING";
    await ctx.sleep(card.tempt ? 1600 : 800);
    A.st.textContent = "CANCELLED"; A.st.className = "sf-status bad"; ctx.sfx.buzz();
    await ctx.sleep(450);
    B.st.textContent = "CANCELLED"; B.st.className = "sf-status bad"; ctx.sfx.buzz();
    await ctx.sleep(600);
    await Promise.all([flap(ctx, C.dest, ctx.THIRD), flap(ctx, C.gate, "3")]);
    C.st.textContent = "NOW BOARDING"; C.st.className = "sf-status ok";
    ctx.sfx.chime();
    await ctx.sleep(1900);
  };
})();
