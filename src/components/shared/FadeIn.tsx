import { m } from 'motion/react'
import type { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  as?: 'div' | 'li' | 'p' | 'section' | 'article'
}

export function FadeIn({ children, className, delay = 0, y = 24, duration = 0.9, as = 'div' }: FadeInProps) {
  const Component = m[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}
