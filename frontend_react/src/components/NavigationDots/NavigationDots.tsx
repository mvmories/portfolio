import { SECTIONS } from '@/constants/sections'
import { useActiveSection } from '@/lib/useActiveSection'
import './NavigationDots.scss'

const NavigationDots = () => {
  const active = useActiveSection()

  return (
    <nav className='app__navigation' aria-label='Section navigation'>
      {SECTIONS.map((item) => (
        <a
          href={`#${item}`}
          key={item}
          aria-label={`Go to ${item} section`}
          aria-current={active === item ? 'true' : undefined}
          className='app__navigation-dot'
        />
      ))}
    </nav>
  )
}

export default NavigationDots
