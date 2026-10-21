// Renders chrome and page bodies from site-copy.js.
(function () {
  const COPY = window.SITE_COPY;
  const main = document.querySelector("[data-page-main]");
  const header = document.querySelector("[data-chrome='header']");
  const footer = document.querySelector("[data-chrome='footer']");
  const root = document.body ? (document.body.getAttribute("data-root") || "") : "";
  const page = document.body ? (document.body.getAttribute("data-page") || "") : "";

  function el(tag, attrs) {
    const node = document.createElement(tag);
    const opts = attrs || {};
    Object.keys(opts).forEach(function (key) {
      const value = opts[key];
      if (value == null || value === false) return;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, String(value));
    });
    for (let i = 2; i < arguments.length; i++) {
      if (arguments[i]) node.appendChild(arguments[i]);
    }
    return node;
  }

  function doorLink(door) {
    const link = el("a", { href: root + door.href, text: door.label });
    if (door.id === page) link.setAttribute("aria-current", "page");
    return link;
  }

  function renderChrome() {
    if (!COPY || !header || !footer) return;
    const brand = el("a", { class: "brand", href: root + "index.html", text: COPY.studio });
    if (page === "home") brand.setAttribute("aria-current", "page");
    const nav = el("nav", { class: "nav", "aria-label": "Doors" });
    (COPY.doors || []).forEach(function (door) { nav.appendChild(doorLink(door)); });
    header.replaceChildren(el("div", { class: "site-header-inner" }, brand, nav));

    const footNav = el("nav", { class: "nav", "aria-label": "Doors again" });
    (COPY.doors || []).forEach(function (door) { footNav.appendChild(doorLink(door)); });
    const extra = (COPY.submit && COPY.submit.showOnHome)
      ? el("a", { class: "submit-link", href: root + "submit/", text: COPY.submit.homeLine })
      : null;
    if (extra && page === "submit") extra.setAttribute("aria-current", "page");
    footer.replaceChildren(el("div", {
      class: "site-footer-inner",
    }, el("p", { class: "footer-mark", text: COPY.studio }), footNav, extra));
  }

  function renderHome() {
    const doors = el("nav", { class: "doors", "aria-label": "Three doors" });
    (COPY.doors || []).forEach(function (door, index) {
      const link = el("a", { class: "door", href: root + door.href });
      link.append(
        el("span", { class: "door-index", text: String(index + 1).padStart(2, "0") }),
        el("span", { class: "door-label", text: door.label }),
        el("span", { class: "door-line", text: door.line || "" })
      );
      doors.appendChild(link);
    });
    main.append(
      el("h1", { text: COPY.studio }),
      el("p", { class: "lede", text: COPY.home.lede }),
      doors
    );
    if (COPY.submit && COPY.submit.showOnHome) {
      main.appendChild(el("p", { class: "home-submit" },
        el("a", { href: root + "submit/", text: COPY.submit.homeLine })
      ));
    }
  }

  function caseRow(label, value) {
    return el("div", { class: "case-row" },
      el("div", { class: "case-label", text: label }),
      el("div", { class: "case-value", text: value })
    );
  }

  function isBlank(value) {
    if (value == null) return true;
    const text = String(value).trim();
    return text === "" || /^\[.*\]$/.test(text);
  }

  function renderHire() {
    const hire = COPY.hire;
    const pack = el("article", { class: "package" });
    if (!isBlank(hire.packageKicker)) pack.appendChild(el("p", { class: "kicker", text: hire.packageKicker }));
    if (!isBlank(hire.packageName)) pack.appendChild(el("h2", { text: hire.packageName }));
    if (!isBlank(hire.price)) pack.appendChild(el("p", { class: "price", text: "starting at $" + hire.price }));
    if (!isBlank(hire.packageLine)) pack.appendChild(el("p", { text: hire.packageLine }));

    const blocks = [];
    (hire.cases || []).forEach(function (item, index) {
      const rows = [
        ["BRAND", item.brand],
        ["THE BRIEF", item.brief],
        ["WHAT WE MADE", item.made],
        ["RESULT", item.result],
      ].filter(function (pair) { return !isBlank(pair[1]); });
      if (!rows.length) return;
      const article = el("article", { class: "case" },
        el("p", { class: "case-index", text: String(index + 1).padStart(2, "0") })
      );
      rows.forEach(function (pair) { article.appendChild(caseRow(pair[0], pair[1])); });
      blocks.push(article);
    });

    const logos = (hire.logos || []).filter(function (slot) { return !isBlank(slot); });
    main.append(
      el("p", { class: "kicker", text: hire.kicker }),
      el("h1", { text: hire.offer }),
      pack
    );
    if (blocks.length) {
      const cases = el("section", { class: "cases", "aria-label": hire.casesKicker },
        el("h2", { text: hire.casesKicker })
      );
      blocks.forEach(function (block) { cases.appendChild(block); });
      main.appendChild(cases);
    }
    if (logos.length) {
      const list = el("ul", { class: "logo-strip" });
      logos.forEach(function (slot) { list.appendChild(el("li", { class: "logo-slot", text: slot })); });
      main.appendChild(el("section", { class: "logo-block", "aria-label": hire.logosKicker },
        el("h2", { text: hire.logosKicker }),
        list
      ));
    }
    main.appendChild(el("p", { class: "contact" },
      el("a", { class: "btn", href: hire.contactHref, text: hire.contactLabel })
    ));
  }

  function embedUrl(short) {
    if (!short || isBlank(short.id)) return "";
    if (short.platform === "tiktok") return "https://www.tiktok.com/embed/v2/" + encodeURIComponent(short.id);
    if (short.platform === "youtube") return "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(short.id);
    return "";
  }

  function mountEmbed(frame, short) {
    const src = embedUrl(short);
    if (!src) return;
    const iframe = el("iframe", {
      src: src,
      title: short.title,
      loading: "lazy",
      allow: "fullscreen; picture-in-picture; encrypted-media",
      referrerpolicy: "strict-origin-when-cross-origin",
    });
    iframe.setAttribute("allowfullscreen", "");
    frame.replaceChildren(iframe);
  }

  function renderWatch() {
    const watch = COPY.watch;
    const shorts = (watch.shorts || []).filter(function (short) { return !isBlank(short.id); });
    main.append(
      el("p", { class: "kicker", text: watch.kicker }),
      el("h1", { text: watch.heading })
    );
    if (!shorts.length) {
      main.appendChild(el("p", { class: "lede", text: watch.empty }));
      return;
    }
    const grid = el("div", { class: "shorts" });
    shorts.forEach(function (short) {
      const frame = el("div", { class: "short-frame" });
      const card = el("article", { class: "short" });
      if (!isBlank(short.title)) card.appendChild(el("h2", { text: short.title }));
      if (!isBlank(short.platform)) card.appendChild(el("p", { class: "fine", text: String(short.platform).toUpperCase() }));
      card.appendChild(frame);
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
          if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
          observer.disconnect();
          mountEmbed(frame, short);
        }, { rootMargin: "200px 0px" });
        observer.observe(card);
      } else {
        mountEmbed(frame, short);
      }
      grid.appendChild(card);
    });
    if (!isBlank(watch.dek)) main.appendChild(el("p", { class: "lede", text: watch.dek }));
    main.appendChild(grid);
  }

  function renderPlay() {
    const play = COPY.play;
    const input = el("input", {
      class: "field",
      id: "play-email",
      type: "email",
      name: "email",
      required: "required",
      autocomplete: "email",
      inputmode: "email",
      placeholder: "EMAIL",
    });
    const form = el("form", { class: "capture", method: "POST", action: play.endpoint },
      el("label", { for: "play-email", text: play.emailLabel }),
      input,
      el("button", { class: "btn", type: "submit", text: play.emailButton })
    );
    main.append(
      el("p", { class: "kicker", text: play.kicker }),
      el("h1", { text: play.heading }),
      el("p", { text: play.level }),
      el("p", { class: "price", text: play.price }),
      el("div", { class: "play-row", id: "play" },
        el("a", { class: "btn", href: play.playHref, text: play.playLabel }),
        form
      ),
      el("p", { class: "fine", text: play.emailNote })
    );
    if (!isBlank(play.endpoint)) {
      main.appendChild(el("p", { class: "fine", text: "Posts to " + play.endpoint + "." }));
    }
  }

  function binaryField(id, label, name, required) {
    const input = el("input", {
      class: "field",
      id: id,
      name: name,
      type: "text",
      maxlength: "160",
      autocomplete: name === "credit" ? "nickname" : "off",
    });
    if (required) input.setAttribute("required", "");
    return el("label", { class: "binary-field", for: id },
      el("span", { text: label }),
      input
    );
  }

  function renderSubmit() {
    const submit = COPY.submit;
    const form = el("form", { class: "binary", method: "POST", action: submit.endpoint },
      binaryField("bin-a", submit.aLabel, "a", true),
      binaryField("bin-b", submit.bLabel, "b", true),
      binaryField("bin-credit", submit.creditLabel, "credit", false),
      el("button", { class: "btn", type: "submit", text: submit.button })
    );
    main.append(
      el("p", { class: "kicker", text: submit.kicker }),
      el("h1", { text: submit.heading }),
      el("p", { class: "lede", text: submit.credit }),
      form
    );
    if (!isBlank(submit.endpoint)) {
      main.appendChild(el("p", { class: "fine", text: "Posts to " + submit.endpoint + "." }));
    }
  }

  const renderers = {
    home: renderHome,
    hire: renderHire,
    watch: renderWatch,
    play: renderPlay,
    submit: renderSubmit,
  };

  renderChrome();
  if (COPY && main && renderers[page]) renderers[page]();
})();
