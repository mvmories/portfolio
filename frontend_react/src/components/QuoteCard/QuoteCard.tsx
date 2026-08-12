import { forwardRef } from 'react'

import { urlFor } from '@/lib/client'
import type { Testimonial } from '@/types/sanity'
import './QuoteCard.scss'

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

interface QuoteCardProps {
  quote: Testimonial
}

// One card, used for both the featured set and everything behind the
// disclosure, so adding a testimonial is a publish rather than a code change.
const QuoteCard = forwardRef<HTMLLIElement, QuoteCardProps>(({ quote }, ref) => {
  const attribution = [quote.role, quote.company].filter(Boolean).join(', ')

  return (
    <li className='app__quote-card' ref={ref} tabIndex={-1}>
      <blockquote className='app__quote-text'>{quote.feedback}</blockquote>

      <div className='app__quote-author'>
        {quote.imgurl ? (
          <img
            className='app__quote-avatar'
            src={urlFor(quote.imgurl)
              .width(112)
              .height(112)
              .fit('crop')
              .auto('format')
              .quality(80)
              .url()}
            alt=''
            width={56}
            height={56}
            loading='lazy'
            decoding='async'
          />
        ) : (
          <span className='app__quote-avatar app__quote-avatar--initials' aria-hidden='true'>
            {initialsOf(quote.name)}
          </span>
        )}

        <span className='app__quote-meta'>
          {quote.linkedInUrl ? (
            <a className='app__quote-name' href={quote.linkedInUrl} target='_blank' rel='noreferrer'>
              {quote.name}
            </a>
          ) : (
            <span className='app__quote-name'>{quote.name}</span>
          )}
          {attribution && <span className='app__quote-role'>{attribution}</span>}
          {/* Only shown when it differs from the current employer. Without it a
              reader assumes the work happened wherever they are now, which is a
              false claim sitting above a strip of logos headed "Where I've done
              it". With it, the card says two things: senior people vouch for
              him, and those people went on to senior places. */}
          {quote.workedTogetherAt && quote.workedTogetherAt !== quote.company && (
            <span className='app__quote-context'>Worked together at {quote.workedTogetherAt}</span>
          )}
        </span>
      </div>
    </li>
  )
})

QuoteCard.displayName = 'QuoteCard'

export default QuoteCard
