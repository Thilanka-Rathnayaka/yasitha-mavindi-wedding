# Mavindi & Yasitha — Wedding Invitation Website

## Folder structure
```
├── index.html
└── Assets/
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

## To go live
1. Keep this exact folder structure — `index.html` must stay in the same
   folder as `Assets/`, since it links to `Assets/css/style.css` and
   `Assets/js/main.js` with relative paths.
2. Add your song file: place an MP3 named **`wedding-song.mp3`** directly
   inside this same top-level folder (next to `index.html`). The player is
   already wired to look for that exact filename. Use a track you have the
   rights to use — Anthropic/Claude can't supply copyrighted music.
3. Upload the whole folder as-is to your host (Netlify, Vercel, GitHub Pages,
   or your own web server all work with this structure unchanged).

## What's inside
- **Envelope intro** — sealed envelope on load; tapping the wax seal plays
  the opening animation and reveals the site.
- **Background music** — starts muted on load, unmutes on first tap/scroll/key
  press (browsers block audible autoplay without a user gesture — this is
  the closest thing to true autoplay that's technically possible).
- **Floating petals, hearts, and butterflies** — decorative animated layer,
  automatically disabled for visitors with "reduce motion" accessibility
  settings turned on.
- **Countdown, RSVP, and details sections** — see `index.html` for content
  and `Assets/js/main.js` for the countdown/RSVP logic.

## Editing
- Colors, fonts, and all styling live in `Assets/css/style.css`
  (the `:root` block near the top has the color palette as CSS variables).
- All interactive behavior (countdown, RSVP link, envelope, music, floating
  animation) lives in `Assets/js/main.js`.
- Wedding content/text lives directly in `index.html`.
