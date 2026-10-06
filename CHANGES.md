# Lofyg bug-fix pass

Replace these files in the repo with the ones in this folder (same names).

## Do these by hand
1. **Delete `smartPlaylist.js`** from the repo. `index.html` no longer loads it; it overwrote the player's start-up function and crashed the homepage player.
2. **Add a real `preview.jpg`** (about 1200x630) at the site root. The share tags now point at `bleumino.github.io/Lofyg/preview.jpg`.
3. **Check one track ID in `endless-vibes.js`: `4ewLbD2ksKAU`.** It has 12 characters, so one is extra. I can't tell which; the player skips it for now.

## What changed
- **Players (`app.js`, `Stillwaves.js`, `endless-vibes.js`, `video-game-lofi.js`, `lofi-girl-stream.js`)**
  - Only one YouTube player is ever created (the start-up callback could fire twice).
  - Space bar and the Play button now ask the player what it is doing instead of tracking a flag, so Space works and can pause.
    On the homepage and Stillwaves, Space previously threw an error because that code sat outside the closure that owns `player`.
    On the 24h radio and video-game pages Space was registered twice and cancelled itself out.
  - Fixed "Notification is not defined" crash on browsers without the API (e.g. Safari on iPhone). The permission prompt now appears after the first click instead of on page load.
  - The vinyl only spins while playing (it used to spin all the time).
  - 5 malformed video IDs repaired (`?` and `/` removed); typo "ollow Knight" fixed.
  - "Surprise Me" now respects the selected mood; an empty mood no longer wipes the playlist.
  - Removed the 2-second auto-reload on the 24h radio page (it could reload forever on slow connections).
  - Removed dead/broken code that ran outside the closures; titles with "&" no longer show as "&amp;".
- **Pomodoro (`pomodoro.js`, `pomodoro timer.html`)**
  - Timer counts real elapsed time (sleep/throttling no longer stretches a session); per-tick console logging removed.
  - Uploaded backgrounds are shrunk before saving (large photos used to fail silently); removed a dead duplicate YouTube loader; fixed typos in mood buttons ("Ultimate Study", "Last-minute cram session").
  - Left alone on purpose: one unclosed `<div id="timer-wrapper">` (closing it could move the mascot layout).
- **HTML pages**
  - Homepage: stray "Mastodon" text removed (`<a>` in `<head>` became `<link rel="me">`).
  - Footer now inside `<body>` on all station pages; stray/missing tags fixed on Endless Vibes and the 24h radio page.
  - Share tags point to `bleumino.github.io`; footer links open in a new tab safely; logo has alt text; the 🍅 link no longer overlaps the theme button; footer year updated; junk class names removed from `license.html`.
- **CSS (`app.css`, `cossy-lofi.css`)**
  - Dark mode now works in October, December and February (seasonal themes no longer override it).
  - Logo keeps its proportions instead of being squashed to 60x60; broken `*` comment fixed.
- **Other**: `sitemap.xml` now lists the real pages; `SECURITY.md` filled in; the pink vinyl image is cropped square and sharper.

## Not touched yet (next round)
Phone layout (there are no `@media` queries), reduced-motion, colour contrast, the licence wording, merging the five players into one shared script, and the 30-minute "current time" notification on the Pomodoro page.
