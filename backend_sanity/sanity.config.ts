import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {schemaTypes} from './schemas'

/**
 * Types that must have exactly one document. They get a fixed document id, are
 * pinned to the top of the desk, and are hidden from the generic type list so a
 * second one cannot be created by accident.
 */
const SINGLETONS = ['siteSettings', 'aboutSection']

// Types listed here are reordered by dragging rather than by a number field, so
// they get their own desk item and are removed from the generic list to avoid
// two entries that order differently.
const ORDERABLE = ['testimonials']

export default defineConfig({
  name: 'default',
  title: 'mvmories_portfolio',

  projectId: 'khsof0do',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
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
            S.listItem()
              .title('About section')
              .id('aboutSection')
              .child(
                S.document()
                  .schemaType('aboutSection')
                  .documentId('aboutSection')
                  .title('About section'),
              ),
            S.divider(),
            orderableDocumentListDeskItem({
              type: 'testimonials',
              title: 'Testimonials',
              S,
              context,
            }),
            ...S.documentTypeListItems().filter(
              (item) =>
                !SINGLETONS.includes(item.getId() ?? '') && !ORDERABLE.includes(item.getId() ?? ''),
            ),
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
