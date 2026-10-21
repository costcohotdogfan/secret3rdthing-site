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
    footer.replaceChildren(el("div", {
      class: "site-footer-inner",
    }, el("p", { class: "footer-mark", text: COPY.studio }), footNav));
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
  }

  function caseRow(label, value) {
    return el("div", { class: "case-row" },
      el("div", { class: "case-label", text: label }),
      el("div", { class: "case-value", text: value })
    );
  }

  function renderHire() {
    const hire = COPY.hire;
    const pack = el("article", { class: "package" },
      el("p", { class: "kicker", text: hire.packageKicker }),
      el("h2", { text: hire.packageName }),
      el("p", { class: "price", text: "starting at $" + hire.price }),
      el("p", { text: hire.packageLine })
    );

    const cases = el("section", { class: "cases", "aria-label": hire.casesKicker },
      el("h2", { text: hire.casesKicker })
    );
    hire.cases.forEach(function (item, index) {
      cases.appendChild(el("article", { class: "case" },
        el("p", { class: "case-index", text: String(index + 1).padStart(2, "0") }),
        caseRow("BRAND", item.brand),
        caseRow("THE BRIEF", item.brief),
        caseRow("WHAT WE MADE", item.made),
        caseRow("RESULT", item.result)
      ));
    });

    const logos = el("ul", { class: "logo-strip" });
    hire.logos.forEach(function (slot) {
      logos.appendChild(el("li", { class: "logo-slot", text: slot }));
    });

    main.append(
      el("p", { class: "kicker", text: hire.kicker }),
      el("h1", { text: hire.offer }),
      pack,
      cases,
      el("section", { class: "logo-block", "aria-label": hire.logosKicker },
        el("h2", { text: hire.logosKicker }),
        logos
      ),
      el("p", { class: "contact" },
        el("a", { class: "btn", href: hire.contactHref, text: hire.contactLabel })
      )
    );
  }

  function isToken(value) {
    return typeof value !== "string" || value.charAt(0) === "[";
  }

  function embedUrl(short) {
    if (!short || isToken(short.id)) return "";
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
    const grid = el("div", { class: "shorts" });
    (watch.shorts || []).forEach(function (short) {
      const frame = el("div", { class: "short-frame" });
      const card = el("article", { class: "short" },
        el("h2", { text: short.title }),
        el("p", { class: "fine", text: String(short.platform || "").toUpperCase() }),
        frame
      );
      const src = embedUrl(short);
      if (!src) {
        frame.append(
          el("p", { class: "short-hold", text: short.id || "NO EMBED YET" }),
          el("p", { class: "fine", text: "NO EMBED YET" })
        );
      } else if ("IntersectionObserver" in window) {
        frame.appendChild(el("p", { class: "short-hold", text: short.title }));
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
    main.append(
      el("p", { class: "kicker", text: watch.kicker }),
      el("h1", { text: watch.heading }),
      el("p", { class: "lede", text: watch.dek }),
      grid
    );
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
      el("p", { class: "fine", text: play.emailNote }),
      el("p", { class: "fine", text: "Posts to " + play.endpoint + "." })
    );
  }

  const renderers = {
    home: renderHome,
    hire: renderHire,
    watch: renderWatch,
    play: renderPlay,
  };

  renderChrome();
  if (COPY && main && renderers[page]) renderers[page]();
})();
