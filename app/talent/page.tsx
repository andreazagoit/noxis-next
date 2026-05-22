import type { Metadata } from 'next'
import { TalentContent } from '@/components/pages/talent-content'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('talent')
}

export default function TalentPage() {
  return <TalentContent />
}
