
import React from 'react'
import { cn } from '@/lib/utils'

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  className,
  delay = 0 
}) => {
  return (
    <div 
      className={cn(
        "animate-float",
        className
      )}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: '6s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out'
      }}
    >
      {children}
    </div>
  )
}

interface ParticleProps {
  count?: number
  className?: string
}

export const ParticleBackground: React.FC<ParticleProps> = ({ 
  count = 50,
  className 
}) => {
  const particles = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(
        "absolute rounded-full bg-green-400/20 animate-pulse",
        className
      )}
      style={{
        width: Math.random() * 4 + 2,
        height: Math.random() * 4 + 2,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${Math.random() * 2 + 2}s`
      }}
    />
  ))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles}
    </div>
  )
}
