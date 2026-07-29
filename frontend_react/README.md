# Portfolio — Frontend

React 18 + TypeScript + Vite single-page portfolio, with content served from Sanity.

## Requirements

- Node **>= 20.19** (see `.nvmrc` / `engines`)

## Setup

```bash
npm install
cp .env.example .env         # already contains the public Sanity project id
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
| `SANITY_WRITE_TOKEN` | server only | used by the Netlify function, never exposed |
| `RESEND_API_KEY` | server only | transactional email |

The `production` dataset is public-read, so the browser makes **no**
authenticated requests. All writes go through serverless functions.

## Contact form

The form POSTs to `/api/contact`, a Netlify Function. It:

1. rate-limits by IP (3 per 10 minutes), keyed on `context.ip` so it cannot
   be spoofed with a forged `X-Forwarded-For` header,
2. validates with zod,
3. rejects bots via a honeypot field and a minimum fill time,
4. emails a notification to `CONTACT_TO_EMAIL` via Resend, with `reply_to` set
   to the visitor so replying from Gmail goes straight back to them,
5. sends the visitor a branded auto-reply,
6. optionally archives the submission in Sanity.

Steps 5 and 6 are best-effort — if they fail the visitor still gets a success
response, because their message did arrive.

`npm run dev` runs the function for real: `@netlify/vite-plugin` emulates the
Netlify platform inside the Vite dev server, so functions, redirects and headers
behave locally as they do in production — no Netlify CLI needed. Secrets are
loaded from `.env` into `process.env` by a small plugin in `vite.config.ts`,
because the emulator only sources variables from a linked site.

Templates live in `emails/` and are ordinary React components — run
`npm run email:preview` to see them.

## Structure

```
src/
├── components/   Reusable UI (Navbar, NavigationDots, SocialMedia)
├── constants/    Local image barrel + section list
├── container/    Page sections (Header, About, Work, Skills, Testimonial, Footer)
├── lib/          Sanity client + helpers
├── types/        Sanity document interfaces
└── wrapper/      AppWrap / MotionWrap HOCs

netlify/
└── functions/    Netlify Functions. Routes are declared in each file's
                  `export const config`, not by filename.
    └── contact.mts   POST /api/contact
server/           Server-only helpers (validation, rate limiting). Deliberately
                  outside netlify/functions so nothing here is mistaken for a
                  deployable function.
emails/           React Email templates
```

Path alias: `@/` → `src/`.

## Content

Managed in the Sanity Studio under `../backend_sanity` (`npm run dev` there).
