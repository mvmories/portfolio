# miguelvilhena.com

Source for **[miguelvilhena.com](https://miguelvilhena.com)**: a personal
portfolio and two long-form case studies, with all content served from Sanity.

Two packages, deployed independently:

| Package | What it is | Deployed to |
|---|---|---|
| [`frontend_react/`](frontend_react/README.md) | React 18 + TypeScript + Vite site and Netlify Functions | [miguelvilhena.com](https://miguelvilhena.com), via Netlify |
| [`backend_sanity/`](backend_sanity/README.md) | Sanity Studio and the schemas | [mvmories.sanity.studio](https://mvmories.sanity.studio), via GitHub Actions |

**Each package's README is the authority for its own setup, scripts and
environment variables.** This file covers only what is true at the repository
level: how the two fit together, and how each reaches production.

## Quick start

```bash
# The site
cd frontend_react
npm install
cp .env.example .env      # already contains the public Sanity project id
npm run dev               # http://localhost:3000

# The Studio, only needed when changing schemas
cd backend_sanity
corepack enable && yarn install --frozen-lockfile
yarn dev                  # Sanity prints the local Studio URL
```

Node **>= 20.19** for the frontend (`frontend_react/.nvmrc` pins `20.19.0`) and
Node **22** for the Studio (`backend_sanity/.nvmrc`). Netlify builds the
frontend on 22, which satisfies the same `engines` range.

## How each half reaches production

### The site

Netlify builds from `frontend_react/`, and **its "Base directory" setting must
be `frontend_react`**. The config lives at `frontend_react/netlify.toml` rather
than the repository root because the Netlify Vite plugin resolves `base`
relative to Vite's working directory, so a root-level config would resolve to
`frontend_react/frontend_react` and break local dev.

Two things there are easy to break and worth knowing before editing:

- **There are three HTML entry points**, not one: `index.html`,
  `powerbyjs.html` and `factory.html`. They build to `dist/*.html`, which
  Netlify serves at `/powerbyjs` and `/factory` in preference to the SPA
  rewrite, because a non-forced redirect cannot shadow a file that exists. This
  keeps each case study out of the home page bundle and out of the other's.
- **The SPA fallback must stay last** in `netlify.toml`, or it will shadow the
  function routes. Functions declare their own paths via
  `export const config = { path }`, so they need no redirect entry.

One consequence worth remembering when verifying anything: because of that
catch-all, **a missing file answers `200 text/html` with the SPA rather than
404**. Always check the content type, not just the status code.

### The Studio

**Schema changes reach the hosted Studio through CI only.**
`.github/workflows/deploy-studio.yml` runs on every push to `main` that touches
`backend_sanity/**`, so *merge, do not deploy*. Running `yarn deploy` locally
fails on a yargs 17 packaging bug; `backend_sanity/README.md` has the full
diagnosis.

Editing *content* needs no deploy at all. Open the hosted Studio, edit, publish.

## Content, and why the site never waits on the CMS

Every field the site reads has a hardcoded fallback in `frontend_react/src/lib/`
(`useSiteSettings`, `useAboutSection`, `useSkills`, and so on). A missing or
half-filled document degrades rather than breaks, and publishing is never a
prerequisite for the page to look right. **Keep it that way:** a new Sanity
field needs a fallback in the same commit.

## Repository secrets

| Secret | Used by | Description | How to get it |
|---|---|---|---|
| `SANITY_AUTH_TOKEN` | `.github/workflows/deploy-studio.yml` | Deploys the Studio bundle to `mvmories.sanity.studio`. Needs the **Deploy Studio** role only: it can neither read nor write content. | [Sanity → Project `khsof0do` → API → Tokens](https://www.sanity.io/manage/project/khsof0do/api) → Add API token → role *Deploy Studio* |

Everything else is a Netlify environment variable rather than a GitHub secret,
because it is needed at build and request time rather than in CI. See
`frontend_react/.env.example` for the full list and which of them are public.

> `RESEND_API_KEY` and `SANITY_WRITE_TOKEN` are server-only and must never
> appear behind a `VITE_` prefix, which would inline them into the browser
> bundle. Netlify's secrets scanner is deliberately scoped to keys rather than
> paths in `netlify.toml` so that it still catches them.

## Verification

Run from `frontend_react/`:

```bash
npm run typecheck
npm run lint
npx vitest run
npm run build
```

## Licence

The code is available to read. The written content, photography, case studies
and personal brand are not licensed for reuse.
