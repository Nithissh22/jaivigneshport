'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { isMobile as checkIsMobile } from '@/lib/device-utils'

// Grand Cinematic Stadium Floodlight
const Floodlight = ({ isLeft, isMobile }: { isLeft?: boolean, isMobile: boolean }) => (
  <motion.div
    className={`absolute top-0 ${isLeft ? 'left-[-10%]' : 'right-[-10%]'} w-[50%] h-[120%] origin-top pointer-events-none ${!isMobile ? 'mix-blend-screen' : ''} z-0`}
    style={{
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(34,197,94,0.05) 50%, transparent 100%)',
      clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0% 100%)',
      filter: isMobile ? 'none' : 'blur(10px)',
    }}
    animate={!isMobile ? {
      rotate: isLeft ? [20, 40, 20] : [-20, -40, -20],
      opacity: [0.3, 0.6, 0.3],
    } : { rotate: isLeft ? 20 : -20, opacity: 0.3 }}
    transition={{ duration: 12 + (isLeft ? 2 : 0), repeat: Infinity, ease: "easeInOut" }}
  />
)

// Glowing Perspective Pitch Grid
const PerspectivePitchGrid = ({ isMobile }: { isMobile: boolean }) => (
  <div className="absolute inset-x-0 bottom-0 h-[60%] overflow-hidden pointer-events-none z-0" style={{ perspective: isMobile ? 'none' : '1000px' }}>
    <motion.div 
      className="absolute bottom-0 left-[-50%] w-[200%] h-[200%] origin-bottom border-t border-green-500/10"
      style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.15) 2px, transparent 2px), linear-gradient(90deg, rgba(34,197,94,0.15) 2px, transparent 2px)',
        backgroundSize: isMobile ? '30px 50px' : '60px 100px',
        transform: isMobile ? 'none' : 'rotateX(75deg) translateZ(0)',
        boxShadow: isMobile ? 'none' : 'inset 0 0 100px 50px background'
      }}
      animate={!isMobile ? {
        backgroundPosition: ['0px 0px', '0px 100px']
      } : {}}
      transition={!isMobile ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-background/80 to-background z-10" />
  </div>
)

// Giant Cinematic Glowing Cricket Ball silhouette
const GiantCinematicBall = ({ isMobile }: { isMobile: boolean }) => (
  <motion.div
    className={`absolute top-1/4 left-1/4 pointer-events-none opacity-10 ${!isMobile ? 'mix-blend-screen' : ''}`}
    animate={!isMobile ? {
      y: [0, -30, 0],
      rotate: [0, 360]
    } : {}}
    transition={!isMobile ? {
      y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 60, repeat: Infinity, ease: "linear" }
    } : {}}
  >
    <svg width={isMobile ? "300" : "600"} height={isMobile ? "300" : "600"} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="1" />
      <path d="M30 15 Q 50 50 30 85 M70 15 Q 50 50 70 85" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="2 4" />
    </svg>
  </motion.div>
)

// Ambient Stadium Dust/Sparks
function StadiumDust({ isMobile }: { isMobile: boolean }) {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
  }, [])

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-green-400"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, filter: 'blur(1px)' }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  )
}

export function Shared3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsMobile(checkIsMobile())
  }, [])

  if (!isMounted) return <div ref={containerRef} className="absolute inset-0 z-0 bg-background" />

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-background">
      {/* Deep cinematic gradient base */}
      <div className="absolute inset-0 bg-gradient-radial from-green-950/30 via-background to-background" />
      
      {/* Giant abstracted background elements */}
      <GiantCinematicBall isMobile={isMobile} />
      
      {/* Perspective Grid for depth */}
      <PerspectivePitchGrid isMobile={isMobile} />
      
      {/* Grand sweeping stadium floodlights */}
      <Floodlight isLeft={true} isMobile={isMobile} />
      <Floodlight isLeft={false} isMobile={isMobile} />
      
      {/* Glowing stadium dust/atmosphere */}
      <StadiumDust isMobile={isMobile} />
      
      {/* Cinematic dark overlays to blend perfectly with text/content */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-[1] pointer-events-none" />
      
      {/* Subtle noise texture for premium matte film feel */}
      {!isMobile && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  )
}

