/**
 * Shapes of the documents stored in the Sanity `production` dataset.
 * Kept hand-written for now; once the schemas settle these can be generated
 * with `sanity typegen` so the studio stays the single source of truth.
 */

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
}

export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

export interface About extends SanityDocument {
  _type: 'about'
  title: string
  description: string
  imgUrl: SanityImage
}

export interface Work extends SanityDocument {
  _type: 'works'
  title: string
  description: string
  projectLink?: string
  codeLink?: string
  imgUrl: SanityImage
  tags?: string[]
}

export interface Skill extends SanityDocument {
  _type: 'skills'
  name: string
  bgColor: string
  icon: SanityImage
}

/**
 * Superseded by `Experience`. The nested shape kept the date range inside the
 * description prose, so it could not be sorted or formatted. Retained only until
 * the migrated documents are confirmed.
 */
export interface WorkExperience {
  _key?: string
  name: string
  company: string
  desc: string
}

/** @deprecated Use {@link Experience}. */
export interface LegacyExperience extends SanityDocument {
  _type: 'experiences'
  year: string
  works: WorkExperience[]
}

export type EmploymentType = 'full-time' | 'contract' | 'freelance' | 'founder' | 'internship'

export interface Experience extends SanityDocument {
  _type: 'experience'
  role: string
  company: string
  companyUrl?: string
  location?: string
  employmentType?: EmploymentType
  startDate: string
  endDate?: string
  current?: boolean
  summary: string
  highlights?: string[]
  techStack?: string[]
}

/**
 * What the timeline's GROQ projection actually returns.
 *
 * The query selects named fields, so the document metadata is genuinely absent
 * at runtime. Typing the result as a full `Experience` would promise callers
 * three fields that are never there.
 */
export type ExperienceFields = Omit<Experience, '_createdAt' | '_updatedAt' | '_rev'>

export interface Testimonial extends SanityDocument {
  _type: 'testimonials'
  name: string
  company: string
  role: string
  imgurl: SanityImage
  feedback: string
}

export interface Brand extends SanityDocument {
  _type: 'brands'
  name: string
  imgUrl: SanityImage
}

export interface ContactSubmission {
  _type: 'contact'
  name: string
  email: string
  message: string
}

export type SocialPlatform = 'linkedin' | 'github' | 'twitter' | 'instagram' | 'website'

export interface SocialLink {
  _key?: string
  platform: SocialPlatform
  url: string
  label?: string
}

/** Singleton — always fetched by the fixed id `siteSettings`. */
export interface SiteSettings {
  _type: 'siteSettings'
  cvEnabled?: boolean
  cvUrl?: string
  cvLabel?: string
  cvUpdatedAt?: string
  socials?: SocialLink[]
}

export type SectionId =
  | 'home'
  | 'about'
  | 'work'
  | 'experience'
  | 'skills'
  | 'testimonials'
  | 'contact'
