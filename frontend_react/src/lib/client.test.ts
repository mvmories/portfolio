import { describe, it, expect, vi } from 'vitest'

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

  /**
   * SocialMedia is rendered by AppWrap, which wraps every section, so the site
   * settings singleton was fetched six times on every page load, and skills
   * twice. Deduplication is the fix, so it is worth a test.
   */
  it('issues one request when the same query is asked for concurrently', async () => {
    const { client, safeFetch } = await import('./client')

    const query = '*[_type == "deduplicated"]'
    // `client.fetch` is overloaded and its declared return type describes the raw
    // response envelope, so the resolved value needs a cast to be mocked.
    const fetchSpy = vi.spyOn(client, 'fetch').mockResolvedValue(['once'] as never)

    const results = await Promise.all([
      safeFetch(query, []),
      safeFetch(query, []),
      safeFetch(query, []),
    ])

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(results).toEqual([['once'], ['once'], ['once']])

    fetchSpy.mockRestore()
  })

  /**
   * A cached rejection would leave a section stuck on its fallback for the rest
   * of the session, so failures must not be retained.
   */
  it('does not cache a failed query', async () => {
    const { client, safeFetch } = await import('./client')

    const query = '*[_type == "transientlyBroken"]'
    const fetchSpy = vi
      .spyOn(client, 'fetch')
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(['recovered'] as never)

    expect(await safeFetch(query, ['fallback'])).toEqual(['fallback'])
    expect(await safeFetch(query, ['fallback'])).toEqual(['recovered'])
    expect(fetchSpy).toHaveBeenCalledTimes(2)

    fetchSpy.mockRestore()
  })
})
