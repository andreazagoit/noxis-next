/** Intent del mailto: seleziona subject/body dal namespace email.<intent>. */
export type CTAIntent = 'general' | 'development' | 'development_portfolio'

type Translator = (key: string) => string

/**
 * Build a localized mailto: href for a given CTA intent.
 * Subject + body come from the `email.<intent>` translation namespace.
 */
export function mailtoHref(
  t: Translator,
  intent: CTAIntent,
  email: string = 'hello@noxis.agency',
): string {
  const subject = encodeURIComponent(t(`email.${intent}.subject`))
  const body = encodeURIComponent(t(`email.${intent}.body`))
  return `mailto:${email}?subject=${subject}&body=${body}`
}
