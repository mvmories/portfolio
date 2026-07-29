import type { Config, Context } from '@netlify/functions'
import { Resend } from 'resend'
import { createClient } from '@sanity/client'

import { ContactNotification } from '../../emails/ContactNotification'
import { ContactAutoReply } from '../../emails/ContactAutoReply'
import { contactSchema, MIN_FILL_TIME_MS, sanitizeHeader } from '../../server/validation'
import { checkRateLimit } from '../../server/rate-limit'

const TO = () => process.env.CONTACT_TO_EMAIL || 'mvmories@gmail.com'
const FROM = () => process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>'
const SITE_URL = () => process.env.SITE_URL || 'https://miguelvilhena.com'

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })
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

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, { allow: 'POST' })
  }

  const to = TO()

  // context.ip is resolved by the platform, so it cannot be spoofed by simply
  // sending an X-Forwarded-For header the way a self-hosted setup can.
  const rate = checkRateLimit(context.ip || 'unknown')
  if (!rate.allowed) {
    return json(
      {
        error: `Too many messages. Please try again in ${Math.ceil(rate.retryAfterSeconds / 60)} minutes.`,
      },
      429,
      { 'retry-after': String(rate.retryAfterSeconds) },
    )
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Please check the form and try again.' }, 400)
  }

  const parsed = contactSchema.safeParse(payload ?? {})

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    // A filled honeypot lands here too — treat it as success so bots learn nothing.
    if (first?.path[0] === 'website') return json({ ok: true })
    return json(
      {
        error: first?.message ?? 'Please check the form and try again.',
        field: first?.path[0],
      },
      400,
    )
  }

  const { name, email, message, elapsedMs } = parsed.data

  // Submitted implausibly fast — almost certainly a bot. Silently accept.
  if (elapsedMs > 0 && elapsedMs < MIN_FILL_TIME_MS) {
    return json({ ok: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not configured')
    return json({ error: 'Email is not configured yet. Please email me directly.' }, 500)
  }

  const submittedAt = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Amsterdam',
  }).format(new Date())

  try {
    const resend = new Resend(apiKey)
    const from = FROM()

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio · ${sanitizeHeader(name)} got in touch`,
      react: ContactNotification({ name, email, message, submittedAt, sourceUrl: SITE_URL() }),
    })

    if (error) throw new Error(error.message)

    // Auto-reply and archiving are secondary — a failure must not tell the
    // visitor their message was lost, because it was not. They are still
    // logged, so a silently-broken auto-reply cannot go unnoticed.
    const [autoReply] = await Promise.allSettled([
      resend.emails.send({
        from,
        to: email,
        replyTo: to,
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

    return json({ ok: true })
  } catch (error) {
    console.error('[contact] send failed', error)
    return json({ error: `I could not send that right now. Please email me directly at ${to}.` }, 500)
  }
}

export const config: Config = {
  path: '/api/contact',
}
