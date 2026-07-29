import { formatUpdatedAt, normalizeDriveUrl } from '@/lib/drive'
import { useSiteSettings } from '@/lib/useSiteSettings'

export interface Cv {
  viewUrl: string
  downloadUrl: string
  label: string
  updated: string | null
  /** Label plus the last-updated date, for tooltips and aria-labels. */
  tooltip: string
}

/**
 * Resolves the CV into something renderable, or null when there is nothing
 * worth linking to. Returning null rather than an empty string means every
 * caller hides its button instead of rendering one that leads nowhere, and the
 * decision is made once instead of at each call site.
 */
export function useCv(): Cv | null {
  const { cvEnabled, cvUrl, cvLabel, cvUpdatedAt } = useSiteSettings()

  if (cvEnabled === false) return null

  const links = normalizeDriveUrl(cvUrl)
  if (!links) return null

  const label = cvLabel?.trim() || 'My CV'
  const updated = formatUpdatedAt(cvUpdatedAt)

  return {
    viewUrl: links.viewUrl,
    downloadUrl: links.downloadUrl,
    label,
    updated,
    tooltip: [label, updated].filter(Boolean).join(' · '),
  }
}
