# Brazil Economy

Next.js dashboard of Brazilian economic indicators (BCB, IBGE, Ipeadata, Comex Stat, brapi).

## Publishing on GitHub Pages
1. `npm run export` – fetches fresh data, builds, and writes the static site to `docs/`.
2. Commit and push `docs/`.
3. In the repo: Settings → Pages → Deploy from a branch → `main` / `/docs`.

Site URL: https://pablost1.github.io/brazil-economy/

Data is fetched at build time, so re-run `npm run export` to refresh it.
`data/petrobras-results.json` is hand-entered (currently up to FY2025).
