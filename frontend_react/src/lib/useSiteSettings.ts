import { useEffect, useState } from 'react'

import { safeFetch } from '@/lib/client'
import type { SiteSettings, SocialLink } from '@/types/sanity'

/**
 * Used until the Sanity singleton is populated, and whenever a field is left
 * blank. Keeping real values here means the site behaves identically before and
 * after the CMS is filled in, so publishing is never a prerequisite for the
 * page to look right.
 */
export const FALLBACK_SETTINGS: Required<
  Pick<
    SiteSettings,
    | 'heroTagline'
    | 'availabilityEnabled'
    | 'availabilityText'
    | 'cvEnabled'
    | 'cvUrl'
    | 'contactNote'
    | 'socials'
  >
> = {
  heroTagline: 'I take products from a blank page to 30 countries.',
  availabilityEnabled: true,
  availabilityText: 'Open to new opportunities',
  cvEnabled: true,
  contactNote:
    "Open to permanent roles, and to freelance or advisory work alongside one. I read every message myself, and I'll tell you straight if I'm not the right fit.",
  cvUrl: 'https://miguelvilhena.com/cv.pdf',
  socials: [
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/mvmories/' },
    { platform: 'github', url: 'https://github.com/mvmories' },
  ],
}

// Fixed id: the singleton is always this document, so no ordering or filtering
// is needed and a stray second document could never be picked up by mistake.
const QUERY = `*[_id == "siteSettings"][0]{
  heroTagline, availabilityEnabled, availabilityText,
  cvEnabled, cvUrl, cvLabel, cvUpdatedAt, contactNote, calUrl, socials
}`

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(() => ({
    _type: 'siteSettings',
    ...FALLBACK_SETTINGS,
  }))

  useEffect(() => {
    let cancelled = false

    safeFetch<SiteSettings | null>(QUERY, null).then((data) => {
      if (cancelled || !data) return

      setSettings({
        _type: 'siteSettings',
        heroTagline: data.heroTagline?.trim() || FALLBACK_SETTINGS.heroTagline,
        availabilityEnabled: data.availabilityEnabled ?? FALLBACK_SETTINGS.availabilityEnabled,
        availabilityText: data.availabilityText?.trim() || FALLBACK_SETTINGS.availabilityText,
        cvEnabled: data.cvEnabled ?? FALLBACK_SETTINGS.cvEnabled,
        cvUrl: data.cvUrl || FALLBACK_SETTINGS.cvUrl,
        cvLabel: data.cvLabel,
        cvUpdatedAt: data.cvUpdatedAt,
        contactNote: data.contactNote?.trim() || FALLBACK_SETTINGS.contactNote,
        // No fallback: an invented booking link is worse than none, so the
        // secondary action stays hidden until a real one is published.
        calUrl: data.calUrl?.trim() || undefined,
        socials: data.socials?.length ? data.socials : FALLBACK_SETTINGS.socials,
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

  return settings
}

export type { SocialLink }
