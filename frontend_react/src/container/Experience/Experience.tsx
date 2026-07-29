import { useEffect, useId, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineChevronDown, HiOutlineExternalLink, HiOutlineLocationMarker } from 'react-icons/hi'

import { AppWrap, MotionWrap } from '@/wrapper'
import { safeFetch, urlFor } from '@/lib/client'
import { byMostRecent, formatDuration, formatRange } from '@/lib/dates'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { useSkills } from '@/lib/useSkills'
import type { ExperienceFields, Skill } from '@/types/sanity'
import './Experience.scss'

const QUERY = `*[_type == "experience"]{
  _id, role, company, companyUrl, location, employmentType,
  startDate, endDate, current, summary, highlights, techStack
}`

const EMPLOYMENT_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  contract: 'Contract',
  freelance: 'Freelance',
  founder: 'Founder',
  internship: 'Internship',
}

/**
 * A tech chip, reusing the icon from the Skills grid when the name matches.
 *
 * Matched by name because `techStack` is free text: half of it (Java,
 * OutSystems, .NET Core) has no skills document, and creating one purely to
 * satisfy a reference would put icons in the skills grid that do not belong
 * there. Anything unmatched renders as a plain text chip.
 */
const TechChip = ({ tech, skill }: { tech: string; skill?: Skill }) => (
  <li className='app__experience-chip'>
    {skill?.icon && (
      <img
        src={urlFor(skill.icon).width(32).height(32).auto('format').quality(80).url()}
        alt=''
        aria-hidden='true'
        width={16}
        height={16}
        loading='lazy'
        decoding='async'
      />
    )}
    {tech}
  </li>
)

const ExperienceCard = ({
  experience,
  skillsByName,
  isOpen,
  onToggle,
  reducedMotion,
}: {
  experience: ExperienceFields
  skillsByName: Map<string, Skill>
  isOpen: boolean
  onToggle: () => void
  reducedMotion: boolean
}) => {
  const panelId = useId()
  const headingId = useId()
  const { role, company, companyUrl, location, employmentType, current, summary } = experience

  const range = formatRange(experience.startDate, experience.endDate, current)
  const duration = formatDuration(experience.startDate, experience.endDate, current)
  const highlights = experience.highlights ?? []
  const techStack = experience.techStack ?? []
  const hasDetail = highlights.length > 0 || techStack.length > 0 || Boolean(companyUrl)

  return (
    <li className={`app__experience-item${current ? ' is-current' : ''}`}>
      <span className='app__experience-dot' aria-hidden='true' />

      <div className='app__experience-card'>
        {/*
          The whole header is the control, so the tap target is the entire card
          rather than a small chevron. The old section relied on hover, which
          does not exist on a touch screen.
        */}
        <button
          type='button'
          className='app__experience-trigger'
          aria-expanded={isOpen}
          aria-controls={hasDetail ? panelId : undefined}
          onClick={onToggle}
          disabled={!hasDetail}
        >
          <span className='app__experience-heading'>
            <span className='app__experience-role bold-text' id={headingId}>
              {role}
            </span>
            <span className='app__experience-company'>
              {company}
              {employmentType && EMPLOYMENT_LABELS[employmentType] && (
                <span className='app__experience-type'> · {EMPLOYMENT_LABELS[employmentType]}</span>
              )}
            </span>
          </span>

          <span className='app__experience-meta'>
            <span className='app__experience-range'>
              {range}
              {duration && <span className='app__experience-duration'> · {duration}</span>}
            </span>
            {location && (
              <span className='app__experience-location'>
                <HiOutlineLocationMarker aria-hidden='true' />
                {location}
              </span>
            )}
          </span>

          <span className='app__experience-summary'>{summary}</span>

          {hasDetail && (
            <span className={`app__experience-chevron${isOpen ? ' is-open' : ''}`} aria-hidden='true'>
              <HiOutlineChevronDown />
            </span>
          )}
        </button>

        <AnimatePresence initial={false}>
          {isOpen && hasDetail && (
            <motion.div
              key='panel'
              id={panelId}
              role='region'
              aria-labelledby={headingId}
              initial={reducedMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.4, 0, 0.2, 1] }}
              className='app__experience-panel'
            >
              <div className='app__experience-panel-inner'>
                {highlights.length > 0 && (
                  <ul className='app__experience-highlights'>
                    {highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}

                {techStack.length > 0 && (
                  <ul className='app__experience-chips' aria-label={`Tech used at ${company}`}>
                    {techStack.map((tech) => (
                      <TechChip
                        key={tech}
                        tech={tech}
                        skill={skillsByName.get(tech.toLowerCase())}
                      />
                    ))}
                  </ul>
                )}

                {companyUrl && (
                  <a
                    className='app__experience-link'
                    href={companyUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Visit {company}
                    <HiOutlineExternalLink aria-hidden='true' />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  )
}

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceFields[]>([])
  const skills = useSkills()
  const [openIds, setOpenIds] = useState<string[]>([])
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    safeFetch<ExperienceFields[]>(QUERY, []).then((docs) => {
      setExperiences(docs)
      // The most recent role starts expanded, so the section never presents as a
      // wall of collapsed bars with nothing to read.
      const mostRecent = [...docs].sort(byMostRecent)[0]
      if (mostRecent) setOpenIds([mostRecent._id])
    })
  }, [])

  const sorted = useMemo(() => [...experiences].sort(byMostRecent), [experiences])

  const skillsByName = useMemo(
    () => new Map(skills.map((skill) => [skill.name.toLowerCase(), skill])),
    [skills]
  )

  const allOpen = sorted.length > 0 && openIds.length === sorted.length

  const toggle = (id: string) =>
    setOpenIds((open) => (open.includes(id) ? open.filter((x) => x !== id) : [...open, id]))

  // Rendering nothing beats rendering an empty timeline rail with a heading.
  if (sorted.length === 0) return null

  return (
    <>
      <h2 className='head-text'>
        Where I&apos;ve <span>worked</span>
      </h2>

      <div className='app__experience-actions'>
        <button
          type='button'
          className='app__experience-toggle-all'
          onClick={() => setOpenIds(allOpen ? [] : sorted.map((item) => item._id))}
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <ol className='app__experience-list'>
        {sorted.map((experience) => (
          <ExperienceCard
            key={experience._id}
            experience={experience}
            skillsByName={skillsByName}
            isOpen={openIds.includes(experience._id)}
            onToggle={() => toggle(experience._id)}
            reducedMotion={reducedMotion}
          />
        ))}
      </ol>
    </>
  )
}

export default AppWrap(MotionWrap(Experience, 'app__experience'), 'experience', 'app__whitebg')
