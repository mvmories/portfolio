import { z } from 'zod'

/**
 * Shape of a contact form submission.
 *
 * `website` is a honeypot: it is hidden from humans, so any value at all means
 * a bot filled it in. `elapsedMs` is how long the form was on screen before
 * submitting — humans take seconds, bots take milliseconds.
 */
export const contactSchema = z.object({
  name: z
    .string({ error: 'Please tell me your name.' })
    .trim()
    .min(2, 'Please tell me your name.')
    .max(80, 'That name is a little too long.'),
  email: z
    .string({ error: 'Please add your email address.' })
    .trim()
    .max(254)
    .email('That email address does not look right.'),
  message: z
    .string({ error: 'Please write a message.' })
    .trim()
    .min(10, 'Please write a slightly longer message.')
    .max(2000, 'Please keep it under 2000 characters.'),
  website: z.string().max(0).optional().default(''),
  elapsedMs: z.number().nonnegative().optional().default(0),
})

export type ContactInput = z.infer<typeof contactSchema>

/** Submissions faster than this are almost certainly automated. */
export const MIN_FILL_TIME_MS = 3000

/**
 * Escape a string for safe interpolation into HTML.
 * React Email escapes by default, but the plain-text and subject paths do not.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Strip CR/LF so user input can never inject extra email headers. */
export function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim()
}
