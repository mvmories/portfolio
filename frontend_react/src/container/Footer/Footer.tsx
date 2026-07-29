import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

import { images } from '@/constants'
import { AppWrap, MotionWrap } from '@/wrapper'
import './Footer.scss'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const INITIAL = { name: '', email: '', message: '', website: '' }

const Footer = () => {
  const [formData, setFormData] = useState(INITIAL)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const mountedAt = useRef(0)

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  const { name, email, message, website } = formData

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name: field, value } = e.target
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          website,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? 'Something went wrong. Please try again.')
      }

      setFormData(INITIAL)
      setStatus('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const isSending = status === 'sending'

  return (
    <>
      <h2 className='head-title head-text'>Take a coffee &amp; chat with me</h2>

      <div className='app__footer-cards'>
        <div className='app__footer-card'>
          <img src={images.email} alt='' aria-hidden='true' width={40} height={40} loading='lazy' />
          <a href='mailto:mvmories@gmail.com' className='p-text'>
            mvmories@gmail.com
          </a>
        </div>
        <div className='app__footer-card'>
          <img src={images.mobile} alt='' aria-hidden='true' width={40} height={40} loading='lazy' />
          <a href='tel:+31619433454' className='p-text'>
            +31 (0) 619 433 454
          </a>
        </div>
      </div>

      {status !== 'sent' ? (
        <form className='app__footer-form app__flex' onSubmit={handleSubmit} noValidate={false}>
          <div className='app__flex'>
            <label className='sr-only' htmlFor='contact-name'>
              Your Name
            </label>
            <input
              id='contact-name'
              className='p-text'
              type='text'
              name='name'
              placeholder='Your Name'
              value={name}
              onChange={handleChangeInput}
              required
              minLength={2}
              maxLength={80}
              autoComplete='name'
            />
          </div>
          <div className='app__flex'>
            <label className='sr-only' htmlFor='contact-email'>
              Your Email
            </label>
            <input
              id='contact-email'
              className='p-text'
              type='email'
              name='email'
              placeholder='Your Email'
              value={email}
              onChange={handleChangeInput}
              required
              autoComplete='email'
            />
          </div>
          <div>
            <label className='sr-only' htmlFor='contact-message'>
              Your Message
            </label>
            <textarea
              id='contact-message'
              className='p-text'
              placeholder='Your Message'
              value={message}
              name='message'
              onChange={handleChangeInput}
              required
              minLength={10}
              maxLength={2000}
            />
          </div>

          {/* Honeypot — hidden from humans, irresistible to bots. */}
          <div className='app__footer-honeypot' aria-hidden='true'>
            <label htmlFor='contact-website'>Leave this field empty</label>
            <input
              id='contact-website'
              type='text'
              name='website'
              value={website}
              onChange={handleChangeInput}
              tabIndex={-1}
              autoComplete='off'
            />
          </div>

          <button type='submit' className='p-text' disabled={isSending}>
            {isSending ? 'Sending…' : 'Send Message'}
          </button>

          <p className='app__footer-status p-text' role='status' aria-live='polite'>
            {error}
          </p>
        </form>
      ) : (
        <div role='status' aria-live='polite'>
          <h3 className='head-text'>Thank you for getting in touch!</h3>
          <p className='p-text' style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            I&apos;ll get back to you shortly.
          </p>
        </div>
      )}
    </>
  )
}

export default AppWrap(MotionWrap(Footer, 'app__footer'), 'contact', 'app__whitebg')
