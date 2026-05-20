'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import { useLoading } from '@/context/loading-context'

export function LoadingScreen() {
  const { progress: realProgress, active } = useProgress()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'complete' | 'reveal' | 'hidden'>('loading')
  const { setIsLoading } = useLoading()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        const step = 2
        const nextPotential = prev + step
        const effectiveReal = active ? realProgress : 100
        return Math.min(nextPotential, Math.max(prev, effectiveReal))
      })
    }, 20)

    return () => clearInterval(interval)
  }, [active, realProgress])

  useEffect(() => {
    if (progress === 100 && phase === 'loading') {
      setPhase('complete')
      setTimeout(() => setPhase('reveal'), 500)
    }
  }, [progress, phase])

  useEffect(() => {
    if (phase === 'reveal') {
      const startHeroTimer = setTimeout(() => setIsLoading(false), 500)
      const hideTimer = setTimeout(() => setPhase('hidden'), 1100)
      return () => {
        clearTimeout(startHeroTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [phase, setIsLoading])

  if (phase === 'hidden') return null

  const strips = Array.from({ length: 7 }, (_, i) => i)

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <AnimatePresence>
        <>
          {strips.map((i) => {
            const distanceFromCenter = Math.abs(i - 3)
            const maxDelay = 0.4
            const delay = maxDelay - distanceFromCenter * 0.1

            return (
              <motion.div
                key={i}
                className="absolute top-0 bottom-0 bg-primary"
                style={{
                  left: `${(i / 7) * 100}%`,
                  width: `${100 / 7 + 0.5}%`,
                }}
                initial={{ y: 0 }}
                animate={phase === 'reveal' ? { y: '-100vh' } : { y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: phase === 'reveal' ? delay : 0,
                  ease: [0.65, 0, 0.35, 1],
                }}
              />
            )
          })}

          <AnimatePresence>
            {(phase === 'loading' || phase === 'complete') && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute top-8 left-8">
                  <span className="text-lg md:text-xl font-black text-black tracking-tight">
                    LOADING
                  </span>
                </div>

                <div className="absolute top-8 right-8">
                  <span className="text-sm text-black/60">PLEASE WAIT</span>
                </div>

                <motion.span
                  className="text-[20vw] md:text-[15vw] font-black text-black leading-none"
                  key={progress}
                >
                  {progress}
                </motion.span>

                <div className="absolute bottom-8 left-8">
                  <span className="text-sm text-black/60">PREPARING EXPERIENCE</span>
                </div>

                <div className="absolute bottom-8 right-8">
                  <motion.span
                    className="text-sm font-bold text-black"
                    animate={{ opacity: phase === 'complete' ? 1 : 0.6 }}
                  >
                    {phase === 'complete' ? 'READY' : '...'}
                  </motion.span>
                </div>

                <div className="absolute bottom-20 left-8 right-8 h-px bg-black/20">
                  <motion.div
                    className="h-full bg-black"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      </AnimatePresence>
    </div>
  )
}
