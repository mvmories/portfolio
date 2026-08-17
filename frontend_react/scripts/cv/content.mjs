/**
 * The CV, as data.
 *
 * This is the only place the wording lives. Both renderings, the designed PDF
 * and the plain version that gets pasted into Google Docs, are generated from
 * it, so the two can never drift apart the way the Doc drifted from Sanity and
 * LinkedIn: a wrong degree year, a wrong start month and six typos, all because
 * three surfaces were edited independently.
 *
 * Eventually this should be fetched from Sanity, which is the canonical source
 * for experience. It is a local file for now because the `/cv` route that will
 * do that fetching does not exist yet, and shipping a good CV should not wait
 * for it.
 *
 * Editing rules, carried over from `.cv-plan.md` §4.3:
 *
 *   - No em dashes anywhere. Commas, colons or hyphens.
 *   - Past tense for past roles.
 *   - First person or no person, never third.
 *   - Every bullet leads with what changed, not what was used.
 *   - No number without a source that can be defended out loud. In particular,
 *     see `.cv-plan.md` §1.6 before adding any IKEA figure: the product surface
 *     is public, the performance numbers are not.
 */

export const brand = {
  ink: '#12131a',
  body: '#33364a',
  muted: '#71748c',
  accent: '#313bac',
  accentSoft: '#8b93e0',
  rule: '#dcdef0',
}

export const identity = {
  // Deliberately not the four-part legal name that was on the old CV. It
  // appeared on no other surface, so anyone cross-referencing this against
  // LinkedIn or the portfolio had to infer they were the same person.
  name: 'Miguel Vilhena',
  tagline: 'Frontend engineer, fullstack when it counts, deep in AI',
  location: 'Amsterdam, Netherlands',
  // No phone number, by decision. The CV is served from a public URL, so a
  // number on it is a published number. The booking link is also a better call
  // to action: it removes the "when suits you" exchange entirely.
  links: [
    {label: 'mvmories@gmail.com', href: 'mailto:mvmories@gmail.com'},
    {label: 'miguelvilhena.com', href: 'https://miguelvilhena.com'},
    // The only contact link whose domain does not say what it does. The others
    // are self-describing, and prefixing them all would pad the row without
    // telling the reader anything.
    {pre: 'Book a call', label: 'cal.com/miguelvilhena/20min', href: 'https://cal.com/miguelvilhena/20min'},
    {label: 'linkedin.com/in/mvmories', href: 'https://www.linkedin.com/in/mvmories/'},
    {label: 'github.com/mvmories', href: 'https://github.com/mvmories'},
  ],
}

// "Eleven years" is measured from Deloitte, February 2015. Check it each January.
export const summary = `I take products from a blank page to 30 countries. I joined Rewards from IKEA
Family as a one-country pilot and have carried it through every market launch
since, the first points-earning mechanic in IKEA Family's forty-year history and
now live to a base of over 200 million members. Eleven years building product
platforms across loyalty, enterprise networking, healthcare and public transport.
Founded and exited two companies alongside full-time work. I build with AI daily
and run my own local model infrastructure.`

/**
 * Two entries, and it stops there. A "selected work" section with six links is a
 * link dump; with two it is still a recommendation. It sits above Experience
 * because it is the only thing on the page a reader can click and verify in
 * thirty seconds.
 *
 * The second entry replaced the standalone "Building with AI" block on page 2.
 * That block asserted the local-model work in prose with nothing to click, which
 * is the exact failure the site's own design review calls out: an unevidenced
 * superlative reads as inflation. The claim now sits next to its proof, above
 * the fold, and the CV is shorter for it.
 *
 * PowerByJS stays first: it is delivered client work with an outcome, which is
 * the stronger signal to a recruiter skimming. The AI Factory is the
 * differentiator, and it supports the "deep in AI" line rather than carrying the
 * document.
 */
export const selectedWork = [
  {
    name: 'PowerByJS',
    href: 'https://miguelvilhena.com/powerbyjs',
    hrefPre: 'Case study',
    hrefLabel: 'miguelvilhena.com/powerbyjs',
    blurb: `Brand, site and booking flow for a Haarlem strength studio, designed and built
end to end. Full case study, including the problem, the decisions and the result,
at the link above.`,
  },
  {
    name: 'The AI Factory',
    href: 'https://miguelvilhena.com/factory',
    hrefPre: 'Case study',
    hrefLabel: 'miguelvilhena.com/factory',
    // Wording carried over from the retired `ai` block, which was reviewed
    // against §10.3's list of claims that may not be made. "Deploy" stays out:
    // the pipeline does not deploy anything, and it is exactly the claim an
    // interviewer would ask to see demonstrated.
    blurb: `A private AI development environment I run on a Mac Studio: a local open-weight
LLM on Apple silicon, an agent orchestrator, and a chat interface I can reach
from anywhere over Tailscale, sandboxed to a non-root user. It takes an idea from
a loose prompt to a structured spec, then to designs, code and automated quality
gates, with sub-agents owning each stage.`,
  },
]

/**
 * Reverse chronological, with a deliberate recency taper: the newest roles carry
 * bullets, the oldest carry a line. Grupo ANF gets a single line because it is
 * the role furthest from the positioning, and a dense paragraph of governance
 * language with no code in it argues against "frontend engineer".
 */
export const experience = [
  {
    company: 'IKEA',
    title: 'Full Stack Software Engineer',
    dates: 'Jul 2023 - Present',
    place: 'Amsterdam, NL',
    blurb: `Joined Rewards from IKEA Family as a Portugal pilot and carried it through every
market launch since, to 30 countries. The first points-earning mechanic in IKEA
Family's forty-year history, live to a base of over 200 million members.`,
    bullets: [
      `Rebuilt the claim and redeem flow, the path every reward in the programme goes
       through, and took offer claims up sharply.`,
      `Built the launch system the team used to take the whole loyalty programme into
       every new geography, 30 markets in all. What used to need me now needs a
       checklist.`,
      `Led the V2 initiative end to end: the micro-frontend rebuild, and the migration
       onto the upstream's new canonical model through major breaking changes,
       without dropping a market.`,
      `Worked across the stack, Preact and TypeScript on the front, Node, Firestore
       and GCP behind, and wrote the architecture decisions down before they got
       built.`,
    ],
    tech: 'Preact · TypeScript · Node · Express · Firestore · GCP · Terraform · Terragrunt · GitHub Actions · Contentful · Optimizely · Agentic AI',
  },
  {
    company: 'Expereo',
    title: 'Software Engineer',
    dates: 'Mar 2022 - Jul 2023',
    place: 'Amsterdam, NL',
    blurb: `Shipped the world's first B2B Intelligent Internet Platform, and fixed how the
team delivered it by taking on Scrum Master alongside the code.`,
    bullets: [
      `Built the frontend of the platform, giving enterprise customers a single view
       of global network performance.`,
      `Removed the drag of a growing monorepo by standardising it on NX, Tailwind,
       Twin.Macro and generated Codegen clients, so types and styling stayed
       consistent as the team grew.`,
    ],
    tech: 'React · TypeScript · NX · Apollo · GraphQL · MongoDB · AWS Cognito · Tailwind · GitLab CI',
  },
  {
    company: 'INFO',
    title: 'Software Engineer',
    dates: 'Oct 2021 - Mar 2022',
    place: 'Amsterdam, NL',
    blurb: `Built NFC unlocking into the OV-fiets operator app at NS. The same mechanism now
lets riders open bikes themselves, on a fleet of 22,000 nationwide.`,
    bullets: [
      `Added NFC unlocking to the operator app, so staff opened a bike by holding
       their NS handset against its e-lock instead of going through the back office.`,
      `That mechanism grew into the self-service unlock riders use today with their
       own travel card, which took the operator out of the rental entirely.`,
    ],
    tech: 'React Native · TypeScript · REST APIs · iOS & Android',
  },
  {
    company: 'Prime IT',
    title: 'Software Engineer, client Aquasis / AGS',
    dates: 'Mar 2021 - Sep 2021',
    place: 'Lisbon, PT',
    blurb: `Rescued a low-code water-monitoring platform that had outgrown its foundations,
rebuilding it in React to keep Portugal's water networks observable in real time.`,
    bullets: [
      `Rebuilt the platform from scratch in React after it hit the ceiling of its
       original OutSystems implementation, delivering version 2 inside seven months.`,
      `Redesigned the UX/UI end to end, then built the frontend against it, turning a
       dense monitoring tool into something usable under pressure.`,
    ],
    tech: 'React · .NET Core · SCSS · OutSystems · Figma',
  },
  {
    company: 'Squad IT',
    title: 'Software Engineer',
    dates: 'Feb 2020 - Mar 2021',
    place: 'Lisbon, PT',
    blurb: `Found and permanently fixed a defect that was failing to register every automatic
prescription issued between 22:00 and midnight, every day, at one of Portugal's
largest private hospital groups, closing a nightly gap in patient care. Then built
the group's next system from scratch, and modernised the legacy estate without
interrupting clinical operations.`,
    bullets: [],
    tech: 'React · OutSystems · SQL',
  },
  {
    company: 'Grupo ANF',
    title: 'IT Risk Engineer',
    dates: 'Jan 2018 - Feb 2020',
    place: 'Lisbon, PT',
    blurb: `Built the system that let a multi-business group see its own IT risk for the
first time, standing up the risk function from nothing alongside the CSO.`,
    bullets: [],
    tech: '',
  },
  {
    company: 'Deloitte',
    title: 'Software Engineer & IT Auditor',
    dates: 'Feb 2015 - Jan 2018',
    place: 'Lisbon, PT',
    blurb: `Audited where the risk was in Portugal's largest companies, then shipped the CRM
software that closed it.`,
    bullets: [
      `Built and extended clients' CRM systems, writing new services and wrapping
       legacy ones so decades-old estates could be reached by modern software.`,
      // Seven names, not the seventeen that were on the old CV. At that volume it
      // read as padding rather than credibility.
      `Delivered across a portfolio of top-tier clients including EDP, Repsol,
       Iberdrola, REN, NOS, FNAC and Sonangol.`,
    ],
    tech: 'CRM Development · Java · SQL · IT Audit',
  },
]

/**
 * Kept separate from Experience rather than interleaved by date, because both
 * ran concurrently with full-time roles and interleaving would read as job
 * hopping. The old CV's three-sentence preamble is gone: it was throat-clearing
 * in front of the two entries that actually prove something, and it carried an
 * age claim that has been retired.
 *
 * Founder ventures use years only, never months.
 */
export const ventures = {
  note: 'Built and run alongside full-time work.',
  items: [
    {
      company: 'UnicornCreation.net',
      title: 'Co-Founder & CTO',
      dates: '2020 - 2021',
      place: 'Belgium',
      // No reason for the exit, by decision. "Professional divergence of vision"
      // invites a question about conflict and answers nothing useful.
      blurb: `Co-founded a consulting studio that turned EU digitalisation funding into shipped
software for Belgian SMEs, and owned every technical decision as CTO. Exited by
selling my stake to the other co-founder.`,
    },
    {
      company: 'Respets',
      title: 'Founder & Software Engineer',
      dates: '2016 - 2018',
      place: '',
      blurb: `Built, ran and sold a transatlantic e-commerce brand single-handedly, writing
every line of the storefront and owning the P&L behind it. Sold it to an online
competitor in a successful exit, after proving the model rather than raising
against it.`,
    },
  ],
}

/**
 * The "Building with AI" block that used to live here is gone. Its substance
 * moved into `selectedWork` as The AI Factory entry, where the claim sits next
 * to a link that proves it. Do not reinstate it: two places making the same
 * claim, one of them unlinked, is worse than one place making it with evidence.
 */
/**
 * Four of ten entries. The full list lives on LinkedIn, where it costs nothing.
 * Here, four separate course listings would crowd out the work and read as
 * course-collecting rather than depth.
 *
 * The degree leads and the ongoing CS work supports it, which is the right way
 * round: Google currently surfaces "Education: Boot.dev" as the headline
 * credential, ahead of the degree.
 */
export const education = [
  {
    school: 'NOVA IMS, Universidade Nova de Lisboa',
    award: 'BSc, Information Systems and Technology',
    dates: '2011 - 2015',
    // Documented, not informal: the Director's letter of 29/06/2015 states the
    // top-five placing outright and it was published on the school's Quadro de
    // Mérito. Scan kept at .backups/commendation.jpeg. The year matters, because
    // the distinction is for 2013/2014 specifically rather than for the degree
    // as a whole, and the old CV's "top 5 graduates of his year" overstated it.
    note: `Named to the NOVA IMS Academic Merit Board for 2013/2014, top five students on the course.`,
  },
  {
    school: 'Boot.dev',
    award: 'Backend Development and Computer Science',
    dates: 'ongoing',
    note: '',
  },
  {
    school: 'FLAG Lisbon',
    award: 'UX/UI and Front-End Development',
    dates: '2020 · 19/20',
    note: '',
  },
  {
    school: 'Lisbon School of Design',
    award: 'Brand Design',
    dates: '2019 · 18/20',
    note: '',
  },
]

// Dutch is deliberately absent.
export const languages =
  'Portuguese (native) · English (fluent) · Spanish (advanced) · French (basic)'
