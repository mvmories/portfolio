import type { ComponentType } from 'react'
import { motion } from 'framer-motion'

import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

const MotionWrap = (Component: ComponentType, classNames = '') =>
  function HOC() {
    const prefersReducedMotion = usePrefersReducedMotion()

    // A 100px slide plus a fade on every section is precisely the movement
    // people disable motion to avoid, and framer animates inline styles from
    // JavaScript, so the CSS `prefers-reduced-motion` block never reached it.
    if (prefersReducedMotion) {
      return (
        <div className={`${classNames} app__flex`}>
          <Component />
        </div>
      )
    }

    return (
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        // Without `once` the entrance replayed every time a section scrolled
        // back into view, so moving up the page re-animated content that had
        // already been read. `amount` holds it until the section is meaningfully
        // on screen rather than firing on its first pixel.
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`${classNames} app__flex`}
      >
        <Component />
      </motion.div>
    )
  }

export default MotionWrap
