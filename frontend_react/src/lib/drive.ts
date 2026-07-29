/**
 * Google Drive share links come in several shapes depending on how they were
 * copied. Rather than requiring one exact format, the file id is extracted and
 * canonical links are rebuilt from it.
 *
 * Nothing here throws: an unrecognised URL is passed through untouched, so a
 * link this does not understand still works as an ordinary link.
 */

const FILE_ID_PATTERNS = [
  /\/file\/d\/([a-zA-Z0-9_-]+)/, // /file/d/<id>/view
  /\/document\/d\/([a-zA-Z0-9_-]+)/, // Docs
  /[?&]id=([a-zA-Z0-9_-]+)/, // open?id=<id>, uc?id=<id>
]

export interface DriveLinks {
  /** Opens Drive's preview UI. Best for "view my CV". */
  viewUrl: string
  /** Streams the file directly. Best for an explicit download action. */
  downloadUrl: string
  /** False when the URL was not recognised as Drive and was passed through. */
  isDrive: boolean
}

export function extractDriveFileId(url: string): string | null {
  for (const pattern of FILE_ID_PATTERNS) {
    const match = pattern.exec(url)
    if (match?.[1]) return match[1]
  }
  return null
}

export function normalizeDriveUrl(url: string | undefined | null): DriveLinks | null {
  if (!url || typeof url !== 'string') return null

  const trimmed = url.trim()
  if (!trimmed) return null

  // Anything non-https is rejected outright rather than upgraded, since a CV
  // link arriving over http suggests it was mistyped.
  if (!/^https:\/\//i.test(trimmed)) return null

  const id = extractDriveFileId(trimmed)

  if (!id) {
    return { viewUrl: trimmed, downloadUrl: trimmed, isDrive: false }
  }

  // Google Docs cannot be streamed by the uc endpoint; it exports instead.
  const isDoc = /\/document\/d\//.test(trimmed)

  return {
    viewUrl: isDoc
      ? `https://docs.google.com/document/d/${id}/view`
      : `https://drive.google.com/file/d/${id}/view`,
    downloadUrl: isDoc
      ? `https://docs.google.com/document/d/${id}/export?format=pdf`
      : `https://drive.google.com/uc?export=download&id=${id}`,
    isDrive: true,
  }
}

/** "Updated July 2026", or null when there is no usable date. */
export function formatUpdatedAt(value: string | undefined | null): string | null {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return `Updated ${new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(date)}`
}
