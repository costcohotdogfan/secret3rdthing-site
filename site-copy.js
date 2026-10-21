// ===== PAGE COPY =====
// Words for the site live here. Same idea as cards.js.
// Tokens in [BRACKETS] need a real value from the studio. Do not invent
// brand names, numbers, or results to fill them.
//
// <title>, description, and social meta in each HTML file repeat the
// strings below so link previews work without JavaScript. Change both.
window.SITE_COPY = {
  studio: "SECRET 3RD THING",
  studioTitle: "Secret 3rd Thing",

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

  // Share card is share.png at the site root. Alt text stays a token until a real card exists.
  share: {
    file: "share.png",
    alt: "[SHARE IMAGE]",
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
