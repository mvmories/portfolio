import type { SectionId } from '@/types/sanity'

/** Single source of truth for the nav links and navigation dots. */
export const SECTIONS: readonly SectionId[] = [
  'home',
  'about',
  'work',
  'experience',
  'testimonials',
  'contact',
] as const
