import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { createClient } from '@sanity/client'

import { ContactNotification } from '../emails/ContactNotification'
import { ContactAutoReply } from '../emails/ContactAutoReply'
import { contactSchema, MIN_FILL_TIME_MS, sanitizeHeader } from './_lib/validation'
import { checkRateLimit } from './_lib/rate-limit'

const TO = process.env.CONTACT_TO_EMAIL || 'mvmories@gmail.com'
const FROM = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>'
const SITE_URL = process.env.SITE_URL || 'https://miguelvilhena.com'

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return raw?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
}

/** Best-effort audit copy in Sanity. Never allowed to fail the request. */
async function archiveInSanity(data: { name: string; email: string; message: string }) {
  const token = process.env.SANITY_WRITE_TOKEN
  const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID

  if (!token || !projectId) return

  try {
    const sanity = createClient({
      projectId,
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })
    await sanity.create({ _type: 'contact', ...data })
  } catch (error) {
    console.error('[contact] sanity archive failed', error)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rate = checkRateLimit(clientIp(req))
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds))
    return res.status(429).json({
      error: `Too many messages. Please try again in ${Math.ceil(rate.retryAfterSeconds / 60)} minutes.`,
    })
  }

  const parsed = contactSchema.safeParse(req.body ?? {})

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    // A filled honeypot lands here too — treat it as success so bots learn nothing.
    if (first?.path[0] === 'website') return res.status(200).json({ ok: true })
    return res.status(400).json({
      error: first?.message ?? 'Please check the form and try again.',
      field: first?.path[0],
    })
  }

  const { name, email, message, elapsedMs } = parsed.data

  // Submitted implausibly fast — almost certainly a bot. Silently accept.
  if (elapsedMs > 0 && elapsedMs < MIN_FILL_TIME_MS) {
    return res.status(200).json({ ok: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not configured')
    return res.status(500).json({ error: 'Email is not configured yet. Please email me directly.' })
  }

  const submittedAt = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Amsterdam',
  }).format(new Date())

  try {
    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Portfolio · ${sanitizeHeader(name)} got in touch`,
      react: ContactNotification({ name, email, message, submittedAt, sourceUrl: SITE_URL }),
    })

    if (error) throw new Error(error.message)

    // Auto-reply and archiving are secondary — a failure must not tell the
    // visitor their message was lost, because it was not. They are still
    // logged, so a silently-broken auto-reply cannot go unnoticed.
    const [autoReply] = await Promise.allSettled([
      resend.emails.send({
        from: FROM,
        to: email,
        replyTo: TO,
        subject: 'Thanks for getting in touch',
        react: ContactAutoReply({ name, message }),
      }),
      archiveInSanity({ name, email, message }),
    ])

    // Resend reports API failures in the resolved value rather than throwing,
    // so a fulfilled promise is not on its own proof of delivery.
    // archiveInSanity logs its own failures.
    if (autoReply.status === 'rejected') {
      console.error('[contact] auto-reply failed', autoReply.reason)
    } else if (autoReply.value.error) {
      console.error('[contact] auto-reply rejected by Resend', autoReply.value.error)
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('[contact] send failed', error)
    return res.status(500).json({
      error: 'I could not send that right now. Please email me directly at ' + TO + '.',
    })
  }
}
