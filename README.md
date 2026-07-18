# Colson Knight — Creative Systems

An interactive one-page portfolio for creative coding, AI tooling, and generative interface work. The hero combines a lightweight canvas growth system with a static art-directed fallback, keeping the composition responsive and accessible across desktop, touch, and reduced-motion settings.

## Structure

- `public/portfolio/` — the canonical no-build website
- `docs/` — GitHub Pages-ready copy
- `app/` — the hosted wrapper and metadata

## Publish through GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**.
4. Select the `main` branch and `/docs` folder.

All paths are relative, so the site works from a user site or a project-repository subpath.

## Add project links

The first version uses expandable case-study summaries rather than invented URLs. When individual projects are public, add their links in `public/portfolio/index.html`, then copy the updated portfolio files into `docs/`.

## Local development

```bash
npm run dev
```
