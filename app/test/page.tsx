import { Container } from '@/components/layout/container'

export const metadata = {
  title: 'Test scroll',
  robots: { index: false, follow: false },
}

/* TEMP: pagina di test per isolare lo scatto dello scroll. Testo lunghissimo,
   zero animazioni e zero JS client: se lo scatto compare anche qui, il
   problema è nel setup globale (Lenis/layout), non nelle sezioni della home.
   Rimuovere quando il debug è concluso. */

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
  'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore',
  'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam',
  'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure',
  'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat',
  'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
]

/** Seeded LCG so the page renders the same text on every request. */
function makeRng(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function generateParagraphs(count: number, wordsPerParagraph: number) {
  const rng = makeRng(42)
  return Array.from({ length: count }, (_, p) => {
    const words = Array.from(
      { length: wordsPerParagraph },
      () => WORDS[Math.floor(rng() * WORDS.length)],
    )
    const sentence = words.join(' ')
    return `${p + 1}. ${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`
  })
}

export default function TestPage() {
  const paragraphs = generateParagraphs(150, 90)
  return (
    <div className="pt-44 pb-24">
      <Container>
        <h1 className="mb-12 text-4xl font-semibold tracking-tight text-foreground">
          Pagina di test scroll
        </h1>
        <div className="flex max-w-3xl flex-col gap-6">
          {paragraphs.map((text, i) => (
            <p key={i} className="text-base leading-relaxed text-muted-foreground">
              {text}
            </p>
          ))}
        </div>
      </Container>
    </div>
  )
}
