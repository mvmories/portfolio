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
| `npm run email:preview` | Render the email templates and open them in a browser |

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

## Contact form

The form POSTs to `/api/contact`, a Vercel serverless function. It:

1. rate-limits by IP (3 per 10 minutes),
2. validates with zod,
3. rejects bots via a honeypot field and a minimum fill time,
4. emails a notification to `CONTACT_TO_EMAIL` via Resend, with `reply_to` set
   to the visitor so replying from Gmail goes straight back to them,
5. sends the visitor a branded auto-reply,
6. optionally archives the submission in Sanity.

Steps 5 and 6 are best-effort — if they fail the visitor still gets a success
response, because their message did arrive.

`vite dev` serves `api/` through `vite-plugin-dev-api.ts`, so the endpoint works
locally without the Vercel CLI. Templates live in `emails/` and are ordinary
React components — run `npm run email:preview` to see them.

## Structure

```
src/
├── components/   Reusable UI (Navbar, NavigationDots, SocialMedia)
├── constants/    Local image barrel + section list
├── container/    Page sections (Header, About, Work, Skills, Testimonial, Footer)
├── lib/          Sanity client + helpers
├── types/        Sanity document interfaces
└── wrapper/      AppWrap / MotionWrap HOCs

api/              Vercel serverless functions (server-side, secrets live here)
├── _lib/         Validation + rate limiting (underscore = not a route)
└── contact.ts    POST /api/contact
emails/           React Email templates
```

Path alias: `@/` → `src/`.

## Content

Managed in the Sanity Studio under `../backend_sanity` (`npm run dev` there).
