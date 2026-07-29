import type { ComponentType } from 'react'
import type { SectionId } from '@/types/sanity'

/**
 * Wraps a section in the shared page shell.
 *
 * The social rail, navigation dots and copyright used to be rendered here,
 * which meant seven copies of each - seven copyright lines down the page, and
 * seven subscriptions to the site settings query. They now live once in App,
 * fixed to the viewport, which is what they always looked like they were.
 */
const AppWrap = (Component: ComponentType, idName: SectionId, classNames = '') =>
  function HOC() {
    return (
      <section id={idName} className={`app__container ${classNames}`}>
        <div className='app__wrapper app__flex'>
          <Component />
        </div>
      </section>
    )
  }

export default AppWrap
