'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  Workflow,
  MessagesSquare,
  Code2,
  Plug,
  GraduationCap,
  Check,
  FileText,
  Receipt,
  CalendarClock,
  Sparkles,
  BadgeCheck,
  MousePointer2,
  Rocket,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { cardPremium, darkPanel, glass } from '@/lib/styles'
import { cn } from '@/lib/utils'

/* Inner panel shared by the card visuals (the "screen" the demos run on). */
const innerPanel = 'rounded-2xl border border-foreground/[0.06] bg-background/60'

/* ---------------------------------------------------------------- shell -- */

function IconBadge({ icon: Icon }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }) {
  return (
    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary ring-1 ring-primary/15 self-start">
      <Icon size={22} strokeWidth={1.75} />
    </div>
  )
}

/** Common card chrome; each card composes its own layout and demo inside. */
function CardShell({
  panel = 'card',
  className,
  children,
}: {
  panel?: 'card' | 'spotlight'
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        panel === 'spotlight' ? darkPanel : cardPremium,
        'relative h-full overflow-hidden rounded-3xl p-8 md:p-9 flex flex-col',
        className,
      )}
    >
      {panel === 'card' && (
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/[0.05] blur-3xl" />
      )}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  )
}

/* ------------------------------------------------- card 1: automazioni -- */
/* Demo loop (9s): il documento arriva → l'AI elabora → bozza pronta →
   il cursore clicca e approva. */

const TASK_LOOP = 9

const TASK_ROWS = [
  { Icon: FileText, key: 'visual_task1' },
  { Icon: Receipt, key: 'visual_task2' },
  { Icon: CalendarClock, key: 'visual_task3' },
] as const

function TaskRow({ Icon, label, delay }: { Icon: typeof FileText; label: string; delay: number }) {
  const reduce = useReducedMotion()
  const loop = { duration: TASK_LOOP, delay, repeat: Infinity, ease: 'easeInOut' as const }
  return (
    <div className="flex items-center gap-3">
      {/* step 1: il documento arriva (l'icona pulsa) */}
      <motion.span
        animate={reduce ? undefined : { scale: [1, 1, 1.14, 1, 1] }}
        transition={{ ...loop, times: [0, 0.02, 0.06, 0.1, 1] }}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary ring-1 ring-primary/15"
      >
        <Icon size={14} strokeWidth={1.75} />
      </motion.span>
      <span className="truncate text-[11px] font-medium text-foreground/75">{label}</span>
      <span className="ml-auto flex items-center gap-2.5">
        {/* step 2: l'AI elabora (la barra si riempie) */}
        <span className="relative h-1.5 w-14 overflow-hidden rounded-full bg-foreground/[0.08]">
          <motion.span
            initial={reduce ? false : { scaleX: 0 }}
            animate={reduce ? undefined : { scaleX: [0, 0, 1, 1], opacity: [1, 1, 1, 0] }}
            transition={{ ...loop, times: [0, 0.08, 0.26, 0.34] }}
            className="absolute inset-0 origin-left rounded-full bg-primary/70"
          />
        </span>
        {/* step 3: fatto (la spunta scatta) */}
        <motion.span
          initial={reduce ? false : { opacity: 0, scale: 0.5 }}
          animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0], scale: [0.5, 0.5, 1, 1, 0.5] }}
          transition={{ ...loop, times: [0, 0.26, 0.32, 0.92, 1] }}
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15"
        >
          <Check size={11} strokeWidth={3} className="text-emerald-600" />
        </motion.span>
      </span>
    </div>
  )
}

function AutomationCard() {
  const t = useTranslations()
  const reduce = useReducedMotion()
  const loop = { duration: TASK_LOOP, repeat: Infinity, ease: 'easeInOut' as const }
  return (
    <CardShell>
      <div className="grid h-full gap-8 md:grid-cols-2 md:items-center">
        <div className="flex flex-col items-start">
          <IconBadge icon={Workflow} />
          <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
            {t('services.web_dev.title')}
          </h3>
          <p className="text-sm leading-[1.7] text-muted-foreground">{t('services.web_dev.description')}</p>
        </div>
        <div aria-hidden className="relative">
          <div className={cn(innerPanel, 'flex flex-col gap-4 p-5')}>
            {TASK_ROWS.map(({ Icon, key }, i) => (
              <TaskRow key={key} Icon={Icon} label={t(`services.${key}`)} delay={i * 0.9} />
            ))}
          </div>
          {/* step 4: la bozza è pronta — chip di vetro sovrapposto */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.6, y: 6 }}
            animate={
              reduce
                ? undefined
                : { opacity: [0, 0, 1, 1, 1, 0], scale: [0.6, 0.6, 1.08, 1, 1, 0.9], y: [6, 6, 0, 0, -4, -6] }
            }
            transition={{ ...loop, times: [0, 0.48, 0.53, 0.56, 0.93, 1] }}
            className={cn(glass, 'absolute -top-4 right-5 flex items-center gap-2 rounded-xl px-3 py-2')}
          >
            <Sparkles size={13} className="text-primary" />
            <span className="text-[11px] font-semibold tracking-wide text-foreground/85">
              {t('services.visual_draft_ready')}
            </span>
            <span className="relative inline-flex h-4 w-4">
              {/* cerchio vuoto in attesa di approvazione… */}
              <motion.span
                animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
                transition={{ ...loop, times: [0, 0.6, 0.64, 1] }}
                className="absolute inset-0 rounded-full ring-1 ring-inset ring-foreground/25"
              />
              {/* …che diventa spunta dopo il click */}
              <motion.span
                initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                animate={reduce ? undefined : { opacity: [0, 0, 1, 1], scale: [0.4, 0.4, 1, 1] }}
                transition={{ ...loop, times: [0, 0.62, 0.67, 1] }}
                className="absolute inset-0 inline-flex items-center justify-center rounded-full bg-emerald-500/15"
              >
                <Check size={9} strokeWidth={3} className="text-emerald-600" />
              </motion.span>
            </span>
          </motion.div>
          {/* step 5: il cursore entra, clicca, approva */}
          {!reduce && (
            <motion.span
              initial={{ opacity: 0, x: 44, y: 44 }}
              animate={{
                opacity: [0, 0, 1, 1, 1, 0, 0],
                x: [44, 44, 2, 2, 2, 24, 44],
                y: [44, 44, 2, 2, 2, 24, 44],
                scale: [1, 1, 1, 0.8, 1, 1, 1],
              }}
              transition={{ ...loop, times: [0, 0.5, 0.58, 0.62, 0.66, 0.78, 1] }}
              className="absolute -top-2 right-8 z-10 text-foreground drop-shadow-[0_2px_6px_oklch(0_0_0/0.6)]"
            >
              <MousePointer2 size={15} strokeWidth={1.5} className="fill-foreground/90" />
            </motion.span>
          )}
        </div>
      </div>
    </CardShell>
  )
}

/* -------------------------------------------------- card 2: gestionale -- */
/* Demo loop (8s): il dato parte dall'ERP → l'AI lo elabora (anelli) →
   arriva al CRM (spunta) → sync di ritorno. */

const SYNC_LOOP = 8

function IntegrationCard() {
  const t = useTranslations()
  const reduce = useReducedMotion()
  const loop = { duration: SYNC_LOOP, repeat: Infinity, ease: 'easeInOut' as const }
  return (
    <CardShell panel="spotlight">
      <IconBadge icon={Plug} />
      <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">{t('services.ai.title')}</h3>
      <p className="text-sm leading-[1.7] text-muted-foreground">{t('services.ai.description')}</p>
      <div aria-hidden className="mt-auto pt-8">
        <div className="relative rounded-2xl border border-white/[0.08] bg-background/40 px-5 py-7 backdrop-blur-sm">
          <div className="relative flex items-center justify-between">
            <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-foreground/10" />
            {!reduce && (
              <>
                {/* andata: il dato viaggia ERP → AI (pausa) → CRM */}
                <motion.span
                  className="pointer-events-none absolute inset-0"
                  animate={{ x: ['4%', '4%', '47%', '47%', '91%', '91%'] }}
                  transition={{ ...loop, times: [0, 0.04, 0.28, 0.42, 0.62, 1] }}
                >
                  <motion.span
                    className="absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_oklch(0.705_0.213_47.6/0.8)]"
                    animate={{ opacity: [0, 1, 1, 1, 0, 0] }}
                    transition={{ ...loop, times: [0, 0.08, 0.42, 0.6, 0.66, 1] }}
                  />
                </motion.span>
                {/* ritorno: conferma più tenue CRM → ERP */}
                <motion.span
                  className="pointer-events-none absolute inset-0"
                  animate={{ x: ['91%', '91%', '4%', '4%'] }}
                  transition={{ ...loop, times: [0, 0.72, 0.96, 1] }}
                >
                  <motion.span
                    className="absolute top-1/2 left-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground/60"
                    animate={{ opacity: [0, 0, 0.7, 0.7, 0, 0] }}
                    transition={{ ...loop, times: [0, 0.7, 0.74, 0.92, 0.96, 1] }}
                  />
                </motion.span>
              </>
            )}
            {/* nodo ERP: pulsa quando il dato parte */}
            <motion.span
              animate={reduce ? undefined : { scale: [1, 1.1, 1, 1] }}
              transition={{ ...loop, times: [0, 0.06, 0.12, 1] }}
              className="relative z-10 inline-block rounded-lg border border-foreground/10 bg-card px-3 py-1.5 text-[11px] font-semibold tracking-wide text-foreground/80"
            >
              ERP
            </motion.span>
            {/* nodo AI: anelli che si espandono quando il dato arriva */}
            <span className="relative z-10">
              {!reduce &&
                [0.28, 0.34].map((start) => (
                  <motion.span
                    key={start}
                    className="absolute inset-0 rounded-lg border border-primary/40"
                    animate={{ opacity: [0, 0, 0.6, 0, 0], scale: [1, 1, 1, 1.9, 1.9] }}
                    transition={{ ...loop, times: [0, start - 0.01, start, start + 0.22, 1] }}
                  />
                ))}
              <motion.span
                className="absolute inset-0 -m-1.5 rounded-xl bg-primary/25 blur-md"
                animate={reduce ? undefined : { opacity: [0.25, 0.25, 0.9, 0.4, 0.25] }}
                transition={{ ...loop, times: [0, 0.28, 0.36, 0.5, 1] }}
              />
              <span className="relative inline-block rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary">
                AI
              </span>
            </span>
            {/* nodo CRM: pulsa e spunta quando il dato arriva */}
            <span className="relative z-10">
              <motion.span
                initial={reduce ? false : { opacity: 0, y: 4, scale: 0.5 }}
                animate={
                  reduce ? undefined : { opacity: [0, 0, 1, 1, 0], y: [4, 4, 0, 0, -4], scale: [0.5, 0.5, 1, 1, 0.5] }
                }
                transition={{ ...loop, times: [0, 0.62, 0.68, 0.82, 0.9] }}
                className="absolute -top-5 left-1/2 inline-flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-500/20"
              >
                <Check size={9} strokeWidth={3} className="text-emerald-500" />
              </motion.span>
              <motion.span
                animate={reduce ? undefined : { scale: [1, 1, 1.12, 1, 1] }}
                transition={{ ...loop, times: [0, 0.6, 0.66, 0.72, 1] }}
                className="relative inline-block rounded-lg border border-foreground/10 bg-card px-3 py-1.5 text-[11px] font-semibold tracking-wide text-foreground/80"
              >
                CRM
              </motion.span>
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

/* -------------------------------------------------- card 3: assistenti -- */
/* Demo loop (10s): l'utente digita → invia → l'assistente pensa →
   risponde → consegnato. */

const CHAT_LOOP = 10

function AssistantCard() {
  const t = useTranslations()
  const reduce = useReducedMotion()
  const loop = { duration: CHAT_LOOP, repeat: Infinity, ease: 'easeInOut' as const }
  return (
    <CardShell>
      <IconBadge icon={MessagesSquare} />
      <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">{t('services.ux_ui.title')}</h3>
      <p className="text-sm leading-[1.7] text-muted-foreground">{t('services.ux_ui.description')}</p>
      <div aria-hidden className="mt-auto pt-8">
        <div className="relative">
          {/* step 1-2: la domanda dell'utente arriva e parte (la bolla pulsa) */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 10 }}
            animate={
              reduce
                ? undefined
                : { opacity: [0, 1, 1, 1, 1, 0], x: [10, 0, 0, 0, 0, 0], scale: [1, 1, 1, 0.97, 1, 1] }
            }
            transition={{ ...loop, times: [0, 0.06, 0.2, 0.23, 0.26, 1] }}
            className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-sm border border-primary/20 bg-primary/[0.12] px-3.5 py-2.5"
          >
            <span className="block text-[11px] leading-relaxed text-foreground/90">
              {t('services.visual_chat_q')}
            </span>
          </motion.div>
          {/* step 3-4: l'assistente pensa, poi la risposta prende il posto dei puntini */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] }}
            transition={{ ...loop, times: [0, 0.26, 0.32, 0.95, 1] }}
            className={cn(glass, 'relative mt-2.5 mr-auto flex w-[88%] items-start gap-2.5 rounded-2xl rounded-tl-sm p-3.5')}
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20">
              <Sparkles size={13} strokeWidth={1.75} />
            </span>
            <span className="relative min-h-7 flex-1">
              {!reduce && (
                <motion.span
                  animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
                  transition={{ ...loop, times: [0, 0.3, 0.34, 0.55, 0.6, 1] }}
                  className="absolute inset-y-0 left-0 flex items-center gap-1.5"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                      transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="h-1.5 w-1.5 rounded-full bg-foreground/70"
                    />
                  ))}
                </motion.span>
              )}
              <motion.span
                initial={reduce ? false : { opacity: 0 }}
                animate={reduce ? undefined : { opacity: [0, 0, 1, 1] }}
                transition={{ ...loop, times: [0, 0.58, 0.66, 1] }}
                className="block pr-4 text-[11px] leading-relaxed text-foreground/85"
              >
                {t('services.visual_chat_a')}
              </motion.span>
            </span>
            {/* step 5: consegnato */}
            <motion.span
              initial={reduce ? false : { opacity: 0, scale: 0.5 }}
              animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0], scale: [0.5, 0.5, 1, 1, 1] }}
              transition={{ ...loop, times: [0, 0.76, 0.8, 0.95, 1] }}
              className="absolute bottom-1.5 right-2 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/15"
            >
              <Check size={8} strokeWidth={3} className="text-emerald-600" />
            </motion.span>
          </motion.div>
        </div>
      </div>
    </CardShell>
  )
}

/* ---------------------------------------------------- card 4: sviluppo -- */
/* Demo loop (9s): il codice si scrive → build (ambra + barra) →
   live (verde) → toast di conferma. */

const BUILD_LOOP = 9

const CODE_LINES = [
  { w: 'w-2/3', tint: false },
  { w: 'w-5/6', tint: true },
  { w: 'w-1/2', tint: false },
  { w: 'w-3/4', tint: false },
] as const

function BuildCard() {
  const t = useTranslations()
  const reduce = useReducedMotion()
  const loop = { duration: BUILD_LOOP, repeat: Infinity, ease: 'easeInOut' as const }
  return (
    <CardShell>
      <IconBadge icon={Code2} />
      <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">{t('services.mobile_dev.title')}</h3>
      <p className="text-sm leading-[1.7] text-muted-foreground">{t('services.mobile_dev.description')}</p>
      <div aria-hidden className="mt-auto pt-8">
        <div className="relative pt-4 pr-4">
          {/* finestra dietro: sfocata, deriva lentamente */}
          <motion.div
            style={{ x: 20 }}
            animate={reduce ? undefined : { y: [0, -4, 0], rotate: [1.5, 2.5, 1.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-x-0 top-0 bottom-5 rounded-2xl border border-white/[0.06] bg-card/80 blur-[2px]"
          />
          {/* finestra davanti: vetro */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl shadow-[inset_0_1px_0_oklch(1_0_0/0.08)]">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-foreground/15" />
              ))}
              <span className="ml-2 rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[10px] text-foreground/45">
                {t('services.visual_url')}
              </span>
            </div>
            {/* step 1: il codice si scrive riga per riga */}
            <div className="mt-3.5 space-y-2">
              {CODE_LINES.map(({ w, tint }, i) => {
                const start = 0.05 + i * 0.08
                return (
                  <motion.div
                    key={i}
                    initial={reduce ? false : { scaleX: 0, opacity: 0 }}
                    animate={reduce ? undefined : { scaleX: [0, 0, 1, 1, 1], opacity: [0, 0, 1, 1, 0] }}
                    transition={{ ...loop, times: [0, start, start + 0.08, 0.93, 1] }}
                    className={cn('h-1.5 origin-left rounded-full', tint ? 'bg-primary/50' : 'bg-foreground/[0.12]', w)}
                  />
                )
              })}
            </div>
            {/* step 2-3: build (ambra + barra), poi live (verde) */}
            <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3">
              <span className="relative inline-flex h-2 w-2 shrink-0">
                <motion.span
                  initial={reduce ? false : { opacity: 0 }}
                  animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0, 0] }}
                  transition={{ ...loop, times: [0, 0.4, 0.44, 0.58, 0.62, 1] }}
                  className="absolute inset-0"
                >
                  <motion.span
                    animate={reduce ? undefined : { scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-amber-400/80"
                  />
                </motion.span>
                <motion.span
                  initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                  animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0], scale: [0.5, 0.5, 1.2, 1, 1] }}
                  transition={{ ...loop, times: [0, 0.6, 0.65, 0.95, 1] }}
                  className="absolute inset-0 rounded-full bg-emerald-500 shadow-[0_0_8px_oklch(0.7_0.17_160/0.7)]"
                />
              </span>
              <span className="relative h-1.5 w-12 overflow-hidden rounded-full bg-foreground/[0.08]">
                <motion.span
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={reduce ? undefined : { scaleX: [0, 0, 1, 1], opacity: [1, 1, 1, 0] }}
                  transition={{ ...loop, times: [0, 0.42, 0.58, 0.64] }}
                  className="absolute inset-0 origin-left rounded-full bg-amber-400/60"
                />
              </span>
            </div>
          </div>
          {/* step 4: toast "deploy fatto" */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.7 }}
            animate={
              reduce
                ? undefined
                : { opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, -2, -6], scale: [0.7, 0.7, 1.05, 1, 0.9] }
            }
            transition={{ ...loop, times: [0, 0.64, 0.7, 0.92, 1] }}
            className={cn(glass, 'absolute -top-1 right-0 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5')}
          >
            <Rocket size={12} className="text-primary" />
            <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/15">
              <Check size={8} strokeWidth={3} className="text-emerald-600" />
            </span>
          </motion.div>
        </div>
      </div>
    </CardShell>
  )
}

/* --------------------------------------------------- card 5: formazione -- */
/* Demo loop (10s): i moduli si completano uno a uno → l'anello avanza
   a scatti → il badge AI Act arriva alla fine. */

const RING_LOOP = 10

// Tre tick sincronizzati: a ognuno l'anello fa +⅓, la spunta compare e il numero sale.
const TICKS = [0.2, 0.45, 0.7] as const
const COUNTERS = [
  { label: '0/3', opacity: [1, 1, 0, 0], times: [0, 0.2, 0.26, 1] },
  { label: '1/3', opacity: [0, 0, 1, 1, 0, 0], times: [0, 0.2, 0.26, 0.45, 0.51, 1] },
  { label: '2/3', opacity: [0, 0, 1, 1, 0, 0], times: [0, 0.45, 0.51, 0.7, 0.76, 1] },
  { label: '3/3', opacity: [0, 0, 1, 1, 0], times: [0, 0.7, 0.76, 0.9, 1] },
] as const

function TrainingCard() {
  const t = useTranslations()
  const reduce = useReducedMotion()
  const loop = { duration: RING_LOOP, repeat: Infinity, ease: 'easeInOut' as const }
  return (
    <CardShell>
      <IconBadge icon={GraduationCap} />
      <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">{t('services.marketing.title')}</h3>
      <p className="text-sm leading-[1.7] text-muted-foreground">{t('services.marketing.description')}</p>
      <div aria-hidden className="mt-auto pt-8">
        <div className="relative">
          <div className={cn(innerPanel, 'flex items-center gap-5 p-5')}>
            {/* anello: avanza a scatti a ogni modulo completato */}
            <span className="relative inline-flex h-16 w-16 shrink-0 items-center justify-center">
              <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
                <circle cx="20" cy="20" r="16" fill="none" strokeWidth="3" className="stroke-foreground/[0.08]" />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="stroke-primary"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={
                    reduce
                      ? { pathLength: 1 }
                      : { pathLength: [0, 0, 0.333, 0.333, 0.666, 0.666, 1, 1, 0] }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { ...loop, times: [0, 0.2, 0.26, 0.45, 0.51, 0.7, 0.76, 0.9, 1] }
                  }
                />
              </svg>
              {reduce ? (
                <span className="absolute text-[11px] font-semibold text-foreground/85">3/3</span>
              ) : (
                COUNTERS.map(({ label, opacity, times }) => (
                  <motion.span
                    key={label}
                    animate={{ opacity: [...opacity] }}
                    transition={{ ...loop, times: [...times] }}
                    className="absolute text-[11px] font-semibold text-foreground/85"
                  >
                    {label}
                  </motion.span>
                ))
              )}
            </span>
            {/* checklist: i moduli si spuntano in sequenza */}
            <span className="flex flex-1 flex-col gap-3">
              {(['visual_module1', 'visual_module2', 'visual_module3'] as const).map((key, i) => {
                const at = TICKS[i]
                return (
                  <span key={key} className="flex items-center gap-2.5">
                    <motion.span
                      initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                      animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0], scale: [0.5, 0.5, 1, 1, 0.5] }}
                      transition={{ ...loop, times: [0, at, at + 0.06, 0.9, 1] }}
                      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15"
                    >
                      <Check size={9} strokeWidth={3} className="text-emerald-600" />
                    </motion.span>
                    <span className="truncate text-[11px] font-medium text-foreground/70">
                      {t(`services.${key}`)}
                    </span>
                  </span>
                )
              })}
            </span>
          </div>
          {/* il badge arriva a percorso completato */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 4 }}
            animate={
              reduce
                ? undefined
                : { opacity: [0, 0, 1, 1, 0], scale: [0.96, 0.96, 1, 1, 0.96], y: [4, 4, 0, 0, -4] }
            }
            transition={{ ...loop, times: [0, 0.78, 0.86, 0.9, 1] }}
            className={cn(glass, 'absolute -top-3 right-4 flex items-center gap-1.5 rounded-xl px-3 py-1.5')}
          >
            <BadgeCheck size={13} className="text-primary" />
            <span className="text-[11px] font-semibold tracking-wide text-foreground/85">
              {t('services.visual_ai_act')}
            </span>
          </motion.div>
        </div>
      </div>
    </CardShell>
  )
}

/* ----------------------------------------------------------- sezione -- */

export function ServicesGrid() {
  const t = useTranslations()
  return (
    <section id="servizi" className="py-24 md:py-32 scroll-mt-24">
      <Container>
        <SectionHeader
          eyebrow={t('hero.we_are_good_at')}
          title={t('services.title_line1')}
          accent={t('services.title_line2')}
        />
        {/* Bento: hero card + pannello spotlight in alto, tre card a design dedicato sotto */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          <Reveal width="100%" height="100%" delay={0.05} className="lg:col-span-2">
            <AutomationCard />
          </Reveal>
          <Reveal width="100%" height="100%" delay={0.12}>
            <IntegrationCard />
          </Reveal>
          <Reveal width="100%" height="100%" delay={0.08}>
            <AssistantCard />
          </Reveal>
          <Reveal width="100%" height="100%" delay={0.14}>
            <BuildCard />
          </Reveal>
          <Reveal width="100%" height="100%" delay={0.2}>
            <TrainingCard />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
