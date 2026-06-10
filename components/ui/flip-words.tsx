'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FlipWordsProps {
  words: string[]
  interval?: number
  className?: string
}

/** Cycles through words with a vertical flip (Aceternity Flip Words-inspired). */
export function FlipWords({ words, interval = 2400, className }: FlipWordsProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  return (
    <span className={cn('relative inline-grid overflow-hidden align-bottom', className)}>
      {/* Reserve width of the longest word to avoid layout shift */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: '105%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-105%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
