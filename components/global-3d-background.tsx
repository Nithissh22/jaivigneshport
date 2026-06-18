"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Stars, Float } from "@react-three/drei"
import { isMobile } from "@/lib/device-utils"
import * as THREE from "three"

// 3D Cricket Ball Component
function CricketBall({ position, scale = 1, speed = 1 }: { position: [number, number, number], scale?: number, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed
    }
  })

  return (
    <Float speed={1.5 * speed} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#dc2626"
          roughness={0.4}
          metalness={0.5}
          emissive="#7f1d1d"
          emissiveIntensity={0.2}
        />
        {/* Seam */}
        <mesh>
          <torusGeometry args={[1.01, 0.05, 16, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
      </mesh>
    </Float>
  )
}

// 3D Abstract Stump Component
function AbstractStump({ position, scale = 1, rotation = [0, 0, 0] }: { position: [number, number, number], scale?: number, rotation?: [number, number, number] }) {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position} scale={scale} rotation={rotation as any}>
        <cylinderGeometry args={[0.1, 0.1, 3, 16]} />
        <meshStandardMaterial
          color="#fbbf24"
          roughness={0.2}
          metalness={0.8}
          emissive="#b45309"
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null)

  // Gentle scroll parallax effect
  useFrame(() => {
    if (groupRef.current) {
      const scrollY = window.scrollY
      groupRef.current.position.y = scrollY * 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {/* Background Atmosphere */}
      <Stars radius={100} depth={50} count={800} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={2} color="#22c55e" />
      
      {/* Grand 3D Elements distributed across the global background */}
      <CricketBall position={[-6, 2, -10]} scale={1.5} speed={0.5} />
      <CricketBall position={[8, -5, -15]} scale={2} speed={0.3} />
      <CricketBall position={[-4, -12, -8]} scale={1.2} speed={0.8} />
      
      {/* Floating abstract stumps */}
      <AbstractStump position={[5, 4, -12]} scale={1.5} rotation={[0, 0, Math.PI / 8]} />
      <AbstractStump position={[-7, -8, -14]} scale={2} rotation={[0, 0, -Math.PI / 6]} />
      
      {/* Geometric Glowing Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={3}>
          <mesh
            position={[
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 20 - 10
            ]}
          >
            <octahedronGeometry args={[Math.random() * 0.5 + 0.1, 0]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#22c55e" : "#fbbf24"} 
              emissive={i % 2 === 0 ? "#16a34a" : "#d97706"}
              emissiveIntensity={1.5}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export function Global3DBackground() {
  const [mounted, setMounted] = useState(false)
  const [isMob, setIsMob] = useState(false)

  useEffect(() => {
    setIsMob(isMobile())
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-green-950/40 via-background to-background z-0" />
      
      {!isMob && (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]}
          className="absolute inset-0 z-10"
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <Scene />
          </Suspense>
        </Canvas>
      )}
      
      {/* Overlays to ensure text remains perfectly readable */}
      <div className="absolute inset-0 bg-background/30 z-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background z-20" />
    </div>
  )
}
