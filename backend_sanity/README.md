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

## Deploying locally — don't

`yarn deploy` fails on this machine with `ReferenceError: require is not defined
in ES module scope`, thrown from `node_modules/yargs/yargs`. The cause is a
packaging bug in yargs 17: its exports map points the `require` condition at an
extensionless CJS file inside a package declared `"type": "module"`, so once
Node gained `require(esm)` — backported to 20.19 and on by default from 22.12 —
Node parses that file as ESM and `require` is undefined. Every yargs 17.x
release including the latest has the same mapping, and yargs 18 is ESM-only, so
there is no version of this dependency to pin your way onto. Sanity reaches it
only from the deploy path, which is why every other `sanity` command works.

Use CI instead. It is not a workaround; it is the supported path, it deploys on
every merge, and it holds the auth token so no one needs deploy rights locally.

## Singletons

`siteSettings` and `aboutSection` are singletons: fixed document ids, pinned
above the divider in the desk, with create, delete, duplicate and unpublish
removed. See the `SINGLETONS` array in `sanity.config.ts`.
