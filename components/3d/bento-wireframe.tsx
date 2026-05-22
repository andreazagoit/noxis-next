'use client'

import { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'

export type GeometryType =
  | 'icosahedron'
  | 'octahedron'
  | 'torus'
  | 'torusKnot'
  | 'dodecahedron'

function getGeometry(geometry: GeometryType) {
  switch (geometry) {
    case 'icosahedron':
      return <icosahedronGeometry args={[1, 0]} />
    case 'octahedron':
      return <octahedronGeometry args={[1, 0]} />
    case 'torus':
      return <torusGeometry args={[0.7, 0.3, 16, 32]} />
    case 'torusKnot':
      return <torusKnotGeometry args={[0.6, 0.2, 64, 8]} />
    case 'dodecahedron':
      return <dodecahedronGeometry args={[1, 0]} />
  }
}

function WireframeShape({
  geometry,
  color = '#ffffff',
  rotationSpeed = 0.003,
}: {
  geometry: GeometryType
  color?: string
  rotationSpeed?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [active, setActive] = useState(false)
  const vec = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    setActive(true)
  }, [])

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += rotationSpeed
    meshRef.current.rotation.y += rotationSpeed * 1.5
    const targetScale = active ? 1 : 0
    vec.set(targetScale, targetScale, targetScale)
    meshRef.current.scale.lerp(vec, delta * 2.5)
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={0}>
        {getGeometry(geometry)}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
      </mesh>
    </Float>
  )
}

function GlassShape({
  geometry,
  rotationSpeed = 0.003,
}: {
  geometry: GeometryType
  rotationSpeed?: number
}) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const meshRef = useRef<THREE.Mesh>(null)
  const [active, setActive] = useState(false)
  const vec = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    setActive(true)
  }, [])

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += rotationSpeed
    meshRef.current.rotation.y += rotationSpeed * 1.5
    const targetScale = active ? 1.2 : 0
    vec.set(targetScale, targetScale, targetScale)
    meshRef.current.scale.lerp(vec, delta * 2.5)
  })

  const commonPhysicalProps = {
    roughness: 0.05,
    metalness: 0.05,
    reflectivity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    iridescence: 1,
    iridescenceIOR: 1.8,
    iridescenceThicknessRange: [200, 800] as [number, number],
    sheen: 0.5,
    sheenRoughness: 0.2,
    sheenColor: new THREE.Color('#ffffff'),
    color: '#ffffff',
  }

  const commonTransmissionProps = {
    backside: true,
    backsideThickness: 1,
    thickness: 1,
    roughness: 0,
    transmission: 1,
    ior: 1.5,
    chromaticAberration: 0.3,
    anisotropy: 0.1,
    distortion: 0,
    distortionScale: 0.3,
    color: '#ffffff',
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={0}>
        {getGeometry(geometry)}
        {isDark ? (
          <MeshTransmissionMaterial {...commonTransmissionProps} resolution={256} samples={4} />
        ) : (
          <meshPhysicalMaterial {...commonPhysicalProps} />
        )}
      </mesh>
    </Float>
  )
}

interface BentoWireframeProps {
  geometry: GeometryType
  className?: string
  accentColor?: boolean
  useGlass?: boolean
  position?: [number, number, number]
}

// Pauses the R3F render loop when the Canvas's host element is off-screen.
// Drops CPU/GPU use to ~0 for bentos below the fold or scrolled past.
function ViewportPause({ hostRef }: { hostRef: React.RefObject<HTMLDivElement | null> }) {
  const invalidate = useThree((s) => s.invalidate)
  const setFrameloop = useThree((s) => s.setFrameloop)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setFrameloop('always')
            invalidate()
          } else {
            setFrameloop('never')
          }
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hostRef, invalidate, setFrameloop])

  return null
}

export function BentoWireframe({
  geometry,
  className = '',
  accentColor = false,
  useGlass = false,
  position = [0, 0, 0],
}: BentoWireframeProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const wireColor = accentColor ? '#ffffff' : '#888888'

  return (
    <div
      ref={hostRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        // Cap DPR — retina iPads / phones don't need 3x for a tiny bento.
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        {/*
          Canvas is mounted as soon as the page loads (no viewport mount gate).
          The frameloop pauses automatically when the host element scrolls out
          of view, so off-screen bentos don't burn CPU/GPU.
        */}
        <ViewportPause hostRef={hostRef} />
        <Suspense fallback={null}>
          <group position={position}>
            {useGlass ? (
              <>
                <Environment preset="studio" />
                <GlassShape geometry={geometry} />
                <ambientLight intensity={0.5} />
                <pointLight position={[2, 2, 2]} intensity={2} />
                <pointLight position={[-2, -2, 2]} intensity={1} />
                <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} />
              </>
            ) : (
              <>
                <WireframeShape geometry={geometry} color={wireColor} />
                <ambientLight intensity={1} />
              </>
            )}
          </group>
        </Suspense>
      </Canvas>
    </div>
  )
}
