import type { Metadata } from 'next'
import { HomeContent } from '@/components/pages/home-content'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('home')
}

export default function HomePage() {
  return <HomeContent />
}
