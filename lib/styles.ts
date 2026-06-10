import { cn } from '@/lib/utils'

/**
 * Shared Tailwind class recipes for the premium dark design system.
 * Kept here (not in globals.css) so every style stays utility-first.
 */

/** Elevated card on the dark canvas, no hover behavior. */
export const cardStatic = cn(
  'bg-card border border-white/[0.07]',
  'shadow-[0_1px_0_oklch(1_0_0/0.04)_inset,0_16px_40px_-20px_oklch(0_0_0/0.8)]',
)

/** Niente animazioni di hover sulle card: cardPremium è la superficie statica.
    (Il vecchio hover-lift è stato rimosso su richiesta.) */
export const cardPremium = cardStatic

/** Frosted dark glass surface (static — no hover tricks). */
export const glass = cn(
  'border border-white/10 bg-white/[0.06] backdrop-blur-2xl',
  'shadow-[inset_0_1px_0_oklch(1_0_0/0.10),0_1px_2px_oklch(0_0_0/0.4),0_24px_48px_-20px_oklch(0_0_0/0.7)]',
)

/** Spotlight panel: slightly elevated, ringed by primary glows (guarantee, final CTA, results). */
export const darkPanel = cn(
  'relative overflow-hidden border border-white/[0.08]',
  'bg-[oklch(0.165_0.016_265)]',
  'bg-[image:radial-gradient(900px_420px_at_85%_-10%,oklch(0.705_0.213_47.6/0.22),transparent_60%),radial-gradient(640px_320px_at_-5%_110%,oklch(0.705_0.213_47.6/0.10),transparent_60%)]',
)
