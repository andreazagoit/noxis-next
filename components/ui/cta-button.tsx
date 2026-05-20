'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import Magnetic from '@/components/ui/magnetic'

export type CTAIntent =
  | 'general'
  | 'development'
  | 'development_portfolio'
  | 'talent_brand'
  | 'talent_creator'

interface CTAButtonProps {
  email?: string
  variant?: 'primary' | 'dark' | 'light'
  className?: string
  children: React.ReactNode
  intent?: CTAIntent
}

export function CTAButton({
  email = 'hello@noxis.agency',
  variant = 'primary',
  className,
  children,
  intent,
}: CTAButtonProps) {
  const t = useTranslations()
  const [isHovered, setIsHovered] = useState(false)
  const [displayState, setDisplayState] = useState<'default' | 'email' | 'copied'>('default')
  const [isMobile, setIsMobile] = useState(false)
  const [transitionKey, setTransitionKey] = useState(0)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setDisplayState('email')
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile || displayState === 'copied') return
    setDisplayState(isHovered ? 'email' : 'default')
    setTransitionKey((prev) => prev + 1)
  }, [isHovered, isMobile])

  const handleClick = async () => {
    if (intent) {
      const subject = encodeURIComponent(t(`email.${intent}.subject`))
      const body = encodeURIComponent(t(`email.${intent}.body`))
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
      return
    }

    if (displayState === 'copied') return
    try {
      await navigator.clipboard.writeText(email)
      setDisplayState('copied')
      setTransitionKey((prev) => prev + 1)

      setTimeout(() => {
        if (isMobile) setDisplayState('email')
        else setDisplayState(isHovered ? 'email' : 'default')
        setTransitionKey((prev) => prev + 1)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const buttonText = typeof children === 'string' ? children : 'Start a Project'

  const currentText =
    displayState === 'default'
      ? buttonText
      : displayState === 'email'
        ? email
        : t('common.copied')

  const Icon = displayState === 'email' ? Copy : displayState === 'copied' ? Check : null

  const getBgColor = () => {
    if (displayState === 'copied') return 'oklch(0.627 0.194 149.21)'
    if (variant === 'primary') return 'var(--primary)'
    if (variant === 'light') return 'var(--foreground)'
    return 'var(--background)'
  }

  const getTextColor = () => {
    if (displayState === 'copied') return 'text-black'
    if (variant === 'primary') return 'text-black'
    if (variant === 'light') return 'text-background'
    return 'text-foreground'
  }

  return (
    <Magnetic>
      <motion.div
        layout
        className="inline-flex"
        transition={{ layout: { duration: 0.45, ease: [0.33, 1, 0.68, 1] } }}
      >
        <motion.div
          className={cn(
            'inline-flex items-center font-bold text-xs cursor-pointer select-none uppercase tracking-[0.15em] overflow-hidden relative z-10 rounded-full',
            getTextColor(),
            className,
          )}
          animate={{ backgroundColor: getBgColor() }}
          transition={{ backgroundColor: { duration: 0.25 } }}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <div className="relative px-6 md:px-12 py-3 md:py-5 min-h-[48px] md:min-h-[64px] flex items-center justify-center">
            <div className="opacity-0 flex items-center justify-center pointer-events-none whitespace-nowrap gap-[0.5px]">
              {currentText}
              {Icon && <Icon size={16} />}
            </div>

            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={`${displayState}-${transitionKey}`}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="flex items-center gap-[0.5px] whitespace-nowrap">
                    {currentText.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.33, 1, 0.68, 1],
                          delay: i * 0.02,
                        }}
                        className="inline-block"
                      >
                        {char === ' ' ? ' ' : char}
                      </motion.span>
                    ))}

                    {Icon && (
                      <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: currentText.length * 0.02 + 0.1 }}
                        className="inline-flex pl-2"
                      >
                        <Icon size={16} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Magnetic>
  )
}
