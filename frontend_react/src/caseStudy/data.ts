/**
 * Facts behind the PowerByJS case study.
 *
 * Everything here is taken from the project's own record rather than from
 * memory: the signed brief and competitor study in the project workspace, and
 * the source of the site itself. Nothing on the page is an estimate. If a
 * number cannot be traced back to one of those two places, it does not belong
 * in this file.
 */

export const COMPETITORS = [
  {
    name: 'Ultimate Performance',
    place: 'Amsterdam',
    sells: 'Data',
    detail:
      'Personalised plans built from over 150 tracked data points, documented transformations and formal accountability systems.',
  },
  {
    name: 'Omnia Personal Training',
    place: 'Amsterdam',
    sells: 'Environment',
    detail:
      'A luxury training studio, holistic programmes covering both physical and mental wellbeing, and a premium price to match.',
  },
  {
    name: 'Gym Haarlem',
    place: 'Haarlem',
    sells: 'Community',
    detail:
      'A strong local presence on his doorstep, tailored group classes and the familiarity of a gym people already belong to.',
  },
] as const

export const PERSONAS = [
  {
    name: 'Motivated Mark',
    line: 'Tech wizard by day, gym warrior by night',
    note: 'Sedentary desk job, wants structure and an extra push to stay on track.',
  },
  {
    name: 'Wellness Wendy',
    line: 'Marketing mind, wellness at heart',
    note: 'Treats training as part of a wider wellbeing routine, not as a sport.',
  },
  {
    name: 'Dedicated Daniel',
    line: 'Boardroom strategist, fitness enthusiast',
    note: 'Time poor and results driven, buys expertise rather than access to a gym.',
  },
  {
    name: 'Fitness-Focused Fiona',
    line: 'Consulting for success, training for strength',
    note: 'Already trains seriously, looking for someone who can take her further.',
  },
] as const

export const BRAND_COLOURS = [
  { name: 'Eerie Black', hex: '#222222', role: 'Primary' },
  { name: 'Night Black', hex: '#111111', role: 'Secondary' },
  { name: 'Anti-Flash White', hex: '#F1F1F1', role: 'Secondary' },
  { name: 'Flax', hex: '#FAF19F', role: 'Gold' },
  { name: 'Golden Brown', hex: '#8F5E25', role: 'Gold' },
  { name: 'Platinum', hex: '#ECECEC', role: 'Silver' },
  { name: 'Battleship Gray', hex: '#8C8C8C', role: 'Silver' },
] as const

export const TONE = [
  { word: 'Calm', detail: 'Every interaction should leave a client feeling supported rather than sold to.' },
  { word: 'Kind', detail: 'Warmth and respect first, because the audience is often starting from insecurity.' },
  { word: 'Confident', detail: 'Assurance without bravado, so the expertise reads as trustworthy.' },
] as const

/**
 * The three pricing models, transcribed from `PricingCard.tsx`. They are
 * genuinely different shapes, which is the point: one calculator with a
 * multiplier could not have expressed them.
 */
export const PRICING_MODELS = [
  {
    name: 'Coaching',
    rate: '€125',
    unit: 'per session',
    formula: 'sessions × €125 ÷ people',
    detail:
      'Split evenly when a session is shared, so two people booking together each see their own honest number rather than the headline rate.',
  },
  {
    name: 'Personal training',
    rate: '€75',
    unit: 'per session',
    formula: '(sessions − free) × €75 ÷ people',
    detail:
      'His package deal is "22 sessions for the price of 20". Above ten sessions the calculator drops one from the total, above twenty-one it drops two, so the discount applies itself instead of waiting for a conversation.',
  },
  {
    name: 'Specialised programmes',
    rate: '€1,240',
    unit: 'per 12 week block',
    formula: 'weekly rate × 12 ÷ people, +€400 for a second person',
    detail:
      'Four weekly intensities from one session a week up to four, running €1,240 to €3,280, with a surcharge rather than a split when the block is shared because the coaching load genuinely doubles.',
  },
] as const

export const STACK = [
  'React 18',
  'TypeScript',
  'Vite',
  'Tailwind v4',
  'Framer Motion',
  'React Router',
  'i18next',
  'Headless UI',
  'Sanity',
  'Netlify Functions',
  'Resend',
] as const
