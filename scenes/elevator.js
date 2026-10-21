// Elevator panel: up and down both fail. A sideways button opens in the wall.
(function () {
  const T = window.THIRD;

  T.scenes.elevator = async function (stage, card, ctx) {
    stage.innerHTML =
      '<div class="el"><div class="el-panel">' +
      '<div class="el-disp">--</div><div class="el-rows"></div>' +
      '<div class="el-plaque">CAPACITY: 2 OPTIONS</div>' +
      '</div></div>';
    const rowsEl = stage.querySelector(".el-rows");
    const disp = stage.querySelector(".el-disp");
    const plaque = stage.querySelector(".el-plaque");
    const mk = (key, glyph, label, hidden) => {
      const r = document.createElement("div");
      r.className = "el-row" + (hidden ? " el-hidden" : "");
      r.dataset.key = key;
      const l = document.createElement("span"); l.className = "el-label"; l.textContent = label;
      const b = document.createElement("span"); b.className = "el-btn"; b.textContent = glyph;
      r.append(l, b);
      rowsEl.appendChild(r);
      return { r, btn: b };
    };
    const A = mk("A", "\u25B2", card.a);
    const C = mk("C", "\u25B6", ctx.THIRD, true);
    const B = mk("B", "\u25BC", card.b);

    rowsEl.addEventListener("click", (e) => {
      const r = e.target.closest(".el-row");
      if (!r || r.dataset.key === "C") return;
      disp.textContent = "ERR";
      ctx.refuse(r.querySelector(".el-btn"));
    });

    const f = ctx.pointer(stage, "ptr-finger");
    async function fail(o, hold) {
      await f.to(o.btn);
      await f.press();
      o.btn.classList.add("lit");
      await ctx.sleep(hold);
      o.btn.classList.remove("lit");
      ctx.sfx.buzz();
      disp.textContent = "ERR";
      await ctx.sleep(600);
    }

    await ctx.sleep(500);
    await fail(A, 250);
    disp.textContent = "--";
    await fail(B, card.tempt ? 1200 : 250);
    await ctx.sleep(400);
    disp.textContent = "--";
    C.r.classList.remove("el-hidden");
    plaque.textContent = "CAPACITY: 3 OPTIONS";
    ctx.sfx.grind();
    await ctx.sleep(800);
    await f.to(C.btn);
    await f.press();
    C.btn.classList.add("lit");
    ctx.sfx.ding();
    disp.textContent = "\u2192";
    await ctx.sleep(450);
    disp.textContent = "\u2192 3";
    await ctx.sleep(1900);
  };
})();
