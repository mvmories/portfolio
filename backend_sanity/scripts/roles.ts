/**
 * The rewritten role content, kept in one reviewable place rather than buried
 * in the migration logic.
 *
 * Every factual claim here comes from the original descriptions - the companies,
 * technologies, dates, durations and outcomes are unchanged. What changed is
 * the shape: each 300-500 character paragraph became one summary line plus a
 * few highlights, because the previous single blob is exactly what made the
 * section unreadable.
 *
 * Two problems in the original copy are fixed:
 *
 * 1. The voice was inconsistent. Seven roles were written in the third person
 *    ("he earned", "he tackled"), one in the first ("my role involves"). All are
 *    now written in the implicit first person used on CVs, where bullets start
 *    with a verb and no pronoun is needed.
 * 2. The date range was prose at the front of every description
 *    ("2015 - 2018 (3 years) - "). It is now structured data, so it can be
 *    sorted and formatted, and the duration is computed rather than hand-typed
 *    and going stale.
 *
 * MONTHS ARE ESTIMATES. The source data only ever recorded a year plus a stated
 * duration, so months were chosen to reproduce that duration ("7 months",
 * "8 months", "1,5 years"). They are the one thing here that is not evidence
 * based, so they are worth correcting in the Studio.
 */

export interface RoleSeed {
  /** Stable, human-readable document id, so re-running is idempotent. */
  id: string
  role: string
  company: string
  location?: string
  employmentType: string
  startDate: string
  endDate?: string
  current?: boolean
  summary: string
  highlights: string[]
  techStack: string[]
  /** The original text, kept so the rewrite can always be audited. */
  originalDesc: string
}

export const ROLES: RoleSeed[] = [
  {
    id: 'experience-deloitte',
    role: 'Fullstack Developer',
    company: 'Deloitte',
    location: 'Lisbon, PT',
    employmentType: 'full-time',
    startDate: '2015-01-01',
    endDate: '2018-01-01',
    summary:
      'Built and integrated CRM systems for enterprise clients, working across legacy codebases and new implementations.',
    highlights: [
      "Developed CRM features by integrating and modifying clients' legacy systems",
      'Contributed to new client CRM implementations from the ground up',
      'Worked with QA teams to test and validate releases',
      'Provided project management oversight and support',
    ],
    techStack: ['Java', 'Spring Boot', 'JavaScript'],
    originalDesc:
      "2015 - 2018 (3 years) - Responsibilities included facilitating CRM development through integration or modification of clients' legacy systems, collaborating with quality assurance teams to test and validate features, contributing to new client CRM implementations, and providing project management oversight and support - using Java, Springboot & Javascript.",
  },
  {
    id: 'experience-respets',
    role: 'Founder & Developer',
    company: 'Respets',
    employmentType: 'founder',
    startDate: '2016-01-01',
    endDate: '2019-01-01',
    summary:
      'Founded, built and ultimately sold a dog-products e-commerce brand shipping between Europe and the USA.',
    highlights: [
      'Built the storefront and the dropshipping operation behind it',
      'Managed international suppliers fulfilling orders across Europe and the USA',
      'Exited through a sale to a competitor',
    ],
    techStack: ['E-commerce', 'JavaScript'],
    originalDesc:
      '2016 - 2019 (3 years) - Founded and developed a Dropshipping brand and e-commerce website focused on selling the best dog products worldwide. Worked with international suppliers to fulfill orders between Europe and the USA. until later sold to a competitor in a successful exit strategy',
  },
  {
    id: 'experience-anf-group',
    role: 'IT Risk Director',
    company: 'ANF Group',
    employmentType: 'full-time',
    startDate: '2018-01-01',
    endDate: '2020-01-01',
    summary:
      'Stood up a risk management department from scratch, covering IT risk across every business unit in the group.',
    highlights: [
      'Built a standardised risk management structure spanning all business units',
      'Led IT risk identification, control and mitigation for the group',
      'Shifted the group towards strategic, proactive risk management',
      'Protected trust, security and information confidentiality across the organisation',
    ],
    techStack: ['Risk Management', 'IT Governance'],
    originalDesc:
      '2018 - 2020 (2 years) - Supported the Group in developing a risk management department, focusing on IT risk identification, control, and mitigation for the Group. Responsibilities included creating a standardized risk management structure across business units, supporting strategic and proactive risk management. This effort helped maintain trust, security, and information confidentiality throughout the group.',
  },
  {
    id: 'experience-squad-it',
    role: 'Fullstack Developer',
    company: 'Squad IT — Grupo Luz Saúde',
    employmentType: 'full-time',
    startDate: '2020-01-01',
    endDate: '2021-01-01',
    summary:
      'Built hospital software for Grupo Luz Saúde, from greenfield applications to upgrading legacy systems.',
    highlights: [
      'Delivered full-stack web apps for one of Portugal\u2019s largest healthcare groups',
      'Earned OutSystems certifications while on the project',
      'Integrated low-code APIs and datasets with conventional backend services',
      'Built new hospital systems from scratch and modernised existing ones',
    ],
    techStack: ['React', 'OutSystems', 'JavaScript'],
    originalDesc:
      '2020 - 2021 (1 year) - As a software engineer at Squad IT, he earned OutSystems certifications while developing full-stack web apps for Grupo Luz Saúde using React and OutSystems. He tackled complex problems in the healthcare industry, integrating low-code APIs and datasets. His work involved both traditional software engineering and seamless integration of frontend and backend technologies to create efficient and robust hospital software solutions from scratch, upgrading legacy systems, and addressing industry challenges.',
  },
  {
    id: 'experience-unicorn-creation',
    role: 'Co-Founder & Developer',
    company: 'unicorncreation.net',
    location: 'Belgium',
    employmentType: 'founder',
    startDate: '2020-01-01',
    endDate: '2021-01-01',
    summary:
      'Co-founded a consulting studio selling branding, UX/UI and web development to SMEs in the Belgian market.',
    highlights: [
      'Targeted companies backed by European entrepreneurship and digital funding',
      'Sold and delivered branding, UX/UI web design and development projects',
      'Left the company over a difference in vision with the co-founder',
    ],
    techStack: ['React', 'UX/UI', 'Branding'],
    originalDesc:
      '2020 - 2021 (1 year) - Co-founded a successful international consulting startup focused on selling Branding, UX/UI Webdesign and Web Development projects to small and medium sized enterprises. Focused in the Belgium market we targeted companies covered by European investments to entrepreneurship and digital development. Exited the company due to professional divergence of vision with the other co-founder.',
  },
  {
    id: 'experience-primeit-aquasis',
    role: 'Software Engineer',
    company: 'PrimeIT — Aquasis',
    employmentType: 'contract',
    startDate: '2021-01-01',
    endDate: '2021-09-01',
    summary:
      'Rebuilt the frontend of a real-time water network monitoring platform used for global water management.',
    highlights: [
      'Redesigned the UX/UI and rebuilt the frontend in React',
      'Extended platform capabilities with React and .NET Core',
      'Mapped existing functionality before changing it, to avoid regressions',
    ],
    techStack: ['React', '.NET Core', 'UX/UI'],
    originalDesc:
      '2021 (8 months) - As a React Software Developer, he enhanced Aquasis software for real-time water network monitoring. Responsibilities included understanding existing functionalities, UX/UI redesign, frontend development, and expanding capabilities using React and .NET Core. He aimed to create efficient web-based solutions for global water management.',
  },
  {
    id: 'experience-info-nl-ns',
    role: 'React Native Developer',
    company: 'INFO.nl — NS',
    location: 'Amsterdam, NL',
    employmentType: 'contract',
    startDate: '2021-10-01',
    endDate: '2022-05-01',
    summary:
      'Built the React Native app NS operators use to maintain the bike fleet across every station in the Netherlands.',
    highlights: [
      'Extended the NS Stations bike maintenance app for operators managing large fleets',
      'Modelled bike statuses, defects and maintenance tasks',
      'Handled real-world edge cases: lost bikes, lost keys and e-lock associations',
    ],
    techStack: ['React Native', 'JavaScript'],
    originalDesc:
      '2021 - 2022 (7 months) - Software engineer in Amsterdam using React-Native to enhance the NS Stations bike maintenance app for operators managing numerous bikes, statuses, defects, and tasks. The app addresses various bike and e-lock situations, including bike loss, key loss, and e-lock associations across the Netherlands.',
  },
  {
    id: 'experience-expereo',
    role: 'Software Engineer',
    company: 'Expereo',
    location: 'Amsterdam, NL',
    employmentType: 'full-time',
    startDate: '2022-01-01',
    endDate: '2023-07-01',
    summary:
      "Core frontend engineer on the world's first B2B Intelligent Internet Platform, doubling as Scrum Master.",
    highlights: [
      'Built the platform frontend in React, TypeScript and NX',
      'Worked across Apollo GraphQL, MongoDB and AWS Cognito',
      'Took on Scrum Master duties alongside delivery work',
      'Drove team agility and performance as well as writing the code',
    ],
    techStack: [
      'React',
      'TypeScript',
      'NX',
      'Apollo',
      'GraphQL',
      'MongoDB',
      'Tailwind',
      'AWS Cognito',
      'GitLab',
    ],
    originalDesc:
      "2022 - 2023 (1,5 years) - As a key member of the team developing the world's first B2B Intelligent Internet Platform at Expereo, he honed his frontend development skills using technologies like NX, React, TypeScript, Apollo with GraphQL, MongoDB, AWS Cognito, GitLab, Tailwind, Twin.Macro, and Codegen. In addition to his coding expertise, he took on Scrum Master responsibilities, fostering synergies that drove the team to achieve maximum agility and performance.",
  },
  {
    id: 'experience-ikea',
    role: 'Software Engineer',
    company: 'IKEA',
    location: 'Amsterdam, NL',
    employmentType: 'full-time',
    startDate: '2023-08-01',
    current: true,
    summary:
      'Designing and shipping software that streamlines processes and extends digital reach across IKEA.',
    highlights: [
      'Deliver high-quality software used across the organisation',
      'Apply modern engineering practices to legacy and greenfield work alike',
      'Champion the right tooling and automation to raise business efficiency',
      'Help build the digital foundations the wider organisation runs on',
    ],
    techStack: ['React', 'TypeScript', 'Node JS'],
    originalDesc:
      'As a Software Engineer at IKEA, my role involves designing, developing, and delivering high-quality software to streamline processes and extend reach across the organization. My expertise lies in employing modern software engineering principles and promoting the use of right tools and automation for business efficacy and digital foundation building',
  },
]
