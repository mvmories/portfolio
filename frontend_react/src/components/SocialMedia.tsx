import type { IconType } from 'react-icons'
import {
  BsLinkedin,
  BsGithub,
  BsFillFileEarmarkTextFill,
  BsTwitterX,
  BsInstagram,
  BsGlobe2,
} from 'react-icons/bs'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

import { useCv } from '@/lib/useCv'
import { useSiteSettings } from '@/lib/useSiteSettings'
import type { SocialPlatform } from '@/types/sanity'

const PLATFORMS: Record<SocialPlatform, { Icon: IconType; label: string }> = {
  linkedin: { Icon: BsLinkedin, label: 'LinkedIn' },
  github: { Icon: BsGithub, label: 'GitHub' },
  twitter: { Icon: BsTwitterX, label: 'X' },
  instagram: { Icon: BsInstagram, label: 'Instagram' },
  website: { Icon: BsGlobe2, label: 'Website' },
}

const SocialMedia = () => {
  const { socials } = useSiteSettings()
  // Null when there is nothing worth linking to, which hides the button rather
  // than rendering one that leads nowhere.
  const cv = useCv()

  return (
    <div className='app__social'>
      {cv && (
        <a
          href={cv.viewUrl}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={cv.tooltip}
          data-testid='cv-link'
        >
          <Tippy content={cv.tooltip} className='tippy-tooltip' placement='right'>
            <div>
              <BsFillFileEarmarkTextFill />
            </div>
          </Tippy>
        </a>
      )}

      {socials?.map(({ platform, url, label, _key }) => {
        const meta = PLATFORMS[platform]
        // Guards against a platform added in Sanity but not yet known here.
        if (!meta) return null

        const { Icon } = meta
        const accessibleLabel = label?.trim() || `My ${meta.label}`

        return (
          <a
            key={_key ?? url}
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={accessibleLabel}
          >
            <Tippy content={accessibleLabel} className='tippy-tooltip' placement='right'>
              <div>
                <Icon />
              </div>
            </Tippy>
          </a>
        )
      })}
    </div>
  )
}

export default SocialMedia
