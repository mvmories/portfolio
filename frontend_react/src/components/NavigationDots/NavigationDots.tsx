import { SECTIONS } from '@/constants/sections'
import type { SectionId } from '@/types/sanity'

interface Props {
  active: SectionId
}

const NavigationDots = ({ active }: Props) => (
  <nav className='app__navigation' aria-label='Section navigation'>
    {SECTIONS.map((item) => (
      <a
        href={`#${item}`}
        key={item}
        aria-label={`Go to ${item} section`}
        aria-current={active === item ? 'true' : undefined}
        className='app__navigation-dot'
        style={active === item ? { backgroundColor: '#313BAC' } : {}}
      />
    ))}
  </nav>
)

export default NavigationDots
