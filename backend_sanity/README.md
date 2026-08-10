# Sanity Studio

The CMS behind the portfolio. Content lives in the `production` dataset of
project `khsof0do`; the Studio is hosted at <https://mvmories.sanity.studio>.

## Editing content

Nothing here needs deploying. Open the hosted Studio, edit, publish. Every field
the site reads has a hardcoded fallback in `frontend_react/src/lib/`, so a
missing or half-filled document degrades rather than breaks.

## Changing the schema

Schema changes reach the hosted Studio through CI, not from your machine:
`.github/workflows/deploy-studio.yml` deploys on every push to `main` that
touches `backend_sanity/**`. So merge, don't deploy.

## Deploying locally

Rarely necessary, but if it is:

```sh
nvm use        # reads .nvmrc — Node 20
yarn deploy
```

The Node version is not optional. Sanity 3.9's CLI bundles a `yargs` shim that
throws `ReferenceError: require is not defined in ES module scope` under Node's
newer `require(esm)` handling, so anything from Node 22.12 upwards fails before
the command starts. `.nvmrc` pins the known-good version and the CI workflow
reads the same file, so both stay in step.

## Singletons

`siteSettings` and `aboutSection` are singletons: fixed document ids, pinned
above the divider in the desk, with create, delete, duplicate and unpublish
removed. See the `SINGLETONS` array in `sanity.config.ts`.
