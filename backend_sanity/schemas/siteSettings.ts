/**
 * Site-wide settings. Registered as a singleton in sanity.config.ts, so there
 * is exactly one of these documents and it cannot be deleted or duplicated.
 *
 * The CV lives in Google Drive rather than being uploaded here, so that
 * replacing it is a Drive operation rather than a publish step.
 */
export default {
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'cv', title: 'CV' },
    { name: 'contact', title: 'Contact' },
    { name: 'socials', title: 'Social links' },
  ],
  fields: [
    {
      name: 'heroTagline',
      title: 'Hero tagline',
      type: 'text',
      rows: 2,
      group: 'hero',
      description:
        'The single sentence under your name. Lead with the outcome, not the job title. Leave empty to use the built-in default.',
      validation: (Rule: SanityRule) => Rule.max(160),
    },
    {
      name: 'availabilityEnabled',
      title: 'Show the availability pill',
      type: 'boolean',
      group: 'hero',
      initialValue: true,
      description: 'Turn this off while you are not looking.',
    },
    {
      name: 'availabilityText',
      title: 'Availability text',
      type: 'string',
      group: 'hero',
      description: 'Defaults to "Open to new opportunities" when empty.',
      validation: (Rule: SanityRule) => Rule.max(48),
    },
    {
      name: 'contactNote',
      title: 'Note under the Contact heading',
      type: 'text',
      rows: 3,
      group: 'contact',
      description:
        'What you are open to, in your own words. Leave empty to use the built-in default. Avoid promising a response time you cannot keep every time.',
      validation: (Rule: SanityRule) => Rule.max(240),
    },
    {
      name: 'calUrl',
      title: 'Booking link',
      type: 'url',
      group: 'contact',
      description:
        'A scheduling link, offered next to the form as the secondary action. The link hides itself while this is empty, so an unfinished booking page is never exposed.',
      validation: (Rule: SanityRule) => Rule.uri({ scheme: ['https'] }),
    },
    {
      name: 'cvEnabled',
      title: 'Show the CV link',
      type: 'boolean',
      group: 'cv',
      initialValue: true,
      description: 'Turn this off to hide the CV button without losing the link.',
    },
    {
      name: 'cvUrl',
      title: 'Google Drive link',
      type: 'url',
      group: 'cv',
      description:
        'In Drive: Share → General access → Anyone with the link → Viewer, then Copy link and paste it here. Without the Viewer setting anyone opening it hits a permission wall.',
      validation: (Rule: SanityRule) =>
        Rule.uri({ scheme: ['https'] }).custom((value?: string) => {
          if (!value) return true
          return /^https:\/\/(drive|docs)\.google\.com\//.test(value)
            ? true
            : 'Must be a Google Drive or Google Docs link.'
        }),
    },
    {
      name: 'cvLabel',
      title: 'Link label',
      type: 'string',
      group: 'cv',
      description: 'Shown as the tooltip. Defaults to "My CV" when empty.',
    },
    {
      name: 'cvUpdatedAt',
      title: 'Last updated',
      type: 'date',
      group: 'cv',
      options: { dateFormat: 'MMMM YYYY' },
      description: 'Set this when you upload a new version. Signals freshness to recruiters.',
    },
    {
      name: 'socials',
      title: 'Social links',
      type: 'array',
      group: 'socials',
      description: 'Shown beside the CV link. Drag to reorder.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'X / Twitter', value: 'twitter' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Website', value: 'website' },
                ],
                layout: 'dropdown',
              },
              validation: (Rule: SanityRule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule: SanityRule) => Rule.required().uri({ scheme: ['https'] }),
            },
            {
              name: 'label',
              title: 'Accessible label',
              type: 'string',
              description: 'Read by screen readers. Defaults to the platform name.',
            },
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    },
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
}

/** Minimal shape of Sanity's validation builder — avoids depending on its types here. */
interface SanityRule {
  required: () => SanityRule
  max: (length: number) => SanityRule
  uri: (options: { scheme: string[] }) => SanityRule
  custom: (fn: (value?: string) => true | string) => SanityRule
}
