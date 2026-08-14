/**
 * The two renderings of the CV.
 *
 * `printHtml` is the real document: designed, typeset in the site's own
 * typefaces, and printed to `public/cv.pdf`.
 *
 * `docHtml` is a deliberately plainer version whose only job is to survive
 * being pasted into Google Docs. Docs preserves headings, weight, colour,
 * bullets and links through the clipboard, but discards flexbox, so the
 * designed layout would collapse into a jumble. Rather than let that happen
 * silently, the Docs rendering is its own template that only uses constructs
 * the clipboard carries.
 *
 * Both read from `content.mjs`, so the wording cannot drift between them.
 */

import {brand} from './content.mjs'

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/** Collapses the soft-wrapped template literals in content.mjs into one line. */
const tidy = (s) => esc(String(s).replace(/\s+/g, ' ').trim())

const dot = ' &nbsp;·&nbsp; '

// ---------------------------------------------------------------------------
// The designed rendering
// ---------------------------------------------------------------------------

export const printHtml = ({fonts, identity, summary, selectedWork, experience, ventures, ai, education, languages}) => {
  const role = (r, {compact = false} = {}) => `
    <article class="role">
      <div class="role-head">
        <div class="role-left">
          <span class="co">${esc(r.company)}</span>
          <span class="ti">${esc(r.title)}</span>
        </div>
        <div class="role-right">
          <span class="dt">${esc(r.dates)}</span>
          ${r.place ? `<span class="pl">${esc(r.place)}</span>` : ''}
        </div>
      </div>
      <p class="blurb">${tidy(r.blurb)}</p>
      ${
        r.bullets && r.bullets.length
          ? `<ul>${r.bullets.map((b) => `<li>${tidy(b)}</li>`).join('')}</ul>`
          : ''
      }
      ${r.tech && !compact ? `<p class="tech">${esc(r.tech)}</p>` : ''}
    </article>`

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(identity.name)}, CV</title>
<style>
  @font-face { font-family: 'Display'; src: url(${fonts.display}) format('woff2-variations'); font-weight: 200 800; }
  @font-face { font-family: 'Base'; src: url(${fonts.base}) format('woff2-variations'); font-weight: 100 1000; }

  @page { size: A4; margin: 13mm 14mm; }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Base', Arial, sans-serif;
    font-size: 8.7pt;
    line-height: 1.42;
    color: ${brand.body};
    -webkit-font-smoothing: antialiased;
  }
  a { color: ${brand.accent}; text-decoration: none; }

  /* ---- header ------------------------------------------------------ */
  .name {
    font-family: 'Display', sans-serif; font-weight: 800; font-size: 23pt;
    letter-spacing: -0.02em; color: ${brand.ink}; line-height: 1.05;
  }
  .tagline {
    font-family: 'Display', sans-serif; font-weight: 700; font-size: 9.6pt;
    color: ${brand.accent}; margin-top: 2.6mm; letter-spacing: -0.005em;
  }
  /* A single row rather than a right-aligned stack. Six links stacked stand
     taller than the name does, which leaves the name floating at the bottom of
     its own header. */
  .contact { margin-top: 2.6mm; font-size: 7.9pt; color: ${brand.muted}; line-height: 1.6; }
  .contact .loc { color: ${brand.body}; font-weight: 500; }
  .contact .sep { color: ${brand.rule}; }
  /* Wrap between links, never inside one. Without the nowrap the LinkedIn URL
     splits mid-slug and stops reading as a URL; without the surrounding spaces
     there is no break opportunity at all and the row runs off the page edge. */
  .contact a { white-space: nowrap; }

  .hr { height: 2px; background: ${brand.accent}; margin: 3.2mm 0 0; width: 18mm; border-radius: 2px; }

  /* ---- summary ----------------------------------------------------- */
  .summary {
    margin-top: 4mm; font-size: 9.1pt; line-height: 1.5; color: ${brand.ink};
  }

  /* ---- sections ---------------------------------------------------- */
  section { margin-top: 5.4mm; }
  h2 {
    font-family: 'Base', sans-serif; font-size: 7.4pt; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.16em; color: ${brand.accent};
    padding-bottom: 1.4mm; border-bottom: 1px solid ${brand.rule}; margin-bottom: 2.6mm;
  }

  /* ---- roles ------------------------------------------------------- */
  .role { margin-bottom: 3.4mm; page-break-inside: avoid; break-inside: avoid; }
  .role:last-child { margin-bottom: 0; }
  .role-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8mm; }
  .role-left { display: flex; align-items: baseline; gap: 2.4mm; min-width: 0; }
  .role-right { text-align: right; white-space: nowrap; font-size: 7.7pt; color: ${brand.muted}; }
  .co { font-family: 'Display', sans-serif; font-weight: 800; font-size: 10pt; color: ${brand.ink}; letter-spacing: -0.01em; }
  .ti { font-size: 8.6pt; color: ${brand.body}; }
  .role-right .pl::before { content: '·'; margin: 0 1.4mm; color: ${brand.rule}; }

  .blurb { margin-top: 1mm; }
  /* Coloured via ::marker rather than an absolutely positioned pseudo-element.
     A positioned marker takes the whole list item out of normal flow, and
     Chrome then paints it in a later layer, which puts every bullet at the END
     of the page's text stream in the exported PDF. Visually identical, but text
     extraction returned each role's achievements detached from the role, so an
     applicant tracking system would have attributed them to the wrong employer.
     Verified by re-extracting the PDF after this change. */
  .role ul { list-style: disc; margin-top: 1.4mm; padding-left: 3.6mm; }
  .role li { margin-bottom: 0.8mm; padding-left: 0.6mm; }
  .role li::marker { color: ${brand.accentSoft}; font-size: 0.82em; }
  .tech {
    margin-top: 1.6mm; font-size: 7.2pt; color: ${brand.muted};
    letter-spacing: 0.012em;
  }

  /* ---- selected work ----------------------------------------------- */
  .work-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8mm; }
  .work-head .co { font-size: 10pt; }

  /* ---- ventures ---------------------------------------------------- */
  .note { font-size: 7.6pt; color: ${brand.muted}; margin-bottom: 2mm; }

  /* ---- ai ---------------------------------------------------------- */
  .ai p + p { margin-top: 1.6mm; }

  /* ---- education --------------------------------------------------- */
  .edu { display: flex; align-items: baseline; justify-content: space-between; gap: 8mm; margin-bottom: 1.1mm; }
  .edu:last-of-type { margin-bottom: 0; }
  .edu-left { min-width: 0; }
  .edu .school { font-weight: 700; color: ${brand.ink}; }
  .edu .award::before { content: '·'; margin: 0 1.4mm; color: ${brand.rule}; }
  .edu .dt { white-space: nowrap; font-size: 7.7pt; color: ${brand.muted}; }
  .edu-note { font-size: 8.4pt; color: ${brand.body}; margin: 0.2mm 0 1.8mm; }

  .langs { color: ${brand.ink}; }
</style></head>
<body>

  <header class="head">
    <div class="name">${esc(identity.name)}</div>
    <div class="tagline">${esc(identity.tagline)}</div>
    <div class="hr"></div>
    <div class="contact">
      <span class="loc">${esc(identity.location)}</span>
      ${identity.links
        .map((l) => ` <span class="sep">·</span> <a href="${l.href}">${esc(l.label)}</a>`)
        .join('')}
    </div>
  </header>

  <p class="summary">${tidy(summary)}</p>

  <section>
    <h2>Selected work</h2>
    <div class="work-head">
      <span class="co">${esc(selectedWork.name)}</span>
      <a href="${selectedWork.href}">${esc(selectedWork.hrefLabel)}</a>
    </div>
    <p class="blurb">${tidy(selectedWork.blurb)}</p>
  </section>

  <section>
    <h2>Experience</h2>
    ${experience.map((r) => role(r)).join('')}
  </section>

  <section>
    <h2>Founded companies</h2>
    <p class="note">${esc(ventures.note)}</p>
    ${ventures.items.map((r) => role(r, {compact: true})).join('')}
  </section>

  <section class="ai">
    <h2>Building with AI</h2>
    ${ai.map((p) => `<p>${tidy(p)}</p>`).join('')}
  </section>

  <section>
    <h2>Education</h2>
    ${education
      .map(
        (e) => `
      <div class="edu">
        <div class="edu-left">
          <span class="school">${esc(e.school)}</span><span class="award">${esc(e.award)}</span>
        </div>
        <div class="dt">${esc(e.dates)}</div>
      </div>
      ${e.note ? `<p class="edu-note">${tidy(e.note)}</p>` : ''}`,
      )
      .join('')}
  </section>

  <section>
    <h2>Languages</h2>
    <p class="langs">${esc(languages)}</p>
  </section>

</body></html>`
}

// ---------------------------------------------------------------------------
// The Google Docs rendering
// ---------------------------------------------------------------------------

export const docHtml = ({identity, summary, selectedWork, experience, ventures, ai, education, languages}) => {
  const role = (r, {compact = false} = {}) => `
  <p class="job">
    <span class="co">${esc(r.company)}</span>${dot}<span class="ti">${esc(r.title)}</span>${dot}<span class="dt">${esc(r.dates)}${r.place ? dot + esc(r.place) : ''}</span>
  </p>
  <p class="blurb">${tidy(r.blurb)}</p>
  ${r.bullets && r.bullets.length ? `<ul>${r.bullets.map((b) => `<li>${tidy(b)}</li>`).join('')}</ul>` : ''}
  ${r.tech && !compact ? `<p class="tech">${esc(r.tech)}</p>` : ''}`

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(identity.name)}, CV for Google Docs</title>
<style>
  /* Arial on purpose. Google Docs has a short font list, and a face it does not
     have falls back silently and undoes the styling. Arial also parses more
     reliably in applicant tracking systems than a decorative face would. */
  @page { size: A4; margin: 1.4cm 1.5cm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; line-height: 1.28;
         color: #1a1a1a; max-width: 18cm; margin: 0 auto; text-align: left; }
  h1 { font-size: 19pt; margin: 0 0 2px; color: ${brand.ink}; }
  .role-line { font-size: 10pt; color: ${brand.accent}; font-weight: bold; margin: 0 0 5px; }
  .contact { font-size: 8.5pt; color: #555; margin: 0 0 11px; line-height: 1.5; }
  .contact a, a { color: ${brand.accent}; text-decoration: none; }
  h2 { font-size: 9.5pt; color: ${brand.accent}; text-transform: uppercase; letter-spacing: 1.1px;
       margin: 13px 0 6px; padding-bottom: 2px; border-bottom: 1px solid ${brand.rule}; }
  .job { margin: 0 0 2px; }
  .job .co { font-weight: bold; color: ${brand.ink}; }
  .job .dt { color: #666; }
  .blurb { margin: 0 0 3px; }
  ul { margin: 0 0 6px; padding-left: 17px; }
  li { margin: 0 0 1px; }
  .tech { font-size: 8pt; color: #666; margin: 0 0 9px; }
  .note { font-size: 8.5pt; color: #555; margin: 0 0 6px; }
</style></head>
<body>

<h1>${esc(identity.name)}</h1>
<p class="role-line">${esc(identity.tagline)}</p>
<p class="contact">${esc(identity.location)}${dot}${identity.links
    .map((l) => `<a href="${l.href}">${esc(l.label)}</a>`)
    .join(dot)}</p>

<p class="blurb">${tidy(summary)}</p>

<h2>Selected work</h2>
<p class="job"><span class="co">${esc(selectedWork.name)}</span>${dot}<a href="${selectedWork.href}">${esc(selectedWork.hrefLabel)}</a></p>
<p class="blurb">${tidy(selectedWork.blurb)}</p>

<h2>Experience</h2>
${experience.map((r) => role(r)).join('')}

<h2>Founded companies</h2>
<p class="note">${esc(ventures.note)}</p>
${ventures.items.map((r) => role(r, {compact: true})).join('')}

<h2>Building with AI</h2>
${ai.map((p) => `<p class="blurb">${tidy(p)}</p>`).join('')}

<h2>Education</h2>
${education
    .map(
      (e) => `<p class="job"><span class="co">${esc(e.school)}</span>${dot}<span class="ti">${esc(e.award)}</span>${dot}<span class="dt">${esc(e.dates)}</span></p>
${e.note ? `<p class="blurb">${tidy(e.note)}</p>` : ''}`,
    )
    .join('')}

<h2>Languages</h2>
<p class="blurb">${esc(languages)}</p>

</body></html>`
}
