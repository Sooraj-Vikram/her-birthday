# The Secret Garden

Scaffold for the birthday bouquet website — React + Tailwind + Framer Motion, with the flower/memory data model built to hold any media type per flower.

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` — resize your browser to a phone width (or open on your actual phone via your local network) since this is built mobile-first.

## What's here

- `src/data/flowers.js` — all 7 flowers' content. This is the only file you need to touch to fill in real memories. Each flower's `memory.mediaType` can be `"photo"`, `"text"`, `"voice"`, or `"video"` — set whichever fits and fill the matching fields.
- `src/components/LoginGate.jsx` — the unlock screen. Change `SECRET_WORD` to whatever word/name you'll give her.
- `src/components/Flower.jsx` — a single flower: hold ~650ms to bloom. Placeholder SVG bloom — swap for illustrated watercolor art when ready.
- `src/components/Garden.jsx` — lays out all 7, tracks which are opened, unlocks flower 7 once the other six are open.
- `src/components/MemoryCard.jsx` / `MemoryContent.jsx` — the reveal card and its media renderer.
- `src/components/Ending.jsx` — closing message after all 7 are opened. Placeholder text — personalize this.
- `src/lib/supabaseClient.js` — not connected yet. Once you're ready for private photo/video storage, create a Supabase project, drop your keys into a `.env` file (see comments in the file), and this handles auth + signed URLs.

## Not done yet (by design — these are your creative calls)

- Real flower illustrations (currently simple placeholder SVG petals)
- Actual photos/quotes/voice notes/videos in `flowers.js`
- Supabase project connection for private media
- Background music toggle
- The physical bouquet card / QR code

## Deploying

Once you're happy with it locally: push to GitHub, connect the repo to [Vercel](https://vercel.com), and it deploys automatically. Add your Supabase env vars in Vercel's project settings before going live.
