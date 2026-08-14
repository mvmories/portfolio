export default {
  name: 'works',
  title: 'Works',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },

    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description:
        'What you owned on this project, in prose. The disciplines belong in a sentence rather than in tags: as chips they sit at the same weight as the framework names and read as a service menu.',
      validation: (Rule: SanityRule) => Rule.max(400),
    },
    {
      name: 'outcome',
      title: 'Outcome',
      type: 'string',
      description:
        'One line on what the project achieved for whoever paid for it, not what it was built with. A screenshot and a tech list is not a portfolio entry.',
      validation: (Rule: SanityRule) => Rule.max(120),
    },
    {
      name: 'projectLink',
      title: 'Project Link',
      type: 'string',
    },
    {
      name: 'codeLink',
      title: 'Code Link',
      type: 'string',
    },
    {
      name: 'imgUrl',
      title: 'ImageUrl',
      type: 'image',
      options: {
        hotspot: true,
      },
    },

    {
      name: 'tags',
      title: 'Tags',
      description:
        'The stack only. What you owned belongs in the description, where it reads as ownership rather than as a list of services for hire.',
      type: 'array',
      of: [
        {
          name: 'tag',
          title: 'Tag',
          type: 'string',
        },
      ],
    },
  ],
}

interface SanityRule {
  max: (length: number) => SanityRule
}
