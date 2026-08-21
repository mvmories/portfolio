# miguelvilhena.com

## Project context

A personal portfolio and two long-form case studies, live at
[miguelvilhena.com](https://miguelvilhena.com). It is not a demo: it is the site
its owner uses to get hired and to win freelance work, so correctness of claims
matters as much as correctness of code.

All content is served from a Sanity CMS, and the repository holds both halves:
the React site in `frontend_react/` and the Studio and schemas in
`backend_sanity/`. The site is mature and shipping. Prefer surgical changes over
rewrites.

## Tech stack

**`frontend_react/`** (npm, Node >= 20.19)

- React 18.3, TypeScript 5.9 (strict, project references)
- Vite 6 with three HTML entry points, Sass for styling
- Framer Motion 11 for section transitions, WebGL2 for the hero point cloud
- `@sanity/client` 6 for content, Netlify Functions (`.mts`) for the server side
- Vitest 2 with Testing Library, ESLint 9 flat config, Prettier

**`backend_sanity/`** (yarn 1, Node 22)

- Sanity 6, `@sanity/orderable-document-list` for drag ordering

## Project structure

```
frontend_react/
  index.html, powerbyjs.html, factory.html   Three Vite entry points, not one
  netlify.toml            Build, functions and redirect config. Base dir is this folder
  scripts/                Generators: cv.mjs, og-image.mjs, optimize-images.mjs
  netlify/functions/      Server-side code: contact.mts, cv.mts, and __tests__/
  src/
    container/            Page sections: Header, About, Experience, Work, Testimonial, Footer
    components/           Reusable UI: Navbar, QuoteCard, ParticlePortrait, ThemeToggle
    caseStudy/            The two standalone case studies and their own entry points
    lib/                  Sanity client, data hooks, and every fallback constant
    wrapper/              AppWrap and MotionWrap, applied to every section
    constants/            Static, non-CMS data
    styles/               _tokens.scss, mixins, global
    test/                 Vitest setup
    types/                Sanity document types
backend_sanity/
  schemas/                Document and field definitions, with editorial guidance
  sanity.config.ts
.github/workflows/
  deploy-studio.yml       The only path by which schema changes reach production
```

When the directory structure changes, update this section.

## Non-negotiable invariants

These are the rules that break production or break trust if ignored.

1. **Every Sanity field the site reads must have a hardcoded fallback** in
   `src/lib/` (see `FALLBACK_SETTINGS` in `useSiteSettings.ts`). Publishing is
   never a prerequisite for the page to look right. A new field and its fallback
   belong in the same commit.
2. **Schema changes reach the hosted Studio only via
   `.github/workflows/deploy-studio.yml` on merge to `main`.** `yarn deploy` is
   broken locally. Batch schema changes and flag them rather than assuming they
   are live.
3. **Never put a secret behind a `VITE_` prefix.** That prefix inlines the value
   into the browser bundle. `RESEND_API_KEY` and `SANITY_WRITE_TOKEN` are
   server-only.
4. **The SPA fallback in `netlify.toml` must stay last**, or it shadows the
   function routes. It also means a missing file answers `200 text/html` rather
   than 404, so verify content type as well as status when checking any URL.

## Coding practices

### Style and structure

- TypeScript strict throughout. Prefer inference; annotate exported boundaries.
- Function components with hooks. No classes.
- Import from `@/`, the alias for `src/`. Avoid `../../` chains.
- Named exports for utilities and types; default export for components.
- Guard clauses and early returns over nested conditionals.
- Prettier config is authoritative: no semicolons, single quotes including JSX,
  100-column width, ES5 trailing commas. Do not hand-format against it.

### Comments

This codebase comments **why, not what**, and does it well. Match that. A comment
should record a decision, a constraint or a trap that a future reader would
otherwise have to rediscover. Do not narrate code that already reads clearly, and
do not remove an existing explanatory comment while editing around it.

### Naming

- Containers and components: `Name/Name.tsx` with a sibling `Name.scss`.
- Hooks: `useThing.ts` in `src/lib/`, colocated with `useThing.test.ts`.
- CSS classes follow the existing `app__block-element` convention.
- Netlify Functions use the `.mts` extension and declare their own route with
  `export const config = { path }`.

## Styling

- **Components reference semantic tokens only** (`--surface`, `--text-muted`,
  `--border`), never primitives (`--brand-700`, `--neutral-200`). That
  separation is what makes dark mode a remap rather than a rewrite of every
  stylesheet. Primitives are defined once in `src/styles/_tokens.scss`.
- Type scale and spacing come from tokens and are fluid via `clamp()`. Do not
  add per-section font-size media queries.
- Theme is `[data-theme]` on the root, with
  `:root:not([data-theme])` honouring `prefers-color-scheme` so an explicit
  toggle wins.

## Motion and accessibility

- Every section is wrapped in `AppWrap` and `MotionWrap`; those handle entrance
  animation and reduced motion, so individual sections should not add their own.
- Respect `usePrefersReducedMotion` and `@media (prefers-reduced-motion: reduce)`
  for anything that animates. The hero point cloud, the availability pulse and
  the section transitions all already do.
- Semantic HTML first, ARIA only where semantics fall short. One `h1` per page.
- WebGL and JS-dependent visuals need a real fallback: the hero renders a
  photograph when WebGL2 is unavailable.

## Testing

- Vitest with Testing Library. Tests in `src/` are colocated as `*.test.ts` or
  `*.test.tsx` beside the code they cover. Netlify Function tests live in
  `netlify/functions/__tests__/`.
- Test behaviour through the public surface, not implementation details.
- When a data hook is tested, cover both the populated and the fallback path,
  because the fallback path is a production path, not an edge case.

Verification, from `frontend_react/`:

```bash
npm run typecheck && npm run lint && npx vitest run && npm run build
```

## Writing copy

Copy on this site is held to the same bar as the code, because unevidenced
claims are what make a portfolio read as inflated.

- **No em dashes.** Use commas, colons or hyphens.
- **No number or superlative without a source that can be defended out loud.**
  Prefer a specific, checkable claim over an impressive vague one.
- Past tense for past roles, first person or no person, never third.
- Testimonials are **verbatim only**. Clipping with an ellipsis is fine;
  rewording is not, and fragments may not be reordered.
- Prefer showing the evidence next to the claim rather than asserting and
  linking elsewhere.

## Core principles

1. **The floor matters more than the ceiling.** A portfolio is judged on its
   weakest visible element, so curation and consistency beat one impressive
   feature.
2. **Degrade, never break.** Missing content, no WebGL, no JS and reduced motion
   are all supported paths with real fallbacks.
3. **One source of truth per fact.** Content lives in Sanity, tokens live in
   `_tokens.scss`, CV wording lives in `scripts/cv/content.mjs`. Duplicating a
   fact across surfaces is how they drift.
4. **Verify, do not assume.** Anything the site links to gets checked for status
   *and* content type before it is called done.
