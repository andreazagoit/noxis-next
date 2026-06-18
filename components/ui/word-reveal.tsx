'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface WordRevealProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  /** preserves newlines in the source string as line breaks */
  preserveLineBreaks?: boolean
  /** Wrapper element (default: span). Use 'div' or 'h2' if needed semantically */
  as?: 'span' | 'div'
  /**
   * Render the text visible immediately (no initial opacity:0 / y offset).
   * Use for above-the-fold LCP-critical text to avoid blocking Largest
   * Contentful Paint on the entry animation.
   */
  eager?: boolean
}

const EASE = [0.33, 1, 0.68, 1] as const

export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.04,
  duration = 0.6,
  preserveLineBreaks = false,
  as = 'span',
  eager = false,
}: WordRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const lines = preserveLineBreaks ? text.split('\n') : [text]

  // Eager mode: render plain text without motion wrappers.
  // Critical for LCP — the text is painted on first frame, no animation gate.
  if (eager) {
    const Wrapper = as
    return (
      <Wrapper className={cn('inline', className)}>
        {lines.map((line, i) => (
          <span
            key={i}
            className={cn(preserveLineBreaks ? 'block' : 'inline')}
          >
            {line}
          </span>
        ))}
      </Wrapper>
    )
  }

  let wordIndex = 0

  const Wrapper = as
  return (
    <Wrapper
      ref={ref as React.RefObject<HTMLSpanElement & HTMLDivElement>}
      className={cn('inline', className)}
    >
      {lines.map((line, lineIdx) => {
        const words = line.split(' ')
        return (
          <span
            key={lineIdx}
            className={cn(preserveLineBreaks ? 'block' : 'inline')}
          >
            {words.map((word, i) => {
              const idx = wordIndex++
              return (
                <span
                  key={`${lineIdx}-${i}`}
                  className="inline-block overflow-hidden align-bottom"
                  style={{ paddingBottom: '0.15em', marginBottom: '-0.15em' }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
                    transition={{
                      duration,
                      delay: delay + idx * stagger,
                      ease: EASE,
                    }}
                  >
                    {word}
                  </motion.span>
                  {i < words.length - 1 && <span>&nbsp;</span>}
                </span>
              )
            })}
          </span>
        )
      })}
    </Wrapper>
  )
}
