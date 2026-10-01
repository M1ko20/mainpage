import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cubic } from '../../lib/enter'
import { useReveal } from '../../lib/useReveal'

type Ease = readonly [number, number, number, number]

interface RevealProps {
  children?: ReactNode
  className?: string
  /** rise: fade up · clip: unveil upward · rule: draw from the left. */
  variant?: 'rise' | 'clip' | 'rule'
  delay?: number
  y?: number
  duration?: number
  ease?: Ease
  /** IntersectionObserver root margin: how far into the viewport before it plays. */
  margin?: string
  as?: ElementType
  'aria-hidden'?: boolean
}

/** Reveals its content when scrolled into view. Visible without JavaScript — see useReveal. */
export function Reveal({
  children,
  className = '',
  variant = 'rise',
  delay = 0,
  y = 24,
  duration = 0.9,
  ease,
  margin,
  as: Tag = 'div',
  ...rest
}: RevealProps) {
  const ref = useReveal<HTMLElement>(margin)
  const style = { '--delay': `${delay}s`, '--d': `${duration}s`, '--y': `${y}px`, ...(ease && { '--ease': cubic(ease) }) } as CSSProperties
  return (
    <Tag ref={ref} className={`reveal reveal-${variant} ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  )
}
