'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type { BentoWireframe as BentoWireframeType } from '@/components/3d/bento-wireframe'

// Lazy-load the 3D Bento (react-three-fiber + drei + three) so it doesn't
// land in the main JS bundle. SSR off because three.js is browser-only.
const BentoWireframeDynamic = dynamic(
  () =>
    import('@/components/3d/bento-wireframe').then((m) => ({
      default: m.BentoWireframe,
    })),
  { ssr: false, loading: () => null },
)

type Props = ComponentProps<typeof BentoWireframeType>

export function BentoWireframe(props: Props) {
  return <BentoWireframeDynamic {...props} />
}

export type { GeometryType } from '@/components/3d/bento-wireframe'
