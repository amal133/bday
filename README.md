# A birthday universe for Avanthika

A complete, responsive birthday greeting built with HTML, CSS, and JavaScript. No build step or installation is needed.

## Preview

Open `index.html` in a browser. Click **Open your surprise**, look for the three clickable stars around the cake, and blow out the candle with the microphone or the tap fallback. The microphone is optional; browsers generally require HTTPS or localhost to grant microphone access.

## Personalize

Avanthika's name and the birthday wish are in `index.html` in the birthday heading and the `.letter-message` paragraph. The small hidden notes are the `data-note` values on the three `.secret-star` buttons in the same file. The final bonus note is in the `.gift-note` paragraph.

## Share

Upload the contents of this folder to a static host such as GitHub Pages, Netlify, or Cloudflare Pages, then send the resulting HTTPS link. Keep `index.html`, `style.css`, and `script.js` together in the published folder. The fonts load from Google Fonts when online; the page has no other external runtime dependencies.
