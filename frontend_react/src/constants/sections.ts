import type { SectionId } from '@/types/sanity'

/**
 * Single source of truth for the nav links and navigation dots.
 *
 * Experience sits above work deliberately. The employed work is the strongest
 * evidence on the site and the side projects are the thinnest section, so the
 * original order made a visitor's second impression the weakest thing here.
 */
export const SECTIONS: readonly SectionId[] = [
  'home',
  'about',
  'experience',
  'work',
  'testimonials',
  'contact',
] as const
