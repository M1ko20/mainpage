import type { CSSProperties } from 'react'

interface EnterOptions {
  /** Start offset for enter-rise, e.g. '40px'. */
  y?: string
  /** Start offset for enter-slide, e.g. '12%'. */
  x?: string
  /** Start scale for enter-zoom. */
  scale?: number
  ease?: string
}

/** Timing for the CSS `.enter-*` entrance animations defined in styles/index.css. */
export function enter(delay = 0, duration = 1, { y, x, scale, ease }: EnterOptions = {}): CSSProperties {
  const style: Record<string, string> = { '--delay': `${delay}s`, '--d': `${duration}s` }
  if (y) style['--y'] = y
  if (x) style['--x'] = x
  if (scale) style['--scale'] = String(scale)
  if (ease) style['--ease'] = ease
  return style as CSSProperties
}

/** A motion-style easing tuple as a CSS timing function. */
export const cubic = (ease: readonly [number, number, number, number]) => `cubic-bezier(${ease.join(',')})`
