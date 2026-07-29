import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export interface ContactNotificationProps {
  name: string
  email: string
  message: string
  submittedAt: string
  sourceUrl?: string
}

const BRAND = '#313bac'
const INK = '#0b1020'
const MUTED = '#6b7688'
const LINE = '#e6e9f2'
const CANVAS = '#edf2f8'

export const ContactNotification = ({
  name,
  email,
  message,
  submittedAt,
  sourceUrl = 'https://miguelvilhena.com',
}: ContactNotificationProps) => (
  <Html lang='en'>
    <Head />
    <Preview>{`New message from ${name} — ${message.slice(0, 80)}`}</Preview>
    <Body style={body}>
      <Container style={container}>
        <Section style={header}>
          <Text style={headerKicker}>Portfolio · New enquiry</Text>
          <Heading style={headerTitle}>{name} got in touch</Heading>
        </Section>

        <Section style={card}>
          <table width='100%' cellPadding={0} cellSpacing={0} role='presentation'>
            <tbody>
              <tr>
                <td style={labelCell}>From</td>
                <td style={valueCell}>{name}</td>
              </tr>
              <tr>
                <td style={labelCell}>Email</td>
                <td style={valueCell}>
                  <Link href={`mailto:${email}`} style={link}>
                    {email}
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={labelCell}>Received</td>
                <td style={valueCell}>{submittedAt}</td>
              </tr>
            </tbody>
          </table>

          <Hr style={rule} />

          <Text style={messageLabel}>Message</Text>
          <Section style={quote}>
            {message.split('\n').map((line, i) => (
              <Text key={i} style={quoteText}>
                {line || '\u00A0'}
              </Text>
            ))}
          </Section>

          <Section style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link href={`mailto:${email}?subject=Re:%20your%20message`} style={button}>
              Reply to {name}
            </Link>
          </Section>
        </Section>

        <Text style={footer}>
          Sent from the contact form at{' '}
          <Link href={sourceUrl} style={footerLink}>
            {sourceUrl.replace(/^https?:\/\//, '')}
          </Link>
          . Just hit reply — it goes straight back to {name}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ContactNotification

const body: React.CSSProperties = {
  backgroundColor: CANVAS,
  fontFamily:
    "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '32px 12px',
}

const container: React.CSSProperties = { maxWidth: '560px', margin: '0 auto' }

const header: React.CSSProperties = {
  backgroundColor: BRAND,
  borderRadius: '16px 16px 0 0',
  padding: '32px 32px 28px',
}

const headerKicker: React.CSSProperties = {
  color: 'rgba(255,255,255,0.72)',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  margin: '0 0 6px',
}

const headerTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '26px',
  lineHeight: '1.25',
  fontWeight: 700,
  margin: 0,
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 16px 16px',
  padding: '28px 32px 32px',
}

const labelCell: React.CSSProperties = {
  color: MUTED,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '8px 16px 8px 0',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
  width: '92px',
}

const valueCell: React.CSSProperties = {
  color: INK,
  fontSize: '15px',
  fontWeight: 500,
  padding: '8px 0',
  verticalAlign: 'top',
}

const link: React.CSSProperties = { color: BRAND, textDecoration: 'none', fontWeight: 600 }

const rule: React.CSSProperties = { borderColor: LINE, margin: '24px 0' }

const messageLabel: React.CSSProperties = {
  color: MUTED,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  margin: '0 0 10px',
}

const quote: React.CSSProperties = {
  backgroundColor: CANVAS,
  borderLeft: `3px solid ${BRAND}`,
  borderRadius: '0 10px 10px 0',
  padding: '16px 20px',
}

const quoteText: React.CSSProperties = {
  color: INK,
  fontSize: '15px',
  lineHeight: '1.7',
  margin: 0,
  whiteSpace: 'pre-wrap',
}

const button: React.CSSProperties = {
  backgroundColor: BRAND,
  borderRadius: '10px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 700,
  padding: '13px 30px',
  textDecoration: 'none',
}

const footer: React.CSSProperties = {
  color: MUTED,
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '20px 8px 0',
  textAlign: 'center',
}

const footerLink: React.CSSProperties = { color: MUTED, textDecoration: 'underline' }
