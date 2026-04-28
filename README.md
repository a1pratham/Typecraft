# TypeCraft ⌨️

A blazing fast, neon-dark typing test with deep analytics. No login. No backend. 100% frontend.

**Live demo:** `https://<your-username>.github.io/typecraft`

## Features

- **Modes:** Words, Quote, Code
- **Timed tests:** 15s / 30s / 60s / 120s
- **Word count tests:** 10 / 25 / 50 / 100 words
- **Live WPM + accuracy** while typing
- **Detailed results:** net WPM, raw WPM, accuracy, consistency, error count
- **WPM over time chart** (area chart)
- **Trouble keys analysis** — see which characters trip you up
- **Full history** — stored in localStorage, last 50 tests
- **Personal bests** tracked automatically
- **Keyboard shortcuts:** `Esc` to restart
- Fully responsive — works on mobile too

## Stack

- React 18 + Vite
- Recharts (for analytics charts)
- Framer Motion
- 100% CSS custom properties, no Tailwind, no UI lib

## Dev

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

See `.github/workflows/deploy.yml` — push to `main` and it auto-deploys.

---

*Made by Pratham with ♥*
