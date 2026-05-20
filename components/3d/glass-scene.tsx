'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Center,
  Environment,
  MeshTransmissionMaterial,
  PointMaterial,
  Points,
  Text3D,
} from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'
import { useLoading } from '@/context/loading-context'

const TARGET_SCALE_MOBILE = new THREE.Vector3(0.55, 0.55, 0.55)
const TARGET_SCALE_DESKTOP = new THREE.Vector3(0.85, 0.85, 0.85)
const ZERO_SCALE = new THREE.Vector3(0, 0, 0)
const TARGET_COLOR_LIGHT = new THREE.Color('#ffffff')
const TARGET_COLOR_DARK = new THREE.Color('#ffffff')

function Particles({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const count = 2500

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.getElapsedTime()
    ref.current.rotation.y = time * 0.05
    ref.current.rotation.x = time * 0.02
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={isDark ? 0.6 : 0.4}
      />
    </Points>
  )
}

function Geometries({ isDark, isLoading }: { isDark: boolean; isLoading: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const xGroupRef = useRef<THREE.Group>(null)
  const { size } = useThree()
  const isMobile = size.width < 768
  const matRefs = useRef<Array<any>>([])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    const baseScale = isMobile ? TARGET_SCALE_MOBILE : TARGET_SCALE_DESKTOP
    const targetScale = isLoading ? ZERO_SCALE : baseScale
    groupRef.current.scale.lerp(targetScale, 0.05)

    if (xGroupRef.current) {
      xGroupRef.current.rotation.y = time * 0.2
    }

    const targetColor = isDark ? TARGET_COLOR_DARK : TARGET_COLOR_LIGHT
    const targetIridescence = isDark ? 0.3 : 1.0

    matRefs.current.forEach((mat) => {
      if (mat) {
        if ('iridescence' in mat) {
          mat.iridescence = THREE.MathUtils.lerp(mat.iridescence, targetIridescence, 0.1)
        }
        if ('chromaticAberration' in mat) {
          mat.chromaticAberration = THREE.MathUtils.lerp(
            mat.chromaticAberration,
            isDark ? 1.5 : 5,
            0.1,
          )
        }
        mat.color.lerp(targetColor, 0.05)
      }
    })
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
    backsideThickness: 1.5,
    thickness: 2,
    roughness: 0,
    transmission: 1,
    ior: 1.5,
    chromaticAberration: 0.5,
    anisotropy: 0.5,
    distortion: 0,
    distortionScale: 0.5,
    temporalDistortion: 0.5,
    color: '#ffffff',
  }

  const addMatRef = (el: any) => {
    if (el && !matRefs.current.includes(el)) {
      matRefs.current.push(el)
    }
  }

  const textProps = {
    font: '/fonts/helvetiker_bold.typeface.json',
    size: 2.5,
    height: 0.4,
    curveSegments: 32,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelOffset: 0,
    bevelSegments: 10,
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0, 0, 0]}>
      <group ref={xGroupRef} position={[0, 0, 0]}>
        <Center>
          <Text3D {...textProps}>
            X
            {isDark ? (
              <MeshTransmissionMaterial
                ref={addMatRef}
                {...commonTransmissionProps}
                resolution={512}
                samples={6}
              />
            ) : (
              <meshPhysicalMaterial ref={addMatRef} {...commonPhysicalProps} />
            )}
          </Text3D>
        </Center>
      </group>
    </group>
  )
}

export function GlassScene() {
  const { resolvedTheme } = useTheme()
  const { isLoading } = useLoading()
  const isDark = resolvedTheme !== 'light'

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Particles isDark={isDark} />
          <Geometries isDark={isDark} isLoading={isLoading} />
          <ambientLight intensity={0.5} />

          <pointLight position={[2, 2, 2]} intensity={2} color="#ffffff" />
          <pointLight position={[-2, -2, 2]} intensity={1.5} color="#ffffff" />
          <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />

          <spotLight position={[5, 5, 5]} angle={0.25} penumbra={1} intensity={2} />
        </Suspense>
      </Canvas>
    </div>
  )
}
