/**
 * The About section, as one document rather than a set of cards.
 *
 * The previous model was N repeated `about` documents, each a title plus a
 * one-line description rendered as a card. That shape could only ever produce
 * generic copy: a card has room for a label and a platitude, so the labels
 * became job titles (a stack acronym, "Backend Developer") and the descriptions
 * became filler. The shape caused the writing, not the other way round.
 *
 * A singleton with one narrative and a few numbers inverts that. Prose can be
 * specific, and the numbers carry the same weight the cards were pretending to
 * without asking the reader to believe an adjective.
 */

interface SanityRule {
  required: () => SanityRule
  min: (n: number) => SanityRule
  max: (n: number) => SanityRule
  warning: (msg: string) => SanityRule
}

export default {
  name: 'aboutSection',
  title: 'About section',
  type: 'document',
  fields: [
    {
      name: 'narrative',
      title: 'Narrative',
      type: 'text',
      rows: 6,
      description:
        'First person, 60-90 words. Say what you build, who for, and what you are unusually good at. No adjectives doing the work of facts. Leave empty to use the built-in default.',
      validation: (Rule: SanityRule) =>
        Rule.max(700).warning('Over about 90 words this stops being scannable.'),
    },
    {
      name: 'stats',
      title: 'Proof strip',
      type: 'array',
      description:
        'Three or four hard numbers, each one defensible from the CV. Numbers survive a five-second scan; adjectives do not.',
      validation: (Rule: SanityRule) => Rule.max(4),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'The number itself, e.g. "30".',
              validation: (Rule: SanityRule) => Rule.required().max(8),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'What it counts, e.g. "countries live".',
              validation: (Rule: SanityRule) => Rule.required().max(40),
            },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
    },
    {
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
      description:
        'A real photograph. Falls back to the bundled profile image when empty, so this is optional.',
    },
    {
      name: 'portraitAlt',
      title: 'Portrait alt text',
      type: 'string',
      description: 'Describes the photograph for screen readers. Defaults to your name.',
    },
  ],
  preview: {
    prepare: () => ({ title: 'About section' }),
  },
}
