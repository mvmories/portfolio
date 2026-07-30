import testimonials from './testimonials'
import works from './works'
import brands from './brands'
import aboutSection from './aboutSection'
import skills from './skills'
import experience from './experience'
import workExperience from './workExperience'
import experiences from './experiences'
import contact from './contact'
import siteSettings from './siteSettings'

export const schemaTypes = [
  siteSettings,
  aboutSection,
  works,
  testimonials,
  brands,
  skills,
  experience,
  // Superseded by `experience`. Kept registered only so the old documents stay
  // readable in the Studio until the migrated data has been checked; both this
  // and `experiences` go once that is confirmed.
  workExperience,
  experiences,
  contact,
]
