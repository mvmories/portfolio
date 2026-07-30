import { describe, expect, it } from 'vitest'

import { FALLBACK_ABOUT, resolveAboutSection } from '@/lib/useAboutSection'

describe('resolveAboutSection', () => {
  it('uses the fallback when the singleton does not exist yet', () => {
    expect(resolveAboutSection(null)).toEqual(FALLBACK_ABOUT)
  })

  it('prefers published copy over the fallback', () => {
    const resolved = resolveAboutSection({
      narrative: 'Published narrative.',
      stats: [{ value: '5', label: 'things' }],
    })

    expect(resolved.narrative).toBe('Published narrative.')
    expect(resolved.stats).toEqual([{ value: '5', label: 'things' }])
  })

  // A singleton is half-filled for as long as it is being edited, so a blank
  // field must not be able to take the rest of the section down with it.
  it('falls back per field rather than per document', () => {
    const resolved = resolveAboutSection({
      narrative: '   ',
      stats: [{ value: '5', label: 'things' }],
    })

    expect(resolved.narrative).toBe(FALLBACK_ABOUT.narrative)
    expect(resolved.stats).toEqual([{ value: '5', label: 'things' }])
  })

  it('treats an empty stats array as unset', () => {
    expect(resolveAboutSection({ stats: [] }).stats).toEqual(FALLBACK_ABOUT.stats)
  })

  it('names the person when no portrait alt text is published', () => {
    expect(resolveAboutSection({}).portraitAlt).toBe('Miguel Vilhena')
  })
})
