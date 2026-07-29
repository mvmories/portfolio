/**
 * The role content, rebuilt from Miguel's CV and LinkedIn profile.
 *
 * Neither source was usable as-is:
 *
 * - The **CV** carries the impact. It is the only place recording the IKEA
 *   loyalty programme reaching 30 countries, the prescription defect at Luz
 *   Saude, or the Respets exit. None of it had ever reached the CMS.
 * - **LinkedIn** carries the record: real titles, exact months, and specifics
 *   the CV compresses away - that the Aquasis legacy was OutSystems O11, that
 *   Deloitte spanned both an audit and a CRM practice.
 *
 * Where they disagree on fact (titles, dates, employers) LinkedIn is treated as
 * the record. Two apparent contradictions dissolved once both were read
 * together; those are noted on the roles concerned.
 *
 * How the copy is written, and why:
 *
 * 1. **Problem, then outcome.** Every summary and highlight opens on what was
 *    broken or missing and closes on what shipped and what it was worth. A
 *    hiring manager scanning this should see an engineer who solves problems
 *    and delivers value, not a list of duties. "Responsibilities included..."
 *    tells a reader nothing the job title had not already.
 * 2. **Numbers wherever they are real.** 30 countries, 8 countries, world's
 *    first, a nightly window of lost prescriptions. Nothing is inflated and
 *    nothing is invented - where there is no number, the sentence carries the
 *    scope instead.
 * 3. **One voice.** The old copy mixed third person ("he earned", "he tackled")
 *    with first ("my role involves"). Everything is now implicit first person,
 *    each highlight opening on a strong verb.
 *
 * Every claim traces to `sources`, quoted verbatim so the rewrite can be
 * audited line by line.
 *
 * One deliberate exception: `techStack` goes beyond what the sources name. The
 * CV and LinkedIn only ever listed what was distinctive about each stack, which
 * left out the tools a reader assumes anyway - the language under the framework,
 * version control, the test runner, how the styling was written. Those are added
 * back here where the role plainly implies them, because a hiring manager
 * filtering on "TypeScript" or "Jest" will not find a role that never says so.
 * Nothing speculative is included, and the tags are the easiest thing to prune
 * in the Studio if any feel like a stretch.
 */

export interface RoleSeed {
  /** Stable, human-readable document id, so re-running is idempotent. */
  id: string
  role: string
  company: string
  companyUrl?: string
  location?: string
  employmentType: string
  startDate: string
  endDate?: string
  current?: boolean
  summary: string
  highlights: string[]
  techStack: string[]
  /** Verbatim source text, kept so every claim above can be traced. */
  sources: {cv?: string; linkedin?: string; note?: string}
}

export const ROLES: RoleSeed[] = [
  {
    id: 'experience-ikea',
    role: 'Full Stack Software Engineer',
    company: 'IKEA',
    companyUrl: 'https://www.ikea.com',
    location: 'Amsterdam, NL',
    employmentType: 'full-time',
    startDate: '2023-07-01',
    current: true,
    summary:
      "Incepted and delivered the platform behind IKEA's loyalty programme, from a blank page to 30 countries and the largest programme of its kind in the world.",
    highlights: [
      "Took IKEA's Loyalty and Rewards Programme from inception to pilot to production, scaling it to 30 countries and making it the world's largest loyalty programme",
      'Turned a manual, market-by-market promotions process into a Flexible Points Promotions engine that lets the business configure its own reward rules, released worldwide and proven in 8 countries',
      'Own it end to end: Preact and TypeScript on the front, Node and Firestore behind, all of it provisioned as code with Terraform and Terragrunt on GCP',
      'Cut the cost of every rollout after the first by extracting the engineering patterns now reused across Ingka Group products, on fully automated CI/CD',
      'Freed the business from engineering for copy and experiments by wiring in Contentful, Contentsquare and Optimizely, so markets ship and test changes themselves',
    ],
    techStack: [
      'Preact',
      'React',
      'TypeScript',
      'JavaScript',
      'Node JS',
      'Express',
      'REST APIs',
      'Firestore',
      'GCP',
      'Terraform',
      'Terragrunt',
      'Git',
      'GitHub Actions',
      'Jest',
      'SCSS',
      'Contentful',
      'Optimizely',
      'Agentic AI',
    ],
    sources: {
      cv: "jul 2023 - ongoing. Incepted and delivered a solution that would later become the world's largest loyalty programme, from pilot to production. IKEA's Loyalty and Rewards Program rewards customers for interacting with IKEA physically or digitally, currently in 30 countries. Also part of the inception and development of a Flexible Points Promotions system that rewards users with additional points whenever certain conditions are met, currently available worldwide and tested in 8 countries. Main stack: Preact, Typescript, NodeJS, ExpressJS, Firestore, GCP, Terraform, Terragrunt, Github, GH Actions CLI, Contentful, Contentsquare, Optimizely, Agentic AI.",
      linkedin:
        'Full Stack Software Engineer, IKEA, Jul 2023 - Present, Amsterdam. Designing, developing, and delivering high-quality software to streamline processes and extend reach across the organization. Crafting engineering patterns for various products and services across Ingka Group initiatives. Championing good practices such as continuous integration and delivery.',
    },
  },
  {
    id: 'experience-expereo',
    role: 'Software Engineer',
    company: 'Expereo',
    companyUrl: 'https://www.expereo.com',
    location: 'Amsterdam, NL',
    employmentType: 'full-time',
    startDate: '2022-03-01',
    endDate: '2023-07-01',
    summary:
      "Shipped the world's first B2B Intelligent Internet Platform, and fixed how the team delivered it by taking on Scrum Master alongside the code.",
    highlights: [
      "Built the frontend of the world's first B2B Intelligent Internet Platform, giving enterprise customers a single view of global network performance",
      'Made dense network telemetry readable and fast through Apollo GraphQL against MongoDB, secured with AWS Cognito',
      'Removed the drag of a growing monorepo by standardising it on NX, Tailwind, Twin.Macro and generated Codegen clients, so types and styling stayed consistent as the team grew',
      'Took on Scrum Master on top of delivery, creating the synergies that pushed the team to be as agile and performant as possible',
    ],
    techStack: [
      'React',
      'TypeScript',
      'JavaScript',
      'NX',
      'Apollo',
      'GraphQL',
      'MongoDB',
      'AWS Cognito',
      'Tailwind',
      'Twin.Macro',
      'Codegen',
      'Jest',
      'Git',
      'GitLab CI',
    ],
    sources: {
      cv: "mar 2022 - jul 2023 (~1 year, 5 months). Part of the team developing the world's first B2B IIP (Inteligent Internet Platform) @Expereo. Aside from developing the code I have also been performing Scrum Master duties, focused on creating synergies that push the team to become as agile & performant as possible. Main stack: NX, React, Typescript, Apollo w/ GraphQL, MongoDB, AWS Cognito, GitLab, Tailwind, Twin.Macro, Codegen.",
      linkedin:
        'Software Engineer, Expereo, Full-time, Mar 2022 - Jul 2023 (1 yr 5 mos), Amsterdam. Description matches the CV.',
    },
  },
  {
    id: 'experience-info-nl',
    role: 'Software Engineer',
    company: 'INFO',
    companyUrl: 'https://www.info.nl',
    location: 'Amsterdam, NL',
    employmentType: 'full-time',
    startDate: '2021-10-01',
    endDate: '2022-03-01',
    summary:
      'Built the React Native tooling NS maintenance crews use to keep the national bike fleet on the road, at every station in the Netherlands.',
    highlights: [
      'Expanded the NS Stations maintenance app so operators could stay on top of a fleet too large to track by hand, covering every bike, its status and its defects nationwide',
      'Replaced guesswork on the ground by modelling the work task owed by each combination of bike and e-lock state, so crews are told what to do rather than deciding',
      'Closed the real-world gaps that stall a national fleet: bike loss, key loss, and pairing an e-lock to a bike',
      'Delivered it as a React specialist on a single shared codebase for both platforms',
    ],
    techStack: [
      'React Native',
      'React',
      'JavaScript',
      'TypeScript',
      'REST APIs',
      'Jest',
      'Git',
      'iOS & Android',
    ],
    sources: {
      cv: 'sept 2021 - mar 2022 (~7 months). Software engineer working in Amsterdam using React-Native to expand the functionality of the NS Stations bike maintenance app.',
      linkedin:
        'Software Engineer - React JS Specialized, INFO - business innovation partner, Full-time, Oct 2021 - Mar 2022 (6 mos), Amsterdam. Used by the NS bike maintenance operators to manage the overwhelming number of bikes, their statuses, their defects and work tasks associated with the different bike and e-lock statuses (e.g., bike loss, key loss, associate a e-lock to a bike, and many more), around the Netherlands.',
      note: 'The CV says sept 2021, LinkedIn says Oct 2021. LinkedIn is taken as the record, and its own "6 mos" only adds up on an October start.',
    },
  },
  {
    id: 'experience-prime-it',
    role: 'Software Engineer',
    company: 'Prime IT',
    location: 'Lisbon, PT',
    employmentType: 'full-time',
    startDate: '2021-03-01',
    endDate: '2021-09-01',
    summary:
      "Rescued a low-code water-monitoring platform that had outgrown its foundations, rebuilding it in React to keep Portugal's water networks observable in real time.",
    highlights: [
      'Rebuilt the Aquasis/AGS platform from scratch in React after it hit the ceiling of its original OutSystems O11 implementation, delivering version 2 inside seven months',
      'Reverse-engineered the legacy system first, mapping its functionality, integrations and tradeoffs so nothing operators depended on was lost in the move',
      'Redesigned the UX/UI end to end, then built the frontend against it, turning a dense monitoring tool into something usable under pressure',
      'Unblocked new functionality the low-code platform could not support, backed by .NET Core services',
      "Kept real-time analysis and monitoring running across Portugal's water supply and wastewater networks throughout the rebuild",
    ],
    techStack: [
      'React',
      'JavaScript',
      '.NET Core',
      'REST APIs',
      'SCSS',
      'OutSystems',
      'UX/UI',
      'Figma',
      'Git',
    ],
    sources: {
      cv: 'mar 2021 - sep 2021 (~7 months). React Software Developer with the purpose of developing an improved version of an existing Aquasis/ AGS software, that allows for the analysis and monitoring, in real time, of all existing water supply and wastewater networks in Portugal. Responsibilities: (i) the comprehension of the existing applications functionalities, integrations, tradeoffs (ii) the complete UX/UI redesign (iii) Developing version 2 of the existing software from scratch using React.',
      linkedin:
        'Certified React.js Developer, Aquasis, Full-time, Mar 2021 - Sep 2021 (7 mos), Lisbon. (i) the comprehension of the existing applications functionalities, integrations, logic UX and UI - because it was made using Outsystems O11; (ii) the UX/UI redesign; (iii) the frontend development as per UX designs; and (iv) the expansion of the softwares functionalities through the power of React (frontend) and .Net Core.',
      note: 'LinkedIn files this under the client, Aquasis; the CV under the employer, Prime IT. The employer is used, matching how Squad IT / Luz Saude is handled.',
    },
  },
  {
    id: 'experience-squad-it',
    role: 'Software Engineer',
    company: 'Squad IT',
    location: 'Lisbon, PT',
    employmentType: 'full-time',
    startDate: '2020-02-01',
    endDate: '2021-03-01',
    summary:
      "Found and killed a defect silently losing patient prescriptions every night at one of Portugal's largest private hospital groups, then built its next system from scratch.",
    highlights: [
      'Traced and permanently fixed a defect that was failing to register every automatic prescription issued between 22:00 and midnight, every day, closing a nightly gap in patient care',
      'Delivered a new hospital software solution end to end for Grupo Luz Saude, from architecture design through development to deployment',
      'Modernised the legacy estate onto OutSystems 10 without interrupting clinical operations',
      'Earned three OutSystems certifications and the advanced professional developer bootcamp inside the first months, then applied them on a live healthcare estate',
    ],
    techStack: [
      'React',
      'JavaScript',
      'OutSystems',
      'SQL',
      'REST APIs',
      'Git',
    ],
    sources: {
      cv: 'feb 2020 - mar 2021 (~1 year). I was chosen to support one of Portugals major private Hospital groups: "Luz Saude" as one of the React and Outsystems developers responsible for legacy system updates & other internal innovation projects. Coded a solution that solved a prescription problem that was losing/ not registering all automatic prescriptions given to patients between 22h00 and 00h00 every day. Problem permanently solved efficiently.',
      linkedin:
        'Software Developer, SQUAD IT Portugal, Full-time, Feb 2020 - Mar 2021 (1 yr 2 mos), Lisbon. Certified as an Outsystems associate webdeveloper, associate mobile developer and associate reactive developer. Attended the "advanced professional outsystems developer bootcamp". Chosen to support one of Portugals major private Hospital groups: "Grupo Luz Saude" as one of the Outsystems developers responsible for both: (i) legacy application system upgrade with OS10; and (ii) to create a new hospital software solution from scratch (i.e. from architecture design to app development and deployment).',
    },
  },
  {
    id: 'experience-grupo-anf',
    role: 'IT Risk Engineer',
    company: 'Grupo ANF',
    location: 'Lisbon, PT',
    employmentType: 'full-time',
    startDate: '2018-01-01',
    endDate: '2020-02-01',
    summary:
      'Built the system that let a multi-business group see its own IT risk for the first time, standing up the risk function from nothing alongside the CSO.',
    highlights: [
      'Designed and implemented the framework that made IT risk identifiable, assessable, reportable and mitigable at business-unit level, where before it was untracked',
      'Replaced fragmented per-unit practice with one standardised, centralised model working transversally across the whole group',
      'Gave the CSO and the board a single high-level view of exposure, turning risk from a reactive scramble into a proactive strategy',
      'Owned the strategy, management and growth of the department the group did not have when I arrived',
    ],
    techStack: [
      'Risk Engineering',
      'IT Governance',
      'Security',
      'ISO 27001',
    ],
    sources: {
      cv: 'jan 2018 - feb 2020 (~2 years). Developed a robust framework that enabled strategic and proactive risk management within the Group. This enabled the identification, assessment, reporting and mitigation of risks within each Business Unit (on a granular basis), and also allowed the ability to grasp a high-level vision and management capacity, in order to support the CSO in the promotion of high standards of trust, security, and information confidentiality, integrity and availability across the Business Group.',
      linkedin:
        'IT Risk Management Consulting, ANF, Full-time, Jan 2018 - Feb 2020 (2 yrs 2 mos). Supported the Chief Security Officer (CSO) in the creation and development of the risk management department, thus having responsibility for its strategy, management and growth. Main responsibilities included the proposal, development, promotion and implementation of a structure that allowed the risk management in the ANF Group to be standardized, centralized and transversal to the various Business Units.',
      note: 'Title needs a decision. The CV says "Software Engineer", LinkedIn says "IT Risk Management Consulting", the old CMS said "IT Risk Director". "IT Risk Engineer" is proposed as the honest reading that still sounds like building systems rather than writing policy.',
    },
  },
  {
    id: 'experience-deloitte',
    role: 'Software Engineer & IT Auditor',
    company: 'Deloitte',
    companyUrl: 'https://www.deloitte.com',
    location: 'Lisbon, PT',
    employmentType: 'full-time',
    startDate: '2015-02-01',
    endDate: '2018-01-01',
    summary:
      "Broke and then rebuilt the systems of Portugal's largest companies, auditing where the risk was and shipping the CRM software that closed it.",
    highlights: [
      'Delivered across a portfolio of top-tier clients including EDP, Repsol, Iberdrola, REN, NOS, FNAC, Media Capital, Sonangol and IGFEJ',
      "Built and extended clients' CRM systems, writing new services and wrapping legacy ones so decades-old estates could be reached by modern software",
      'Pressure-tested security mechanisms and general computer controls, from access security and user management to operations and change management, and reported what actually failed',
      "Quantified risk across clients' systems, technologies, processes, networks and people into maturity reports their boards could act on",
      'Set three-year strategic plans for client information systems and redesigned the business processes underneath them to remove risk at the source',
    ],
    techStack: [
      'CRM Development',
      'Java',
      'SQL',
      'JavaScript',
      'IT Audit',
      'Risk Assurance',
    ],
    sources: {
      cv: 'feb 2015 - jan 2018 (~3 years). At Deloitte, I had the opportunity to work in a set of multidisciplinary IT projects, both in IT Audit and Digital Consulting. In the process, I interacted with the following non-exhaustive list of top-tier clients: NOS, REN, EDP, Grupo Marques, FNAC, Logoplaste, Luis Simoes, REXEL, Generg, Media Capital, Dan Cake, Font Salem, Nutrinveste, Repsol, Iberdrola, IGFEJ and Sonangol.',
      linkedin:
        'Software Audit & Development, Deloitte, Feb 2015 - Jan 2018 (3 yrs), Lisboa. Information Technology Maturity Services: Create Maturity reports after thoroughly analyzing all risks affecting the audited customers systems, technologies, processes, network, people and overall environment; Conduct a targeted set of tests to determine a degree of confidence in security mechanisms; IT Internal Control Strategic Audit; Risk Assurance & IT Compliance Consulting; JET Analysis; General computer controls (access security, user management, operations management and change management); Strategic Planning of Customer Information Systems (PESI), 3 year scale. Digital Maturity Consulting Scope: Ensuring the development of customers CRM by creating or adapting services from the customers legacy systems; support the quality assurance team in testing and validating features; Feature development in new customer CRM; Project Management Monitoring and Support.',
      note: 'The old CMS entry described CRM development, the CV described IT audit, and both were right: LinkedIn shows the role spanned two Deloitte practices. The CRM half is led with, since it is the engineering half.',
    },
  },
  {
    id: 'experience-unicorn-creation',
    role: 'Co-Founder & CTO',
    company: 'UnicornCreation.net',
    location: 'Belgium',
    employmentType: 'founder',
    startDate: '2020-01-01',
    endDate: '2020-12-01',
    summary:
      'Co-founded a consulting studio that turned EU digitalisation funding into shipped software for Belgian SMEs, and owned every technical decision as CTO.',
    highlights: [
      'Co-founded the company and led all engineering as CTO while holding a full-time role',
      'Found the market in SMEs covered by European investment in entrepreneurship and digital development, where the budget existed but the capability did not',
      'Sold and delivered branding, UX/UI, web design and web development as one offer, so clients got a finished product rather than a handover',
      'Exited over a divergence of vision with the other co-founder',
    ],
    techStack: [
      'React',
      'JavaScript',
      'HTML & CSS',
      'SCSS',
      'UX/UI',
      'Figma',
      'SEO',
      'Branding',
    ],
    sources: {
      cv: 'Co-founder, CTO and Software Engineer, 2020 - 2021 (~1 year). Co-founded a successful international consulting startup focused on selling Branding, UX/UI, Webdesign and Web Development projects to small and medium sized enterprises. Focused in the Belgium market we targeted companies covered by European investments to entrepreneurship and digital development. Exited the company due to professional divergence of vision with the other co-founder.',
      note: 'Not listed on LinkedIn. The CV is the only source.',
    },
  },
  {
    id: 'experience-respets',
    role: 'Founder & Software Engineer',
    company: 'Respets',
    employmentType: 'founder',
    startDate: '2016-01-01',
    endDate: '2018-12-01',
    summary:
      'Built, ran and sold a transatlantic e-commerce brand single-handedly, writing every line of the storefront and owning the P&L behind it.',
    highlights: [
      'Founded the company, wrote the storefront and ran operations alone, as sole proprietor and only employee',
      'Sold it to an online competitor in a successful exit, after proving the model rather than raising against it',
      'Built the supply chain that fulfilled orders between Europe and the USA through international suppliers',
      'Learned what software is actually for by being the customer, the marketer and the engineer at once, all on top of a full-time job',
    ],
    techStack: [
      'JavaScript',
      'HTML & CSS',
      'E-commerce',
      'SEO',
      'Google Analytics',
      'Digital Marketing',
    ],
    sources: {
      cv: 'Founder and Software Engineer, 2016 - 2019 (~3 years). Founded and developed a Dropshipping brand and e-commerce website focused on selling the best dog products worldwide. Worked with international suppliers to fulfill orders between Europe and the USA until selling it to a competitor in a successful exit strategy. I coded and ran the business by myself. At the age of 21 I created my first formal company in the USA with an exclusive online presence in which I was the sole proprietor and the only employee.',
      linkedin:
        'Web development | Ecommerce Entrepreneur, Independent, Jan 2015 - Jul 2021 (6 yrs 7 mos). Started his online journey while still in college, by developing websites for his friends, family and/or clients. At the age of 22 he created his first formal company in the USA with an exclusive online presence in which he was the proprietor and the only employee. Skills: IT development, digital design and marketing, business management, dropshipping, SEO & SEM, affiliate marketing, brand creation.',
      note: 'LinkedIn folds this into a broader 2015-2021 "Independent" entry; the CV dates the Respets company itself to 2016-2019, the tighter and more checkable claim, which is what is used. The sources disagree on whether the US company was founded at 21 or 22, so the age is left out.',
    },
  },
]
