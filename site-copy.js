// ===== PAGE COPY =====
// Words for the site live here. Same idea as cards.js.
//
// A value that is empty, or a whole token matching [LIKE THIS], is unfilled.
// Unfilled sections are not drawn: the hire price line, each case-study
// block, the case-study heading when every block is unfilled, the logo
// strip, and any watch short that has no real id. If every short is
// unfilled, the grid is skipped and watch.empty is shown instead.
// The contact button and the forms always render, even while their
// endpoint is still a token. Do not invent brand names, numbers, or results.
//
// Social cards need an absolute image URL. baseUrl is that origin.
// Crawlers do not run JavaScript, so og:image and twitter:image in each
// HTML file are written out as baseUrl + share.file. Change baseUrl here
// and those two tags in index.html, hire/, watch/, play/, and submit/
// if the origin moves.
//
// <title> and description in each HTML file repeat the strings below.
// Change both.
window.SITE_COPY = {
  studio: "SECRET 3RD THING",
  studioTitle: "Secret 3rd Thing",

  // Change this if the public origin is not the custom domain yet.
  baseUrl: "https://secret3rdthing.co/",

  doors: [
    { id: "play", label: "PLAY", href: "play/", line: "Level 1." },
    { id: "watch", label: "WATCH", href: "watch/", line: "The shorts." },
    { id: "hire", label: "HIRE", href: "hire/", line: "Brand work." },
  ],

  home: {
    lede: "Two-person game studio and content shop.",
    title: "Secret 3rd Thing",
    description: "Two-person game studio and content shop. Three doors: play, watch, or hire.",
  },

  share: {
    file: "share.png",
    alt: "A and B are blank. C) SECRET THIRD THING.",
  },

  hire: {
    kicker: "HIRE",
    title: "Hire — Secret 3rd Thing",
    description: "You have two options. We make the third one.",
    offer: "You have two options. We make the third one.",
    packageKicker: "THE PACKAGE",
    packageName: "3 shorts in 10 days",
    // Rendered as "starting at $[PRICE]".
    price: "[PRICE]",
    packageLine: "For one brand. Three shorts. Ten days.",
    casesKicker: "CASE STUDIES",
    cases: [
      { brand: "[BRAND 1]", brief: "[BRIEF 1]", made: "[WHAT WE MADE 1]", result: "[RESULT 1]" },
      { brand: "[BRAND 2]", brief: "[BRIEF 2]", made: "[WHAT WE MADE 2]", result: "[RESULT 2]" },
      { brand: "[BRAND 3]", brief: "[BRIEF 3]", made: "[WHAT WE MADE 3]", result: "[RESULT 3]" },
    ],
    logosKicker: "PAST CLIENTS",
    logos: ["[LOGO 1]", "[LOGO 2]", "[LOGO 3]", "[LOGO 4]"],
    contactLabel: "SEND THE BRIEF",
    // One contact. mailto:[EMAIL], or replace this whole string with a [BOOKING LINK].
    contactHref: "mailto:[EMAIL]",
    // contactHref: "[BOOKING LINK]",
  },

  watch: {
    kicker: "SHORTS",
    heading: "WATCH",
    title: "Watch — Secret 3rd Thing",
    description: "Shorts from Secret 3rd Thing. Newest first.",
    dek: "Newest first.",
    empty: "First shorts drop soon. Follow along.",
    // Newest first. Put a new short at the top of this list.
    shorts: [
      { title: "[SHORT 1]", platform: "youtube", id: "[YOUTUBE_ID_1]" },
      { title: "[SHORT 2]", platform: "tiktok", id: "[TIKTOK_ID_1]" },
    ],
  },

  play: {
    kicker: "PLAY",
    heading: "Operation Little St. Nick",
    level: "Level 1",
    price: "Pay what you can",
    playLabel: "PLAY",
    playHref: "#play",
    emailLabel: "Email",
    emailButton: "SEND",
    emailNote: "For the next level.",
    endpoint: "[EMAIL_SERVICE_ENDPOINT]",
    title: "Play — Secret 3rd Thing",
    description: "Operation Little St. Nick. Level 1. Pay what you can.",
  },

  submit: {
    showOnHome: true,
    homeLine: "Give us your A and B.",
    kicker: "A AND B",
    heading: "Give us your A and B. We'll make the third thing.",
    credit: "The best submissions become intro cards and shorts, with credit.",
    endpoint: "[FORM_ENDPOINT]",
    aLabel: "A",
    bLabel: "B",
    creditLabel: "Name or handle, optional",
    button: "SEND IT",
    title: "Give us your A and B — Secret 3rd Thing",
    description: "Give us your A and B. We'll make the third thing.",
  },
};
