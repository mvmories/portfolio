# Portfolio — Frontend

React 18 + TypeScript + Vite single-page portfolio, with content served from Sanity.

## Requirements

- Node **>= 20.19** (see `.nvmrc` / `engines`)

## Setup

```bash
npm install
cp .env.example .env.local   # already contains the public Sanity project id
npm run dev                  # http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only, no emit |
| `npm run lint` / `lint:fix` | ESLint (flat config) |
| `npm run format` | Prettier |
| `npm test` / `test:watch` | Vitest + Testing Library |

## Environment variables

Anything prefixed `VITE_` is **inlined into the public bundle**. Never put a
secret behind that prefix.

| Variable | Where | Notes |
|---|---|---|
| `VITE_SANITY_PROJECT_ID` | client | public |
| `VITE_SANITY_DATASET` | client | public, defaults to `production` |
| `SANITY_WRITE_TOKEN` | server only | used by `/api/*`, never exposed |
| `RESEND_API_KEY` | server only | transactional email |

The `production` dataset is public-read, so the browser makes **no**
authenticated requests. All writes go through serverless functions.

## Structure

```
src/
├── components/   Reusable UI (Navbar, NavigationDots, SocialMedia)
├── constants/    Local image barrel + section list
├── container/    Page sections (Header, About, Work, Skills, Testimonial, Footer)
├── lib/          Sanity client + helpers
├── types/        Sanity document interfaces
└── wrapper/      AppWrap / MotionWrap HOCs
```

Path alias: `@/` → `src/`.

## Content

Managed in the Sanity Studio under `../backend_sanity` (`npm run dev` there).
