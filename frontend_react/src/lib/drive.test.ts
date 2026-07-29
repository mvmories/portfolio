import { describe, it, expect } from 'vitest'
import { normalizeDriveUrl, extractDriveFileId, formatUpdatedAt } from './drive'

const FILE_ID = '1UzYCsJGdeNB5LJ3TGRXbz9GtKPrSzdee'

describe('extractDriveFileId', () => {
  it.each([
    [`https://drive.google.com/file/d/${FILE_ID}/view?usp=share_link`, FILE_ID],
    [`https://drive.google.com/file/d/${FILE_ID}/view`, FILE_ID],
    [`https://drive.google.com/open?id=${FILE_ID}`, FILE_ID],
    [`https://drive.google.com/uc?export=download&id=${FILE_ID}`, FILE_ID],
    [`https://docs.google.com/document/d/${FILE_ID}/edit`, FILE_ID],
  ])('extracts the id from %s', (url, expected) => {
    expect(extractDriveFileId(url)).toBe(expected)
  })

  it('returns null when there is no id', () => {
    expect(extractDriveFileId('https://example.com/cv.pdf')).toBeNull()
  })
})

describe('normalizeDriveUrl', () => {
  it('rebuilds canonical view and download links from a share link', () => {
    const result = normalizeDriveUrl(
      `https://drive.google.com/file/d/${FILE_ID}/view?usp=share_link`,
    )

    expect(result).toEqual({
      viewUrl: `https://drive.google.com/file/d/${FILE_ID}/view`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${FILE_ID}`,
      isDrive: true,
    })
  })

  it('exports Google Docs as PDF rather than using the streaming endpoint', () => {
    const result = normalizeDriveUrl(`https://docs.google.com/document/d/${FILE_ID}/edit`)

    expect(result?.downloadUrl).toBe(
      `https://docs.google.com/document/d/${FILE_ID}/export?format=pdf`,
    )
  })

  it('passes through an unrecognised https URL rather than discarding it', () => {
    const url = 'https://example.com/my-cv.pdf'
    expect(normalizeDriveUrl(url)).toEqual({
      viewUrl: url,
      downloadUrl: url,
      isDrive: false,
    })
  })

  it('strips tracking parameters from the rebuilt link', () => {
    const result = normalizeDriveUrl(
      `https://drive.google.com/file/d/${FILE_ID}/view?usp=sharing&utm_source=spam`,
    )
    expect(result?.viewUrl).not.toContain('utm_source')
  })

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['an empty string', ''],
    ['whitespace', '   '],
    ['a non-https URL', 'http://drive.google.com/file/d/abc/view'],
    ['a javascript: URL', 'javascript:alert(1)'],
  ])('returns null for %s', (_label, input) => {
    expect(normalizeDriveUrl(input as string)).toBeNull()
  })
})

describe('formatUpdatedAt', () => {
  it('formats a date as a human month and year', () => {
    expect(formatUpdatedAt('2026-07-15')).toBe('Updated July 2026')
  })

  it.each([[undefined], [null], [''], ['not-a-date']])('returns null for %s', (input) => {
    expect(formatUpdatedAt(input as string)).toBeNull()
  })
})
