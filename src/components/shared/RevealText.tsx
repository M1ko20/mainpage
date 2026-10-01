import { m } from 'motion/react'
import type { ElementType } from 'react'
import { tie } from '../../lib/czech'
import { enter } from '../../lib/enter'

export interface RevealPart {
  text: string
  className?: string
}

interface RevealTextProps {
  /** Lines of text; each line may be split into styled parts. */
  lines: (string | RevealPart[])[]
  as?: ElementType
  id?: string
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  duration?: number
  ease?: readonly [number, number, number, number]
  /**
   * Animate on first paint with CSS (no JavaScript needed), for above-the-fold
   * headings. Otherwise the reveal runs when scrolled into view.
   */
  immediate?: boolean
}

const toParts = (line: string | RevealPart[]): RevealPart[] =>
  (typeof line === 'string' ? [{ text: line }] : line).map((part) => ({ ...part, text: tie(part.text) }))

// Each word is masked for the reveal. The mask is padded on every side (and the padding
// cancelled with negative margins, so layout is unchanged): italic overhangs, descenders
// and Czech accents stay whole instead of being clipped at the glyph box.
const MASK = 'inline-block overflow-hidden align-top px-[0.14em] -mx-[0.14em] pt-[0.14em] -mt-[0.14em] pb-[0.24em] -mb-[0.24em]'

// Split on ordinary spaces only: no-break spaces keep their words in one animated unit.
const split = (text: string) => text.split(/( +)/)

/**
 * Masked word-by-word reveal. The full sentence stays in the DOM as plain
 * text for screen readers; the animated words are hidden from them.
 */
export function RevealText({
  lines,
  as: Tag = 'h2',
  id,
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.06,
  duration = 1,
  ease = [0.16, 1, 0.3, 1],
  immediate = false,
}: RevealTextProps) {
  const label = lines.map((l) => toParts(l).map((p) => p.text).join('')).join(' ')
  let index = 0

  if (immediate) {
    return (
      <Tag id={id} className={className} aria-label={label}>
        <span aria-hidden="true" className="block">
          {lines.map((line, li) => (
            <span key={li} className={`block ${lineClassName}`}>
              {toParts(line).map((part, pi) =>
                split(part.text).map((word, wi) => {
                  if (/^ +$/.test(word)) return <span key={`${pi}-${wi}`}> </span>
                  if (!word) return null
                  const i = index++
                  return (
                    <span key={`${pi}-${wi}`} className={MASK}>
                      <span className={`enter enter-mask inline-block ${part.className ?? ''}`} style={enter(delay + i * stagger, duration)}>
                        {word}
                      </span>
                    </span>
                  )
                }),
              )}
            </span>
          )).flatMap((line, li) => (li ? [' ', line] : [line]))}
        </span>
      </Tag>
    )
  }

  return (
    <Tag id={id} className={className} aria-label={label}>
      <m.span
        aria-hidden="true"
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      >
        {lines.map((line, li) => (
          <span key={li} className={`block ${lineClassName}`}>
            {toParts(line).map((part, pi) =>
              split(part.text).map((word, wi) => {
                if (/^ +$/.test(word)) return <span key={`${pi}-${wi}`}> </span>
                if (!word) return null
                const i = index++
                return (
                  <span key={`${pi}-${wi}`} className={MASK}>
                    <m.span
                      className={`inline-block ${part.className ?? ''}`}
                      variants={{
                        hidden: { y: '160%' },
                        show: { y: '0%', transition: { duration, ease, delay: delay + i * stagger } },
                      }}
                    >
                      {word}
                    </m.span>
                  </span>
                )
              }),
            )}
          </span>
        )).flatMap((line, li) => (li ? [' ', line] : [line]))}
      </m.span>
    </Tag>
  )
}
