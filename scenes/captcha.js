// CAPTCHA: "Select all squares with your future." There are three squares.
(function () {
  const T = window.THIRD;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  T.scenes.captcha = async function (stage, card, ctx) {
    stage.innerHTML =
      '<div class="cp"><div class="cp-card">' +
      '<div class="cp-head"><small>Select all squares with</small><strong>your future</strong><small>If there are none, click skip</small></div>' +
      '<div class="cp-grid">' +
      '<div class="cp-tile cp-a" data-key="A"><span>' + esc(card.a) + '</span></div>' +
      '<div class="cp-tile cp-b" data-key="B"><span>' + esc(card.b) + '</span></div>' +
      '<div class="cp-tile cp-c" data-key="C"><span>' + esc(ctx.THIRD) + '</span></div>' +
      '</div>' +
      '<div class="cp-msg" aria-live="polite"></div>' +
      '<div class="cp-foot"><span class="cp-icons" aria-hidden="true">&#8635; &#9680; &#9432;</span><span class="cp-verify">VERIFY</span></div>' +
      '</div></div>';
    const cardEl = stage.querySelector(".cp-card");
    const [ta, tb, tc] = stage.querySelectorAll(".cp-tile");
    const msg = stage.querySelector(".cp-msg");
    const verify = stage.querySelector(".cp-verify");

    stage.querySelector(".cp-grid").addEventListener("click", (e) => {
      const t = e.target.closest(".cp-tile");
      if (!t || t.dataset.key === "C") return;
      msg.textContent = "Please try again.";
      ctx.refuse(t);
    });

    const p = ctx.pointer(stage, "ptr-arrow");
    await ctx.sleep(500);
    await p.to(ta);
    ta.classList.add("hov"); await ctx.sleep(500); ta.classList.remove("hov");
    await p.to(tb);
    tb.classList.add("hov"); await ctx.sleep(card.tempt ? 1500 : 500); tb.classList.remove("hov");
    await p.to(tc);
    await p.press();
    tc.classList.add("on");
    await ctx.sleep(450);
    await p.to(verify);
    await p.press();
    verify.classList.add("on");
    await ctx.sleep(300);

    cardEl.innerHTML =
      '<div class="cp-check"><span class="cp-box"></span><span>I\'m not a binary</span><span class="cp-brand">SECRET3RDTHING</span></div>';
    const box = cardEl.querySelector(".cp-box");
    await p.to(box, 500);
    await p.press();
    box.classList.add("done");
    ctx.sfx.chime();
    await ctx.sleep(1900);
  };
})();
