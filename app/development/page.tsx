import type { Metadata } from 'next'
import { DevelopmentContent } from '@/components/pages/development-content'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('development')
}

export default function DevelopmentPage() {
  return <DevelopmentContent />
}
