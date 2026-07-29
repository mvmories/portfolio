/**
 * Date formatting for the experience timeline.
 *
 * The previous data kept the date range inside the description prose
 * ("2015 - 2018 (3 years) - ..."), which meant the durations were hand-typed and
 * went stale - the current role still claimed the length it had when it was
 * written. Computing them from real dates keeps them honest.
 *
 * Nothing here throws. The values come from a CMS where a date can be missing or
 * malformed, and a bad date should cost a label, not the section.
 */

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

/** Parses `YYYY-MM-DD` without timezone shifting, which `new Date()` applies. */
function parse(value: string | undefined | null): { year: number; month: number } | null {
  if (!value || typeof value !== 'string') return null
  const match = /^(\d{4})-(\d{2})/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  if (!Number.isFinite(year) || month < 1 || month > 12) return null
  return { year, month }
}

export function formatMonthYear(value: string | undefined | null): string {
  const parsed = parse(value)
  if (!parsed) return ''
  return `${MONTHS[parsed.month - 1]} ${parsed.year}`
}

export function formatRange(
  startDate: string | undefined | null,
  endDate: string | undefined | null,
  current?: boolean
): string {
  const start = formatMonthYear(startDate)
  if (!start) return ''
  const end = current ? 'Present' : formatMonthYear(endDate)
  return end ? `${start} — ${end}` : start
}

/**
 * Whole months a role spanned, counting both the first and last month.
 *
 * `endDate` is the last month worked, not the month after leaving. This is the
 * convention Miguel's CV uses and the one LinkedIn displays: February 2015 to
 * January 2018 is three years, not two years eleven months. Counting the gap
 * between the dates instead would shave a month off every role.
 */
export function monthsBetween(
  startDate: string | undefined | null,
  endDate: string | undefined | null
): number | null {
  const start = parse(startDate)
  const end = parse(endDate)
  if (!start || !end) return null
  const months = (end.year - start.year) * 12 + (end.month - start.month) + 1
  return months > 0 ? months : null
}

export function formatDuration(
  startDate: string | undefined | null,
  endDate: string | undefined | null,
  current?: boolean,
  now: Date = new Date()
): string {
  const end = current
    ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    : endDate
  const months = monthsBetween(startDate, end)
  if (months === null) return ''

  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts: string[] = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`)
  return parts.join(' ')
}

/** Most recent first, with undated entries sorted last rather than dropped. */
export function byMostRecent<T extends { startDate?: string }>(a: T, b: T): number {
  const left = parse(a.startDate)
  const right = parse(b.startDate)
  if (!left && !right) return 0
  if (!left) return 1
  if (!right) return -1
  return right.year * 12 + right.month - (left.year * 12 + left.month)
}
