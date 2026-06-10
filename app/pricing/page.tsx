import { redirect } from 'next/navigation'

// Pricing now lives on the landing page; keep /pricing as a stable deep-link.
export default function PricingPage() {
  redirect('/#pricing')
}
