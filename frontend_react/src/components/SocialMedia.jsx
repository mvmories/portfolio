import React from 'react'
import { BsLinkedin, BsGithub, BsFillFileEarmarkTextFill } from 'react-icons/bs'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

const SocialMedia = () => (
  <div className='app__social'>
    <a
      href='https://drive.google.com/file/d/1UzYCsJGdeNB5LJ3TGRXbz9GtKPrSzdee/view?usp=share_link'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Tippy
        content='My CV'
        className='tippy-tooltip'
        placement='right'
      >
        <div>
          <BsFillFileEarmarkTextFill />
        </div>
      </Tippy>
    </a>

    <a
      href='https://www.linkedin.com/in/miguel-vilhena-215aa590/'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Tippy
        content='My LinkedIn'
        className='tippy-tooltip'
        placement='right'
      >
        <div>
          <BsLinkedin />
        </div>
      </Tippy>
    </a>

    <a
      href='https://github.com/mvmories'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Tippy
        content='My Github'
        className='tippy-tooltip'
        placement='right'
      >
        <div>
          <BsGithub />
        </div>
      </Tippy>
    </a>
  </div>
)

export default SocialMedia
