// ===== THE ONLY FILE YOU NEED TO EDIT FOR NEW LINES =====
// a / b   : the two options. The third option is always SECRET THIRD THING.
// scene   : "terminal" (default), "splitflap", "captcha", "elevator"
// tempt   : true -> the cursor/finger lingers on B before going third
// slow    : true -> options type out painfully slowly (terminal only)
// video   : "clips/fight.mp4" -> plays this video instead of a coded scene
window.THIRD_CARDS = [
  { a: "RED PILL", b: "BLUE PILL" },
  { a: "FIGHT", b: "FLIGHT", scene: "splitflap" },
  { a: "BOAZ", b: "JACHIN" },
  { a: "AI WILL SAVE US", b: "AI WILL KILL US", scene: "captcha" },
  { a: "A $200M SUPERHERO MOVIE", b: "A GUY REACTING TO IT" },
  { a: "SIMULATION", b: "BASE REALITY", scene: "elevator", tempt: true },
  { a: "DOOMSCROLL", b: "TOUCH GRASS", tempt: true },
  { a: "A 4-HOUR PODCAST", b: "AN 8-SECOND CLIP", slow: true },
  { a: "CASTOR", b: "POLLUX" },
];

window.THIRD_CLOSER = [
  "> THE MIDDLE PATH IS NOT",
  "  THE MIDDLE OF THE LINE.",
  "",
  "> IT'S OFF THE LINE.",
];

window.THIRD_DOMAIN = "SECRET3RDTHING.CO";

// Payoff button under the final card.
window.THIRD_PLAY = {
  label: "Play Level 1 of Operation Little St. Nick — pay what you can",
  href: "play/",
};
