'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { Mail, FileText, Check, Cpu, MousePointer2, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { glass } from '@/lib/styles'

const EASE = [0.16, 1, 0.3, 1] as const

/* Il processo come staffetta: i dati viaggiano sempre come pallini arancio,
   ogni fase ha la sua pausa.
   0 email · 1 pallini→chip · 2 chip→pallini→modello (elaborazione)
   3 modello→pallini→risultati→pallini→preventivo · 4 approvazione+ore  */
const PHASE_MS = [2400, 2600, 3000, 2600, 3400] as const

const W = 560
const H = 540

function usePhase() {
  const [phase, setPhase] = useState(0)
  const [cycle, setCycle] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => {
      if (phase === PHASE_MS.length - 1) {
        setPhase(0)
        setCycle((c) => c + 1)
      } else {
        setPhase(phase + 1)
      }
    }, PHASE_MS[phase])
    return () => clearTimeout(id)
  }, [phase])
  return { phase, cycle }
}


/** Gruppo a profondità di parallasse propria + ingresso animato.
    L'attivo scala e prende l'alone; nessuno diventa mai trasparente. */
function Depth({
  x,
  y,
  factor,
  enter,
  state = 'ambient',
  className,
  children,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  factor: number
  enter: number
  state?: 'active' | 'idle' | 'ambient'
  className?: string
  children: React.ReactNode
}) {
  const dx = useTransform(x, (v) => v * factor)
  const dy = useTransform(y, (v) => v * factor * 0.8)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: state === 'active' ? 1.04 : 1 }}
      transition={{ duration: 0.55, delay: enter, ease: EASE }}
      style={{ x: dx, y: dy, zIndex: state === 'active' ? 30 : undefined }}
      className={cn('absolute', className)}
    >
      {/* Wobble su un layer separato: non litiga con parallasse/scala framer.
          Durata legata al factor così gli elementi non sono mai in fase. */}
      <div
        className="motion-reduce:animate-none"
        style={{ animation: `hero-float ${5.5 + factor * 2.5}s ease-in-out ${enter * 1.7}s infinite` }}
      >
        {children}
      </div>
    </motion.div>
  )
}

const glow = (on: boolean) =>
  cn(
    'transition-shadow duration-500',
    on &&
      'shadow-[0_0_0_1.5px_oklch(0.705_0.213_47.6/0.55),0_0_36px_-4px_oklch(0.705_0.213_47.6/0.45),0_20px_50px_-16px_oklch(0_0_0/0.8)]',
  )

const DOT = 12
const ORANGE = 'oklch(0.705 0.213 47.6)'
const PILL_BG = 'oklch(0.18 0.015 265)'
const DOT_GLOW = '0 0 12px oklch(0.705 0.213 47.6 / 0.9)'
const NO_GLOW = '0 0 0px oklch(0.705 0.213 47.6 / 0)'

/** Il badge È il pallino: nasce pallino arancio nel CENTRO della card
    sorgente, viaggia (dietro alle card), si apre in pill; alla ripartenza
    si richiude in pallino e vola nel centro della card destinazione. */
function MorphPill({
  mode,
  from,
  to,
  delay = 0,
  outDelay = 0,
  duration = 1.1,
  className,
  style,
  children,
}: {
  mode: 'hidden' | 'in' | 'out' | 'inout'
  from: { x: number; y: number }
  to: { x: number; y: number }
  delay?: number
  outDelay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const anim =
    mode === 'in'
      ? {
          x: [from.x, 0, 0],
          y: [from.y, 0, 0],
          opacity: [0, 1, 1],
          maxWidth: [DOT, DOT, 240],
          height: [DOT, DOT, 30],
          backgroundColor: [ORANGE, ORANGE, PILL_BG],
          boxShadow: [DOT_GLOW, DOT_GLOW, NO_GLOW],
        }
      : mode === 'out'
        ? {
            x: [0, 0, to.x, to.x],
            y: [0, 0, to.y, to.y],
            opacity: [1, 1, 1, 0],
            maxWidth: [240, DOT, DOT, DOT],
            height: [30, DOT, DOT, DOT],
            backgroundColor: [PILL_BG, ORANGE, ORANGE, ORANGE],
            boxShadow: [NO_GLOW, DOT_GLOW, DOT_GLOW, DOT_GLOW],
          }
        : mode === 'inout'
          ? {
              x: [from.x, 0, 0, 0, 0, to.x, to.x],
              y: [from.y, 0, 0, 0, 0, to.y, to.y],
              opacity: [0, 1, 1, 1, 1, 1, 0],
              maxWidth: [DOT, DOT, 240, 240, DOT, DOT, DOT],
              height: [DOT, DOT, 30, 30, DOT, DOT, DOT],
              backgroundColor: [ORANGE, ORANGE, PILL_BG, PILL_BG, ORANGE, ORANGE, ORANGE],
              boxShadow: [DOT_GLOW, DOT_GLOW, NO_GLOW, NO_GLOW, DOT_GLOW, DOT_GLOW, DOT_GLOW],
            }
          : {
              x: from.x,
              y: from.y,
              opacity: 0,
              maxWidth: DOT,
              height: DOT,
              backgroundColor: ORANGE,
              boxShadow: NO_GLOW,
            }

  const transition =
    mode === 'hidden'
      ? { duration: 0 }
      : {
          duration,
          delay: mode === 'out' ? outDelay : delay,
          times:
            mode === 'in'
              ? [0, 0.45, 1]
              : mode === 'out'
                ? [0, 0.3, 0.92, 1]
                : [0, 0.12, 0.22, 0.66, 0.74, 0.94, 1],
          ease: 'easeInOut' as const,
        }

  const contentAnim =
    mode === 'in'
      ? { opacity: [0, 0, 1] }
      : mode === 'out'
        ? { opacity: [1, 0, 0, 0] }
        : mode === 'inout'
          ? { opacity: [0, 0, 1, 1, 0, 0, 0] }
          : { opacity: 0 }

  return (
    <motion.span
      animate={anim}
      transition={transition}
      style={style}
      className={cn(
        'pointer-events-none inline-flex items-center overflow-hidden whitespace-nowrap rounded-full border border-primary/25 text-[11px] font-medium text-foreground/85',
        className,
      )}
    >
      <motion.span
        animate={contentAnim}
        transition={transition}
        className="flex items-center gap-1.5 px-3"
      >
        {children}
      </motion.span>
    </motion.span>
  )
}


export function HeroVisual() {
  const t = useTranslations('hero.scenes')
  const chips = t.raw('chips') as string[]
  const rows = t.raw('quote_rows') as string[]
  const { phase, cycle } = usePhase()

  const rectRef = useRef<DOMRect | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })

  const handleEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    rectRef.current = e.currentTarget.getBoundingClientRect()
  }
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const rect = rectRef.current ?? (rectRef.current = e.currentTarget.getBoundingClientRect())
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 36)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 36)
  }
  const handleLeave = () => {
    rectRef.current = null
    mx.set(0)
    my.set(0)
  }

  const stepState = (i: number): 'active' | 'idle' => (phase === i ? 'active' : 'idle')

  return (
    <div
      aria-hidden
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative hidden lg:block select-none mx-auto"
      style={{ width: W, height: H }}
    >
      {/* Campo colore */}
      <div className="pointer-events-none absolute top-[4%] right-[4%] h-72 w-72 rounded-full bg-primary/25 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[8%] left-[4%] h-56 w-56 rounded-full bg-primary/15 blur-[80px]" />
      <div className="pointer-events-none absolute top-[44%] right-[36%] h-40 w-40 rounded-full bg-[oklch(0.82_0.14_85)]/20 blur-[70px]" />

      {/* ── 1 · L'email arriva; in fase di analisi viene "scandita" ── */}
      <Depth x={smx} y={smy} factor={0.5} enter={0.35} state={stepState(0)} className="left-[135px] top-[16px] w-[300px] z-10">
        <div className={cn(glass, 'group relative overflow-hidden rounded-2xl p-4', glow(phase === 0 || phase === 1))}>
          {/* Effetto analisi: beam che scandisce + griglia + mirino (fase 1 o hover) */}
          <div
            className={cn(
              'pointer-events-none absolute inset-0 transition-opacity duration-400',
              phase === 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            )}
          >
            <span className="absolute inset-0 bg-[repeating-linear-gradient(0deg,oklch(1_0_0/0.035)_0px,oklch(1_0_0/0.035)_1px,transparent_1px,transparent_5px)]" />
            <motion.span
              animate={{ x: ['-120%', '120%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-primary/15 to-transparent"
            />
            <span className="absolute left-1.5 top-1.5 h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-primary/70 rounded-tl-sm" />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-primary/70 rounded-tr-sm" />
            <span className="absolute left-1.5 bottom-1.5 h-2.5 w-2.5 border-l-[1.5px] border-b-[1.5px] border-primary/70 rounded-bl-sm" />
            <span className="absolute right-1.5 bottom-1.5 h-2.5 w-2.5 border-r-[1.5px] border-b-[1.5px] border-primary/70 rounded-br-sm" />
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Mail size={16} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground truncate">{t('email_from')}</p>
              <p className="text-[13px] font-semibold tracking-tight text-foreground truncate">
                {t('email_subject')}
              </p>
            </div>
            <motion.span
              animate={phase === 0 ? { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] } : { opacity: 0.35 }}
              transition={phase === 0 ? { duration: 1.4, repeat: Infinity } : { duration: 0.3 }}
              className="ml-auto h-2 w-2 shrink-0 rounded-full bg-primary"
            />
          </div>
        </div>
      </Depth>

      {/* ── 2 · Dati estratti: il badge È il pallino (email → slot → modello) ── */}
      <Depth x={smx} y={smy} factor={0.85} enter={0.6} state={stepState(1)} className="left-0 top-0 w-[185px] z-[5]">
        <div className="flex flex-col gap-2">
          {chips.slice(0, 3).map((chip, i) => (
            <div key={chip} className="flex h-[30px] items-center">
              <MorphPill
                mode={phase === 1 ? 'in' : phase === 2 ? 'out' : 'hidden'}
                from={{ x: 210, y: 36 - i * 38 }}
                to={{ x: 210, y: 157 - i * 38 }}
                delay={0.3 + i * 0.2}
                outDelay={0.3 + i * 0.2}
                duration={phase === 2 ? 1 : 1.1}
                className={cn(
                  i === 0 && '-rotate-2',
                  i === 1 && 'ml-4 rotate-1',
                  i === 2 && 'ml-1 -rotate-1',
                )}
              >
                {chip}
              </MorphPill>
            </div>
          ))}
        </div>
      </Depth>


      {/* ── 3 · Elaborazione col modello (nodo centrale) ── */}
      <Depth x={smx} y={smy} factor={0.6} enter={0.75} state={stepState(2)} className="left-[173px] top-[128px] w-[225px] z-20">
        <div className={cn(glass, 'rounded-2xl px-4 py-3', glow(phase === 2))}>
          <div className="flex items-center gap-3">
            <motion.span
              animate={phase === 2 ? { scale: [1, 1.14, 1] } : { scale: 1 }}
              transition={phase === 2 ? { duration: 0.45, delay: 1.2, repeat: 2, repeatDelay: 0.25 } : { duration: 0.3 }}
              className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 overflow-hidden"
            >
              <Cpu size={16} strokeWidth={1.75} />
              <motion.span
                aria-hidden
                animate={phase === 2 ? { rotate: 360 } : {}}
                transition={phase === 2 ? { duration: 1.6, repeat: Infinity, ease: 'linear' } : {}}
                className="absolute inset-[-30%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_290deg,oklch(0.705_0.213_47.6/0.5)_350deg,transparent_360deg)]"
              />
            </motion.span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-foreground/85">{t('model')}</p>
              <span className="mt-1.5 block h-1 rounded-full bg-foreground/[0.08] overflow-hidden">
                <motion.span
                  key={`progress-${cycle}`}
                  initial={{ width: '0%' }}
                  animate={phase >= 2 ? { width: '100%' } : { width: '0%' }}
                  transition={{ duration: phase === 2 ? 2.5 : 0.2, delay: phase === 2 ? 0.4 : 0, ease: 'easeInOut' }}
                  className="block h-full bg-primary"
                />
              </span>
            </div>
          </div>
        </div>
      </Depth>

      {/* ── Output: il preventivo si costruisce (centro-basso) ── */}
      <Depth x={smx} y={smy} factor={0.3} enter={0.5} state={stepState(3)} className="left-[128px] top-[259px] w-[315px] z-10">
        <div className={cn(glass, 'rounded-2xl p-4', glow(phase === 3))}>
          <div className="mb-3 flex items-center gap-2.5">
            <FileText size={14} className="text-primary" strokeWidth={1.75} />
            <span className="text-[13px] font-semibold tracking-tight text-foreground">
              {t('quote_title')}
            </span>
            {/* Stato del documento: Bozza, poi un cursore la clicca → Approvato */}
            <span className="relative ml-auto inline-grid">
              <motion.span
                animate={
                  phase === 4
                    ? { opacity: [1, 1, 0], scale: [1, 0.92, 0.85] }
                    : { opacity: 1, scale: 1 }
                }
                transition={
                  phase === 4
                    ? { duration: 1.5, delay: 0.2, times: [0, 0.9, 1], ease: ['linear', 'easeIn'] }
                    : { duration: 0.2 }
                }
                className="[grid-area:1/1] justify-self-end rounded-full bg-amber-400/15 px-2 py-0.5 text-[9px] font-semibold text-amber-300"
              >
                {t('badge_draft')}
              </motion.span>
              <motion.span
                animate={
                  phase === 4
                    ? { opacity: [0, 0, 1, 1], scale: [0.8, 0.8, 1.18, 1] }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={
                  phase === 4
                    ? { duration: 1.75, delay: 0.2, times: [0, 0.78, 0.86, 1], ease: ['linear', 'linear', 'easeOut'] }
                    : { duration: 0.2 }
                }
                className="[grid-area:1/1] justify-self-end flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-400"
              >
                <Send size={9} strokeWidth={2.5} />
                {t('badge_sent')}
              </motion.span>
              {/* Il cursore entra, punta il badge e clicca */}
              {phase === 4 && (
                <motion.span
                  key={`cursor-${cycle}`}
                  initial={{ opacity: 0, x: 58, y: 48, scale: 1 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 1, 0],
                    x: [58, 12, 12, 12, 12, 20],
                    y: [48, 13, 13, 13, 13, 22],
                    scale: [1, 1, 1, 0.8, 1, 1],
                  }}
                  transition={{ duration: 1.9, delay: 0.25, times: [0, 0.45, 0.6, 0.68, 0.78, 1], ease: 'easeInOut' }}
                  className="pointer-events-none absolute right-0 top-0 z-10 text-foreground drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
                >
                  <MousePointer2 size={14} className="fill-foreground" />
                </motion.span>
              )}
              {/* Linee radiali che scattano al momento del click */}
              {phase === 4 && (
                <motion.span
                  key={`click-burst-${cycle}`}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1, 1.25, 1.35] }}
                  transition={{ duration: 0.5, delay: 1.5, times: [0, 0.35, 0.8, 1], ease: 'easeOut' }}
                  className="pointer-events-none absolute z-10 h-0 w-0"
                  style={{ right: -10, top: 12 }}
                >
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <span
                      key={deg}
                      className="absolute h-[7px] w-[1.5px] rounded-full bg-primary"
                      style={{ transform: `rotate(${deg}deg) translateY(-10px)` }}
                    />
                  ))}
                </motion.span>
              )}
            </span>
          </div>
          {/* Righe sempre visibili (mai una scatola vuota): in fase 2 si riempiono */}
          <div className="flex flex-col gap-1.5">
            {rows.map((row, i) => (
              <div key={row} className="flex items-center justify-between gap-3">
                <motion.span
                  animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                  transition={{ delay: phase === 3 ? 1.3 + i * 0.18 : 0, duration: 0.35, ease: EASE }}
                  className="text-[11px] text-foreground/75"
                >
                  {row}
                </motion.span>
                <span
                  style={{ width: 44 + i * 12 }}
                  className="h-1.5 rounded-full bg-foreground/[0.1] overflow-hidden"
                >
                  <motion.span
                    key={`fill-${cycle}-${i}`}
                    initial={{ width: '0%' }}
                    animate={phase >= 3 ? { width: '100%' } : { width: '0%' }}
                    transition={{ delay: phase === 3 ? 1.4 + i * 0.18 : 0, duration: 0.45, ease: EASE }}
                    className="block h-full rounded-full bg-primary/60"
                  />
                </span>
              </div>
            ))}
          </div>
          <motion.p
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ delay: phase === 3 ? 2 : 0, duration: 0.45, ease: EASE }}
            className="mt-2.5 text-right font-display text-lg text-foreground"
          >
            {t('quote_total')}
          </motion.p>
        </div>
      </Depth>




      {/* ── Preventivi simili: il badge È il pallino (modello → slot → preventivo) ── */}
      {(t.raw('db_results') as string[]).slice(0, 3).map((res, i) => (
        <MorphPill
          key={res}
          mode={phase === 2 ? 'in' : phase === 3 ? 'out' : 'hidden'}
          from={{ x: -200, y: 34 - i * 34 }}
          to={{ x: -200, y: 203 - i * 34 }}
          delay={1.1 + i * 0.3}
          outDelay={0.4 + i * 0.15}
          duration={phase === 3 ? 1 : 1.1}
          style={{ position: 'absolute', left: 430, top: 123 + i * 34, zIndex: 5 }}
          className={cn(i === 1 && '-ml-4', i === 2 && '-ml-1')}
        >
          <Check size={9} strokeWidth={3} className="shrink-0 text-emerald-400" />
          {res}
        </MorphPill>
      ))}

    </div>
  )
}
