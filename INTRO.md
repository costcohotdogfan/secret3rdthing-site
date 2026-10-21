# THIRD.EXE intro: hand-off notes

The landing-page intro for secret3rdthing.com. It plays fullscreen, then minimizes into a small window in the bottom corner and keeps looping there while the site shows behind it. Tap the small window to bring it back.

## Files
- `cards.js`: the lines. **The only file to edit for new copy.** One entry per card.
- `third.js`: engine (window, minimize, sound, sequencing). Don't touch for copy changes.
- `third.css`: all intro styles. Everything is scoped under `#third`, plus scene classes `.t-`, `.sf-`, `.cp-`, `.el-`.
- `scenes/*.js`: one file per scene. Each registers itself on `THIRD.scenes`.
- `index.html`: demo host page. Copy the `<section id="third">` block, the font link, the stylesheet link and the script tags into the real landing page.

## Card options (in `cards.js`)
- `a`, `b`: the two options. The third is always SECRET THIRD THING.
- `scene`: `terminal` (default), `splitflap`, `captcha`, `elevator`.
- `tempt: true`: lingers on B before going third.
- `slow: true`: types the options very slowly (terminal only).
- `video: "clips/name.mp4"`: plays a real clip instead of a coded scene. This is how cards get upgraded to Seedance videos later. No other code changes needed.

## Adding a scene
Create `scenes/name.js` with `THIRD.scenes.name = async (stage, card, ctx) => { ... }`, add its script tag, then use `scene: "name"` in a card. Use `ctx.sleep(ms)` for every wait so the sequence can stop cleanly. `ctx.sfx`, `ctx.type`, `ctx.pointer` and `ctx.refuse` are there to reuse.

## Rules
- Script order matters: `cards.js`, `third.js`, the scenes, then `THIRD.start()`.
- Keep the intro's `z-index` (50) above the site's own header.
- Sound only starts after the visitor's first tap. That's a browser rule, not a bug.
