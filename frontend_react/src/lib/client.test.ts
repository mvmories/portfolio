import { describe, it, expect } from 'vitest'

/**
 * The whole app died in production because VITE_SANITY_PROJECT_ID was unset at
 * build time: createClient throws when it is missing, and it runs at module
 * scope, so the failure was total rather than confined to one section.
 */
describe('sanity client', () => {
  it('constructs even when no environment variables are set', async () => {
    const { client } = await import('./client')

    expect(client.config().projectId).toBeTruthy()
    expect(client.config().dataset).toBe('production')
  })

  it('never ships a token to the browser', async () => {
    const { client } = await import('./client')

    expect(client.config().token).toBeUndefined()
  })

  it('safeFetch returns the fallback instead of throwing', async () => {
    const { safeFetch } = await import('./client')

    const fallback = [{ id: 'fallback' }]
    const result = await safeFetch('*[_type == "definitelyNotAType"', fallback)

    expect(result).toEqual(fallback)
  })
})
