'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, easeInOut } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MountainSeparatorProps {
  topColor?: string
  bottomColor?: string
  className?: string
}

export function MountainSeparator({
  topColor = 'bg-background',
  bottomColor = 'bg-primary',
  className,
}: MountainSeparatorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const heightFactor = useTransform(scrollYProgress, [0, 1], [1, 0], {
    ease: easeInOut,
  })

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-[240px] md:h-[400px]', topColor, className)}
    >
      <div className="absolute bottom-0 left-0 w-full h-full flex justify-center items-end gap-0">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => {
          let maxHeight = '30%'
          if (i === 4) maxHeight = '100%'
          else if (i === 3 || i === 5) maxHeight = '80%'
          else if (i === 2 || i === 6) maxHeight = '55%'

          return <Strip key={i} maxHeight={maxHeight} heightFactor={heightFactor} bottomColor={bottomColor} />
        })}
      </div>
    </div>
  )
}

function Strip({
  maxHeight,
  heightFactor,
  bottomColor,
}: {
  maxHeight: string
  heightFactor: ReturnType<typeof useTransform<number, number>>
  bottomColor: string
}) {
  const height = useTransform(
    heightFactor,
    (value) => `${value * parseInt(maxHeight)}%`,
  )
  return <motion.div style={{ height }} className={cn('w-[14.28%]', bottomColor)} />
}
