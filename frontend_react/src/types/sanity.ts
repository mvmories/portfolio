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

export interface WorkExperience {
  _key?: string
  name: string
  company: string
  desc: string
}

export interface Experience extends SanityDocument {
  _type: 'experiences'
  year: string
  works: WorkExperience[]
}

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

export type SectionId = 'home' | 'about' | 'work' | 'skills' | 'testimonials' | 'contact'
