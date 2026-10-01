import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { usePageTransition } from '../../lib/transition-context'

interface TransitionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  /** Text shown on the transition curtain. */
  label?: string
  bg?: string
  fg?: string
  onNavigate?: () => void
}

/** A real <Link> (so it can be opened in a new tab) that plays the page transition on plain clicks. */
export function TransitionLink({ to, label, bg, fg, onNavigate, onClick, ...anchorProps }: TransitionLinkProps) {
  const { go } = usePageTransition()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onNavigate?.()
    go(to, { label, bg, fg })
  }

  return <Link to={to} onClick={handleClick} {...anchorProps} />
}
