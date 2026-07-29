import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

/**
 * Types that must have exactly one document. They get a fixed document id, are
 * pinned to the top of the desk, and are hidden from the generic type list so a
 * second one cannot be created by accident.
 */
const SINGLETONS = ['siteSettings']

export default defineConfig({
  name: 'default',
  title: 'mvmories_portfolio',

  projectId: 'khsof0do',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site settings'),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId() ?? '')),
          ]),
    }),
    visionTool(),
  ],

  // Deleting or duplicating a singleton would break the fixed-id lookup the
  // frontend relies on, so those actions are removed rather than left to chance.
  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(
            ({action}) => action !== 'unpublish' && action !== 'delete' && action !== 'duplicate',
          )
        : input,
  },

  schema: {
    types: schemaTypes,
  },
})
