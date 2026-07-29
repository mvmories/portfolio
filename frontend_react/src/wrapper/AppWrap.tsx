import type { ComponentType } from 'react'
import { NavigationDots, SocialMedia } from '@/components'
import type { SectionId } from '@/types/sanity'

const AppWrap = (Component: ComponentType, idName: SectionId, classNames = '') =>
  function HOC() {
    return (
      <section id={idName} className={`app__container ${classNames}`}>
        <SocialMedia />
        <div className='app__wrapper app__flex'>
          <Component />

          <div className='copyright'>
            <p className='p-text'>@{new Date().getFullYear()} MIGUEL VILHENA</p>
            <p className='p-text'>All rights reserved</p>
          </div>
        </div>
        <NavigationDots active={idName} />
      </section>
    )
  }

export default AppWrap
