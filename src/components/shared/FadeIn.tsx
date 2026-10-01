import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  as?: 'div' | 'li' | 'p' | 'section' | 'article'
}

export function FadeIn(props: FadeInProps) {
  return <Reveal {...props} />
}
