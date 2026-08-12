interface SanityRule {
  required: () => SanityRule
  max: (n: number) => SanityRule
  uri: (opts: { scheme: string[] }) => SanityRule
  warning: (message?: string) => SanityRule
}

export default {
  name: 'testimonials',
  title: 'Testimonials',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description:
        'Full name as it appears on LinkedIn. A surname is not optional: a first name alone reads as unverifiable next to full ones.',
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'company',
      title: 'Company (current)',
      type: 'string',
      description:
        'Where they work now. Someone who has since become a manager is a stronger endorsement than the title they held at the time, so this is deliberately the current one.',
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Role (current)',
      type: 'string',
      description: 'Their job title now, alongside the company above.',
      validation: (Rule: SanityRule) => Rule.required(),
    },
    {
      name: 'workedTogetherAt',
      title: 'Worked together at',
      type: 'string',
      description:
        'The company where you actually worked together, if it is not the one above. Leave empty when they are the same. Without this, a reader assumes you worked at their current employer, which is a false claim sitting directly above a logo strip headed "Where I have done it".',
    },
    {
      name: 'linkedInUrl',
      title: 'LinkedIn profile',
      type: 'url',
      description: 'Their profile. An attributable quote is worth several unattributable ones.',
      validation: (Rule: SanityRule) => Rule.uri({ scheme: ['https'] }),
    },
    {
      name: 'imgurl',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional. Without one the card falls back to their initials.',
    },
    {
      name: 'feedback',
      title: 'Quote',
      type: 'text',
      rows: 6,
      description:
        'Verbatim only. Clip freely and use an ellipsis, but never reword: anyone who checks LinkedIn will notice. Aim for the forty words that say something about the work.',
      validation: (Rule: SanityRule) =>
        Rule.required().max(600).warning('Longer than this and nobody finishes it. Clip harder.'),
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description:
        'Featured quotes show immediately; the rest sit behind "Read all recommendations". Keep this to about six, chosen for what they say about the work and for a spread of companies.',
    },
    {
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description:
        'Lower shows first. Lead with the quotes that talk about the work rather than the personality.',
    },
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      company: 'company',
      role: 'role',
      featured: 'featured',
      media: 'imgurl',
    },
    prepare({
      title,
      company,
      role,
      featured,
      media,
    }: {
      title?: string
      company?: string
      role?: string
      featured?: boolean
      media?: unknown
    }) {
      return {
        title: `${featured ? '\u2605 ' : ''}${title ?? 'Unnamed'}`,
        subtitle: [role, company].filter(Boolean).join(', '),
        media,
      }
    },
  },
}
