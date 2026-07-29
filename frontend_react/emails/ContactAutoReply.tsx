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

export interface ContactAutoReplyProps {
  name: string
  message: string
}

const BRAND = '#313bac'
const INK = '#0b1020'
const MUTED = '#6b7688'
const LINE = '#e6e9f2'
const CANVAS = '#edf2f8'

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/miguel-vilhena-215aa590/' },
  { label: 'GitHub', href: 'https://github.com/mvmories' },
  { label: 'Portfolio', href: 'https://miguelvilhena.com' },
]

export const ContactAutoReply = ({ name, message }: ContactAutoReplyProps) => (
  <Html lang='en'>
    <Head />
    <Preview>Thanks for reaching out — I&apos;ll be in touch shortly.</Preview>
    <Body style={body}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>Thanks, {name}!</Heading>
          <Text style={headerSub}>Your message landed safely.</Text>
        </Section>

        <Section style={card}>
          <Text style={paragraph}>
            I read everything that comes through personally and usually reply within{' '}
            <strong style={{ color: INK }}>1–2 working days</strong>. If it&apos;s urgent, just
            reply to this email and it will come straight to me.
          </Text>

          <Hr style={rule} />

          <Text style={label}>What you sent</Text>
          <Section style={quote}>
            {message.split('\n').map((line, i) => (
              <Text key={i} style={quoteText}>
                {line || '\u00A0'}
              </Text>
            ))}
          </Section>

          <Hr style={rule} />

          <Text style={label}>In the meantime</Text>
          <Text style={paragraph}>
            {SOCIALS.map((social, index) => (
              <span key={social.label}>
                <Link href={social.href} style={link}>
                  {social.label}
                </Link>
                {index < SOCIALS.length - 1 ? <span style={{ color: LINE }}> &nbsp;·&nbsp; </span> : null}
              </span>
            ))}
          </Text>

          <Text style={signature}>
            — Miguel Vilhena
            <br />
            <span style={{ color: MUTED }}>Software Engineer &amp; Entrepreneur</span>
          </Text>
        </Section>

        <Text style={footer}>
          You received this because you submitted the contact form on miguelvilhena.com.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ContactAutoReply

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
  padding: '36px 32px 30px',
  textAlign: 'center',
}

const headerTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: '1.2',
  margin: '0 0 8px',
}

const headerSub: React.CSSProperties = {
  color: 'rgba(255,255,255,0.78)',
  fontSize: '15px',
  margin: 0,
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 16px 16px',
  padding: '30px 32px 34px',
}

const paragraph: React.CSSProperties = {
  color: MUTED,
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 4px',
}

const label: React.CSSProperties = {
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

const rule: React.CSSProperties = { borderColor: LINE, margin: '24px 0' }

const link: React.CSSProperties = { color: BRAND, fontWeight: 600, textDecoration: 'none' }

const signature: React.CSSProperties = {
  color: INK,
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '1.6',
  margin: '28px 0 0',
}

const footer: React.CSSProperties = {
  color: MUTED,
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '20px 8px 0',
  textAlign: 'center',
}
