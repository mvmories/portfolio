/**
 * A single role, held flat.
 *
 * The previous model nested roles inside `experiences[].works[]`, keyed by a
 * string year, with the date range written into the description prose
 * ("2015 - 2018 (3 years) - Responsibilities included..."). Dates that live
 * inside a sentence cannot be sorted, compared or formatted, which is why the
 * section could only ever render one long paragraph per role.
 *
 * Splitting the prose into a one-line `summary` and a few `highlights` is what
 * lets the timeline show something useful before it is expanded.
 */

interface SanityRule {
  required: () => SanityRule
  min: (n: number) => SanityRule
  max: (n: number) => SanityRule
  warning: (msg: string) => SanityRule
  custom: (fn: (value: unknown, context: unknown) => true | string) => SanityRule
  uri: (opts: {scheme: string[]}) => SanityRule
}

interface ExperienceDoc {
  startDate?: string
  current?: boolean
}

const EMPLOYMENT_TYPES = [
  {title: 'Full-time', value: 'full-time'},
  {title: 'Contract', value: 'contract'},
  {title: 'Freelance', value: 'freelance'},
  {title: 'Founder', value: 'founder'},
  {title: 'Internship', value: 'internship'},
]

export default {
  name: 'experience',
  title: 'Experience',
  type: 'document',

  groups: [
    {name: 'role', title: 'Role', default: true},
    {name: 'dates', title: 'Dates'},
    {name: 'content', title: 'Content'},
  ],

  fields: [
    {
      name: 'role',
      title: 'Job title',
      type: 'string',
      group: 'role',
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
      group: 'role',
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'companyUrl',
      title: 'Company website',
      type: 'url',
      description: 'Optional. Turns the company name into a link.',
      group: 'role',
      validation: (Rule: SanityRule) => Rule.uri({scheme: ['https']}),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Amsterdam, NL" or "Remote".',
      group: 'role',
    },
    {
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      options: {list: EMPLOYMENT_TYPES},
      group: 'role',
    },

    {
      name: 'startDate',
      title: 'Started',
      type: 'date',
      // Only the month matters on a CV, and asking for a day invites made-up
      // precision. The stored value is still a real date, so it sorts correctly.
      options: {dateFormat: 'MMMM YYYY'},
      description: 'The month is used to work out how long you were there.',
      group: 'dates',
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'current',
      title: 'This is my current role',
      type: 'boolean',
      initialValue: false,
      description: 'Shows "Present" instead of an end date.',
      group: 'dates',
    },
    {
      name: 'endDate',
      title: 'Ended',
      type: 'date',
      options: {dateFormat: 'MMMM YYYY'},
      description: 'The last month you worked there, which is counted in the duration.',
      hidden: ({parent}: {parent?: ExperienceDoc}) => Boolean(parent?.current),
      group: 'dates',
      validation: (Rule: SanityRule) =>
        Rule.custom((value: unknown, context: unknown) => {
          const doc = (context as {parent?: ExperienceDoc})?.parent
          if (doc?.current) return true
          if (!value) return 'Add an end date, or tick "This is my current role".'
          if (doc?.startDate && String(value) < doc.startDate) {
            return 'The end date is before the start date.'
          }
          return true
        }),
    },

    {
      name: 'summary',
      title: 'One-line summary',
      type: 'text',
      rows: 2,
      description:
        'The only description shown before the card is expanded, so make it the ' +
        'single most compelling thing about the role. Aim for 100-160 characters.',
      group: 'content',
      validation: (Rule: SanityRule) => Rule.required().max(200),
    },
    {
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Shown when the card is expanded. Short, scannable, one achievement each. ' +
        'Start with a verb. Two to five works best; more and nobody reads them.',
      group: 'content',
      validation: (Rule: SanityRule) => Rule.max(6),
    },
    {
      name: 'techStack',
      title: 'Tech used',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      // Deliberately plain strings rather than references to `skills`: half of
      // these (Java, OutSystems, .NET Core) have no skills document, and adding
      // one just to satisfy a reference would put icons in the skills grid that
      // do not belong there.
      description: 'Rendered as chips. Matching names reuse the icon from Skills.',
      group: 'content',
    },
  ],

  orderings: [
    {
      title: 'Most recent first',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
  ],

  preview: {
    select: {title: 'role', company: 'company', startDate: 'startDate', current: 'current'},
    prepare({
      title,
      company,
      startDate,
      current,
    }: {
      title?: string
      company?: string
      startDate?: string
      current?: boolean
    }) {
      const year = startDate ? startDate.slice(0, 4) : '?'
      return {
        title: title || 'Untitled role',
        subtitle: [company, `${year}${current ? ' - present' : ''}`].filter(Boolean).join(' · '),
      }
    },
  },
}
