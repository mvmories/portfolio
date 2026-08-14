import ThemeToggle from '../components/ThemeToggle'
import { BRAND_COLOURS, COMPETITORS, PERSONAS, PRICING_MODELS, STACK, TONE } from './data'

import personaMark from '../assets/caseStudy/persona-mark.webp'
import personaWendy from '../assets/caseStudy/persona-wendy.webp'
import personaDaniel from '../assets/caseStudy/persona-daniel.webp'
import personaFiona from '../assets/caseStudy/persona-fiona.webp'
import moodboard from '../assets/caseStudy/moodboard.webp'
import typeHeading from '../assets/caseStudy/type-heading.webp'
import typeBody from '../assets/caseStudy/type-body.webp'
import logoTaglineGold from '../assets/caseStudy/logo-tagline-gold.svg'
import logoTaglineSilver from '../assets/caseStudy/logo-tagline-silver.svg'
import productHome from '../assets/caseStudy/product-home.webp'
import productPricing from '../assets/caseStudy/product-pricing.webp'
import productAbout from '../assets/caseStudy/product-about.webp'
import productApproach from '../assets/caseStudy/product-approach.webp'
import productCoaching from '../assets/caseStudy/product-coaching.webp'
import productMobileHome from '../assets/caseStudy/product-mobile-home.webp'
import productMobilePricing from '../assets/caseStudy/product-mobile-pricing.webp'
import emailShot from '../assets/caseStudy/email.webp'

import './PowerByJS.scss'

const PERSONA_IMAGES = [personaMark, personaWendy, personaDaniel, personaFiona]

const SITE = 'https://powerbyjs.com'

/**
 * The PowerByJS case study.
 *
 * A separate Vite entry point rather than a route. The home page is a single
 * scrolling document with no router, and adding one so that a second page could
 * exist would put routing weight into a bundle that most visitors never need.
 * Netlify serves a real file in preference to the SPA rewrite, so `/powerbyjs`
 * resolves here and the home page ships byte for byte unchanged.
 *
 * The copy lives in the repository rather than in Sanity on purpose. This is a
 * designed argument rather than a list of content: every section has its own
 * layout, and a portable text schema flexible enough to express them would be
 * more machinery than the single document it serves.
 */
const PowerByJS = () => (
  <>
    <div className='cs-topbar'>
      <a className='cs-back' href='/'>
        <span aria-hidden='true'>&larr;</span> Miguel Vilhena
      </a>
      <ThemeToggle />
    </div>

    <main className='cs'>
      <header className='cs-hero'>
        <p className='cs-eyebrow'>Case study, freelance</p>
        <h1>
          He asked for one page.
          <br />
          <span>I shipped him a business.</span>
        </h1>
        <p className='cs-standfirst'>
          Jessy Schneider coaches kickboxing and holistic health in Haarlem. He came to me for a one
          page website. I researched the market he was competing in first, found that one page would
          lose, and built what the business actually needed: a brand, eight bilingual pages, and
          three pricing calculators wired straight into his inbox.
        </p>

        <dl className='cs-meta'>
          <div>
            <dt>Client</dt>
            <dd>PowerByJS, Haarlem</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>Research, brand, design, build</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>Me</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className='cs-live' /> Live and in use
            </dd>
          </div>
        </dl>

        <img
          className='cs-hero-shot'
          src={productHome}
          alt='The PowerByJS home page'
          width={1440}
          height={900}
        />
      </header>

      {/* 01 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>01</p>
        <h2>The brief</h2>

        <blockquote className='cs-quote'>
          <p>
            &ldquo;CMS, to be able to update website autonomously in the future. For now we want
            only 1 website.&rdquo;
          </p>
          <footer>Jessy, in the agreement we signed</footer>
        </blockquote>

        <p>
          He had a logo he did not like, no copy, no brand and no site. New clients reached him
          through Instagram direct messages, which meant every enquiry started with him explaining
          what he offered and what it cost, one message at a time.
        </p>
        <p>
          What he asked for was one page and a way to edit it himself. The straightforward job was
          to build exactly that. I did the research first anyway, because a page is only worth
          building once you know what it has to beat.
        </p>
      </section>

      {/* 02 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>02</p>
        <h2>Why one page would have lost</h2>
        <p className='cs-lede'>
          I studied the personal training market around Haarlem and Amsterdam before drawing
          anything. Three competitors set the standard his prospects were unconsciously measuring
          him against.
        </p>

        <ul className='cs-competitors'>
          {COMPETITORS.map((c) => (
            <li key={c.name}>
              <p className='cs-competitor-sells'>Sells on {c.sells.toLowerCase()}</p>
              <h3>{c.name}</h3>
              <p className='cs-competitor-place'>{c.place}</p>
              <p>{c.detail}</p>
            </li>
          ))}
        </ul>

        <p>
          Jessy charges premium rates and earns them. Against those three, though, a single page
          with a contact form does not read as the cheaper option, it reads as the less serious one.
          The gap was never design taste. It was credibility, and credibility is cumulative: it
          comes from being able to answer the questions a careful buyer asks before they will spend
          a four figure sum on a stranger.
        </p>
        <p className='cs-callout'>
          So I told him the brief was wrong, and why. He agreed to the larger scope on the
          understanding that I would show the reasoning at every step rather than disappear and come
          back with opinions.
        </p>
      </section>

      {/* 03 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>03</p>
        <h2>Who we were selling to</h2>
        <p className='cs-lede'>
          Four personas, drawn from his actual client base rather than invented. Each carries
          demographics, goals, obstacles, engagement preferences and how they map onto his coaching
          pillars.
        </p>

        <div className='cs-personas'>
          {PERSONAS.map((p, i) => (
            <figure key={p.name}>
              <img
                src={PERSONA_IMAGES[i]}
                alt={`Persona card for ${p.name}`}
                width={1200}
                height={692}
                loading='lazy'
              />
              <figcaption>
                <strong>{p.name}</strong> {p.note}
              </figcaption>
            </figure>
          ))}
        </div>

        <p>
          These were not decoration for a slide deck. Daniel and Fiona are time poor and buy
          expertise, so pricing had to be legible without a phone call. Mark needs structure, which
          is why the twelve week programmes are sold as programmes rather than as sessions. Wendy
          does not identify as an athlete, so the copy never assumes she does. The personas decided
          the page structure and the tone before a single screen was designed.
        </p>
      </section>

      {/* 04 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>04</p>
        <h2>The brand</h2>
        <p className='cs-lede'>
          He arrived with a logo he did not like. He left with an identity: palette, gradients,
          typefaces, twelve logo lockups, a tone of voice and a tagline.
        </p>

        <div className='cs-logos'>
          <img
            src={logoTaglineGold}
            alt='PowerByJS logo, gold finish'
            width={270}
            height={152}
            loading='lazy'
          />
          <img
            src={logoTaglineSilver}
            alt='PowerByJS logo, silver finish'
            width={270}
            height={152}
            loading='lazy'
          />
        </div>
        <p className='cs-caption'>
          Twelve lockups in total: icon, wordmark and tagline versions, each in gold and silver,
          each tuned for the two background blacks. The two finishes are not decoration, the site
          can shift between them.
        </p>

        <h3 className='cs-sub'>Palette</h3>
        <ul className='cs-swatches'>
          {BRAND_COLOURS.map((c) => (
            <li key={c.hex}>
              <span className='cs-swatch' style={{ background: c.hex }} aria-hidden='true' />
              <strong>{c.name}</strong>
              <code>{c.hex}</code>
              <span className='cs-swatch-role'>{c.role}</span>
            </li>
          ))}
        </ul>
        <div className='cs-gradients'>
          <div className='cs-gradient cs-gradient--gold'>Radial gold, Flax to Golden Brown</div>
          <div className='cs-gradient cs-gradient--silver'>
            Radial silver, Platinum to Battleship Gray
          </div>
        </div>

        <h3 className='cs-sub'>Typography</h3>
        <div className='cs-type'>
          <img
            src={typeHeading}
            alt='Archivo Black type specimen'
            width={1200}
            height={675}
            loading='lazy'
          />
          <img
            src={typeBody}
            alt='Montserrat type specimen'
            width={1200}
            height={675}
            loading='lazy'
          />
        </div>

        <h3 className='cs-sub'>Tone of voice</h3>
        <ul className='cs-tone'>
          {TONE.map((t) => (
            <li key={t.word}>
              <strong>{t.word}</strong>
              <span>{t.detail}</span>
            </li>
          ))}
        </ul>

        <p className='cs-tagline'>Lead Your Transformation</p>
        <p className='cs-caption'>
          The tagline had to work as a promise to the client and as an instruction to Jessy himself.
          It ships on the hero, in the logo lockups and on his printed material.
        </p>
      </section>

      {/* 05 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>05</p>
        <h2>From moodboard to product</h2>

        <img
          className='cs-wide'
          src={moodboard}
          alt='The PowerByJS design moodboard'
          width={1600}
          height={820}
          loading='lazy'
        />
        <p className='cs-caption'>
          The moodboard set the register before any layout existed: dark, restrained, premium,
          closer to a watch brand than to a gym. Sketches and low fidelity wireframes came next,
          then high fidelity screens in Figma, then the build.
        </p>

        <div className='cs-grid-2'>
          <figure>
            <img
              src={productAbout}
              alt='The About page'
              width={1200}
              height={750}
              loading='lazy'
            />
            <figcaption>About, where the credibility case is made</figcaption>
          </figure>
          <figure>
            <img
              src={productApproach}
              alt='The Our Approach page'
              width={1200}
              height={750}
              loading='lazy'
            />
            <figcaption>Our Approach, the method spelled out</figcaption>
          </figure>
          <figure>
            <img
              src={productCoaching}
              alt='The Coaching service page'
              width={1200}
              height={750}
              loading='lazy'
            />
            <figcaption>One of four service pages</figcaption>
          </figure>
        </div>

        <figure className='cs-phone-figure'>
          <img
            src={productMobileHome}
            alt='The home page on a phone'
            width={500}
            height={820}
            loading='lazy'
          />
          <figcaption>Most of his traffic arrives from Instagram, so mobile led the design</figcaption>
        </figure>

        <ul className='cs-stats'>
          <li>
            <strong>8</strong> pages
          </li>
          <li>
            <strong>33</strong> components
          </li>
          <li>
            <strong>2</strong> languages
          </li>
          <li>
            <strong>294</strong> strings each
          </li>
        </ul>
        <p className='cs-caption'>
          English and Dutch across eleven namespaces, at exact parity. Nothing falls back to English
          silently, which matters because half his market would read a missing string as
          carelessness.
        </p>

        <ul className='cs-stack'>
          {STACK.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      {/* 06 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>06</p>
        <h2>Three pricing engines, not one</h2>
        <p className='cs-lede'>
          The single most useful thing on the site. His services do not share a pricing shape, so
          they do not share a calculator. Each card encodes the real commercial model he already
          sold by hand.
        </p>

        <img
          className='cs-wide'
          src={productPricing}
          alt='The three pricing calculators'
          width={1440}
          height={860}
          loading='lazy'
        />

        <ul className='cs-pricing'>
          {PRICING_MODELS.map((m) => (
            <li key={m.name}>
              <h3>{m.name}</h3>
              <p className='cs-rate'>
                <strong>{m.rate}</strong> {m.unit}
              </p>
              <code>{m.formula}</code>
              <p>{m.detail}</p>
            </li>
          ))}
        </ul>

        <p>
          The discount logic is the part I care about. Jessy&apos;s offer of twenty two sessions for
          the price of twenty existed only in his head and in conversations. Encoding it means the
          site never quotes a number he would not honour, and a visitor meets the deal at the moment
          they are weighing the larger commitment rather than after they have already talked
          themselves down to five sessions.
        </p>
        <img
          className='cs-phone'
          src={productMobilePricing}
          alt='The pricing calculator on a phone'
          width={500}
          height={1000}
          loading='lazy'
        />
      </section>

      {/* 07 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>07</p>
        <h2>What lands in his inbox</h2>
        <p className='cs-lede'>
          A calculator that forgets its own answer the moment someone clicks Contact is a toy.
          Whatever the visitor configured travels into the enquiry.
        </p>

        <img
          className='cs-email'
          src={emailShot}
          alt='The branded email Jessy receives when someone enquires'
          width={760}
          height={940}
          loading='lazy'
        />

        <p>
          The form posts to a Netlify function which sends through Resend, with the visitor&apos;s
          address set as the reply-to so Jessy can answer from his inbox. The email itself is hand
          built table markup in the brand palette, because mail clients each render modern CSS
          differently and a broken layout is what most contact form emails actually look like.
        </p>
        <p>
          The effect is small and it matters: he opens a message that already tells him the plan,
          the number of sessions, the group size, the estimated price and which language they were
          reading in. His first reply can be about scheduling instead of about pricing.
        </p>
      </section>

      {/* 08 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>08</p>
        <h2>Handing it over</h2>
        <p>
          The one thing he asked for by name was the ability to run it himself, so that is the part
          I refused to compromise. Content he needs to change sits in Sanity. He got written
          documentation covering the accounts, the logins and how to edit each type of content,
          written for someone who does not work in software.
        </p>
        <p>
          I have not been the bottleneck on his own website since it launched, which is the outcome
          I was actually aiming for.
        </p>
      </section>

      {/* 09 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>09</p>
        <h2>Honestly</h2>
        <p>
          I overdelivered here deliberately. He is a genuinely good coach in a crowded market and
          the brief he wrote would not have helped him, so I built the thing that would. That was my
          choice and I would make it again.
        </p>
        <p>
          What I would change is the sequencing. Brand and design ran well ahead of any code, which
          is defensible, but it meant the first thing he could actually click arrived late. Now I
          would ship a small real site early and let the research keep improving it, so the client
          has something working in the market while the deeper work continues.
        </p>
        <p>
          The site is live, he updates it himself, and enquiries reach him with the details already
          filled in.
        </p>
      </section>

      <footer className='cs-footer'>
        <a className='cs-cta' href={SITE} target='_blank' rel='noreferrer noopener'>
          Visit powerbyjs.com
          <span className='sr-only'>, opens in a new tab</span>
        </a>
        <a className='cs-cta cs-cta--ghost' href='/#contact'>
          Talk to me about your project
        </a>
      </footer>
    </main>
  </>
)

export default PowerByJS
