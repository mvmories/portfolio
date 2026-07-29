import { BsLinkedin, BsGithub, BsFillFileEarmarkTextFill } from 'react-icons/bs'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

// TODO(P1-B): source these from the Sanity `siteSettings` singleton.
const LINKS = [
  {
    label: 'My CV',
    href: 'https://drive.google.com/file/d/1UzYCsJGdeNB5LJ3TGRXbz9GtKPrSzdee/view?usp=share_link',
    Icon: BsFillFileEarmarkTextFill,
  },
  {
    label: 'My LinkedIn',
    href: 'https://www.linkedin.com/in/miguel-vilhena-215aa590/',
    Icon: BsLinkedin,
  },
  {
    label: 'My Github',
    href: 'https://github.com/mvmories',
    Icon: BsGithub,
  },
] as const

const SocialMedia = () => (
  <div className='app__social'>
    {LINKS.map(({ label, href, Icon }) => (
      <a key={label} href={href} target='_blank' rel='noopener noreferrer' aria-label={label}>
        <Tippy content={label} className='tippy-tooltip' placement='right'>
          <div>
            <Icon />
          </div>
        </Tippy>
      </a>
    ))}
  </div>
)

export default SocialMedia
