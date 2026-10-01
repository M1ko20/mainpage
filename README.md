# Portfolio

Personal portfolio for a web designer & developer: a conversion-focused main page plus five fully built concept websites, each with its own identity, typography, layout, navigation and motion.

| Route | Concept |
| --- | --- |
| `/` | Main portfolio |
| `/portfolio/aurelis` | Aurelis — architecture & development (editorial, slow, serif) |
| `/portfolio/noir` | Noir — contemporary dining (dark, cinematic, parallax) |
| `/portfolio/nexora` | Nexora — AI infrastructure (SaaS, data viz, pricing) |
| `/portfolio/form-object` | Form / Object — creative studio (brutalist, cursor-led) |
| `/portfolio/alex-morgan` | Alex Morgan — strategy advisor (Swiss grid, typographic) |

## Personal details

Everything personal lives in **`src/data/profile.ts`** — name, role, email, phone, socials, bio, stack, experience, real projects, stats and testimonials. Anything left empty is hidden automatically; nothing is invented.

The main portfolio is in Czech (`lang="cs"`); the five concept sites stay in English and get `lang="en"` — each route's language is set in `seo.json`. Czech copy runs through `tie()` (`src/lib/czech.ts`), which keeps one-letter prepositions and dashes from dangling at line ends.

The site name and page titles live in **`src/data/seo.json`** (used by both the app and the build script). Update the name there too if you change it.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build & check

```bash
npm run build        # typecheck → Vite build → per-route HTML, 404, robots, sitemap
npm run lint
npx playwright install chromium   # once
npm run test:e2e     # serves dist/ like Netlify and runs the Playwright suite
```

`npm run build` produces a fully static, pre-rendered site:

1. `vite build` — the client bundle (each concept site is its own lazy chunk).
2. `vite build --ssr src/entry-server.tsx` — a throwaway server bundle.
3. `scripts/prerender.mjs` — renders every route with React to real HTML (content paints before JavaScript loads, then hydrates), gives each page its own title, description, Open Graph tags and canonical URL, links the route's own CSS/JS chunks, and writes `404.html`, `robots.txt` and — when the site URL is known — `sitemap.xml`.

Above-the-fold entrance animations are pure CSS (`.enter-*` in `src/styles/index.css`) so they start with the first paint; scroll-driven motion uses Motion. On Netlify the site URL is picked up automatically from the `URL` variable; elsewhere set `SITE_URL=https://your-domain.com`.

## Deploy to Netlify

1. Push the repository to GitHub / GitLab / Bitbucket.
2. In Netlify: **Add new site → Import an existing project** and pick the repository.
3. Netlify reads `netlify.toml` (build `npm run build`, publish `dist`, Node 22). Deploy.

Or from the CLI: `npx netlify-cli deploy --build --prod`.

Every route is a static file, so direct visits and refreshes work without rewrites, and unknown paths get a true 404.

## Deploy to GitHub Pages

`.github/workflows/pages.yml` builds and publishes `dist/` on every push to `main`. It sets `BASE_PATH` to the repository name and `SITE_URL` to the Pages URL, so assets, routes and share tags resolve under `https://<user>.github.io/<repo>/`. In the repository settings, **Pages → Source** must be **GitHub Actions**.

## Case-study screenshots

`public/work/*.jpg` are screenshots of the concept sites used on the homepage and as share images. Regenerate them after design changes:

```bash
npm run build && node scripts/serve-dist.mjs &   # serve the build
node scripts/capture-screens.mjs                # writes public/work/*
```

## Structure

```
src/
  components/home/     main portfolio sections
  components/shared/   Img (lazy, responsive, fail-safe), RevealText, Magnetic, TransitionLink, ConceptBar
  data/                profile.ts, projects.ts, content.ts, seo.json
  lib/                 page transitions, concept notices, SEO head sync, image URLs
  pages/               Home, NotFound
  projects/<slug>/     each concept site — own components, data and fonts (lazy-loaded chunk)
  entry-server.tsx     build-time renderer used by scripts/prerender.mjs
scripts/               prerender, serve-dist, capture-screens
tests/                 Playwright suite
```
