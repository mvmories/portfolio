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
    'heroTagline' | 'availabilityEnabled' | 'availabilityText' | 'cvEnabled' | 'cvUrl' | 'socials'
  >
> = {
  heroTagline: 'I build the platforms behind products used in 30 countries.',
  availabilityEnabled: true,
  availabilityText: 'Open to new opportunities',
  cvEnabled: true,
  cvUrl: 'https://drive.google.com/file/d/1UzYCsJGdeNB5LJ3TGRXbz9GtKPrSzdee/view?usp=share_link',
  socials: [
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/miguel-vilhena-215aa590/' },
    { platform: 'github', url: 'https://github.com/mvmories' },
  ],
}

// Fixed id: the singleton is always this document, so no ordering or filtering
// is needed and a stray second document could never be picked up by mistake.
const QUERY = `*[_id == "siteSettings"][0]{
  heroTagline, availabilityEnabled, availabilityText,
  cvEnabled, cvUrl, cvLabel, cvUpdatedAt, socials
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
