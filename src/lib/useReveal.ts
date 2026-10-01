import { useLayoutEffect, useRef } from 'react'

/**
 * Scroll-triggered reveal for the `.reveal*` classes in styles/index.css.
 *
 * The pre-rendered HTML carries the content in its final, visible state, so a
 * page is complete before any JavaScript has loaded. Only once this runs is an
 * element that still sits below the viewport hidden, to animate in when it is
 * scrolled to. Anything already on screen is left exactly as it was painted.
 */
export function useReveal<T extends HTMLElement>(margin = '0px 0px -10% 0px') {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.dataset.reveal = 'pending'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.reveal = 'in'
        observer.disconnect()
      },
      { rootMargin: margin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [margin])

  return ref
}
