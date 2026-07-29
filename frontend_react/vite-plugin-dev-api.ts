import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'
import { loadEnv } from 'vite'

/**
 * Serves the `api/` directory during `vite dev`.
 *
 * In production Vercel runs these files as serverless functions; locally there
 * is nothing to run them, so without this the contact form would only be
 * testable after deploying. The handlers are loaded through Vite's SSR module
 * graph so they hot-reload like the rest of the app.
 */
export function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      // Serverless handlers read process.env, not import.meta.env.
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))

      const apiDir = join(process.cwd(), 'api')
      let routes: string[] = []
      try {
        routes = readdirSync(apiDir)
          .filter((f) => /\.(ts|js)$/.test(f) && !f.startsWith('_'))
          .map((f) => f.replace(/\.(ts|js)$/, ''))
      } catch {
        return
      }

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const route = url.pathname.replace(/^\/api\//, '')

        if (!url.pathname.startsWith('/api/') || !routes.includes(route)) return next()

        try {
          const body = await readJsonBody(req)
          const mod = await server.ssrLoadModule(join(apiDir, `${route}.ts`))

          Object.assign(req, {
            body,
            query: Object.fromEntries(url.searchParams),
            cookies: {},
          })
          Object.assign(res, {
            status(code: number) {
              res.statusCode = code
              return res
            },
            json(payload: unknown) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(payload))
              return res
            },
            send(payload: unknown) {
              res.end(typeof payload === 'string' ? payload : JSON.stringify(payload))
              return res
            },
          })

          await mod.default(req, res)
        } catch (error) {
          server.ssrFixStacktrace(error as Error)
          console.error(`[dev-api] /api/${route} threw`, error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Dev API handler crashed. See the terminal.' }))
        }
      })
    },
  }
}

function readJsonBody(req: { on: (e: string, cb: (c?: unknown) => void) => void }) {
  return new Promise<unknown>((resolve) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(chunk as Buffer))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })
}
