/**
 * Mini-report inviato all'utente dopo il Check AI: la sua mappa delle aree
 * automatizzabili, nella sua lingua. Copy condivisa con la UI (check.areas)
 * + chiavi dedicate check.report_* nei locale.
 */

const ACCENT = '#ea580c'

type AreaCopy = { title: string; text: string }

interface CheckReportMessages {
  areas: Record<string, AreaCopy>
  report_subject: string
  report_greeting: string
  report_intro: string
  report_hot_label: string
  report_some_label: string
  report_basics_note: string
  report_next_title: string
  report_outro: string
  report_cta: string
  report_cta_subject: string
  report_footer: string
}

async function loadMessages(locale: string | undefined): Promise<CheckReportMessages> {
  const safe = locale === 'en' ? 'en' : 'it'
  // Import relativo con prefisso statico: stesso pattern di i18n/request.ts,
  // così il bundler include entrambi i JSON.
  const all = (await import(`../../locales/${safe}.json`)).default as { check: CheckReportMessages }
  return all.check
}

function areaBlock(copy: AreaCopy, label: string, hot: boolean): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 12px;">
  <tr>
    <td style="border: 1px solid #e8e4de; border-left: 3px solid ${hot ? ACCENT : '#d6d1c8'}; border-radius: 10px; padding: 16px 18px; background: #ffffff;">
      <p style="margin: 0 0 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${hot ? ACCENT : '#8a857c'};">${label}</p>
      <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #1c1a17;">${copy.title}</p>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #5c574e;">${copy.text}</p>
    </td>
  </tr>
</table>`
}

export async function buildCheckReportEmail(params: {
  locale: string | undefined
  name: string
  areas: { key: string; value: number }[]
  weakBasics: boolean
}): Promise<{ subject: string; html: string } | null> {
  const m = await loadMessages(params.locale)

  const sorted = [...params.areas].filter((a) => a.value > 0).sort((a, b) => b.value - a.value)
  if (sorted.length === 0) return null

  const blocks = sorted
    .map((a) => {
      const copy = m.areas[a.key]
      if (!copy) return ''
      return areaBlock(copy, a.value === 2 ? m.report_hot_label : m.report_some_label, a.value === 2)
    })
    .join('')

  const ctaHref = `mailto:hello@noxis.agency?subject=${encodeURIComponent(m.report_cta_subject)}`
  const firstName = params.name.trim().split(/\s+/)[0]

  const html = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background: #f6f4f0; font-family: -apple-system, system-ui, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f6f4f0; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px;">
          <tr>
            <td style="padding: 0 4px 20px;">
              <span style="font-size: 16px; font-weight: 800; letter-spacing: 0.16em; color: #1c1a17;">NOXIS</span>
            </td>
          </tr>
          <tr>
            <td style="background: #ffffff; border: 1px solid #e8e4de; border-radius: 14px; padding: 28px 26px;">
              <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #1c1a17;">${m.report_greeting.replace('{name}', firstName)}</p>
              <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.65; color: #5c574e;">${m.report_intro}</p>
              ${blocks}
              ${params.weakBasics ? `<p style="margin: 14px 0 0; font-size: 12px; line-height: 1.6; color: #8a857c;">${m.report_basics_note}</p>` : ''}
              <hr style="margin: 24px 0; border: none; border-top: 1px solid #efece6;" />
              <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #1c1a17;">${m.report_next_title}</p>
              <p style="margin: 0 0 18px; font-size: 14px; line-height: 1.65; color: #5c574e;">${m.report_outro}</p>
              <a href="${ctaHref}" style="display: inline-block; padding: 12px 26px; background: ${ACCENT}; color: #ffffff; border-radius: 999px; font-size: 14px; font-weight: 600; text-decoration: none;">${m.report_cta}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 6px 0;">
              <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #a39d92;">${m.report_footer}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()

  return { subject: m.report_subject, html }
}
