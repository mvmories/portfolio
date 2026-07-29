import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@react-email/render'
import { describe, expect, it } from 'vitest'

import { ContactNotification } from './ContactNotification'
import { ContactAutoReply } from './ContactAutoReply'

const SAMPLE = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message:
    'Hi Miguel,\n\nI came across your portfolio and I loved the work on the analytical engine.\n\nAre you open to a chat next week?',
  submittedAt: 'Wednesday, 29 July 2026 at 18:30',
}

const OUT = join(process.cwd(), '.email-previews')

describe('email templates', () => {
  it('renders the notification with all the submitted details', async () => {
    const html = await render(ContactNotification(SAMPLE))

    expect(html).toContain('Ada Lovelace')
    expect(html).toContain('ada@example.com')
    expect(html).toContain('analytical engine')
    expect(html).toContain('Wednesday, 29 July 2026')
    // Brand colour survives the render.
    expect(html.toLowerCase()).toContain('#313bac')

    mkdirSync(OUT, { recursive: true })
    writeFileSync(join(OUT, 'notification.html'), html)
  })

  it('renders a plain-text alternative', async () => {
    const text = await render(ContactNotification(SAMPLE), { plainText: true })

    expect(text).toContain('Ada Lovelace')
    expect(text).toContain('analytical engine')
    expect(text).not.toContain('<div')
  })

  it('renders the auto-reply addressed to the sender', async () => {
    const html = await render(ContactAutoReply({ name: SAMPLE.name, message: SAMPLE.message }))

    expect(html).toContain('Ada Lovelace')
    expect(html).toContain('analytical engine')
    expect(html).toContain('github.com/mvmories')

    mkdirSync(OUT, { recursive: true })
    writeFileSync(join(OUT, 'auto-reply.html'), html)
  })

  it('escapes HTML in user input rather than rendering it', async () => {
    const html = await render(
      ContactAutoReply({ name: '<script>alert(1)</script>', message: 'hi there friend' })
    )

    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
