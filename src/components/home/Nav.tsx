import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { profile } from '../../data/profile'

const links = [
  { href: '#work', label: 'Práce' },
  { href: '#about', label: 'O mně' },
  { href: '#services', label: 'Služby' },
  { href: '#process', label: 'Proces' },
]

const EASE = [0.76, 0, 0.24, 1] as const

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    const nextScrolled = y > 24
    if (nextScrolled !== scrolled) setScrolled(nextScrolled)
    let nextHidden = hidden
    if (y <= 400 || open) nextHidden = false
    else if (y > previous + 4) nextHidden = true
    else if (y < previous - 4) nextHidden = false
    if (nextHidden !== hidden) setHidden(nextHidden)
  })

  // The page can load already scrolled (reload, #hash, scrolling before the script arrived).
  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 24)
    sync()
  }, [])

  useEffect(() => {
    if (!open) return
    const { style } = document.body
    const prev = style.overflow
    style.overflow = 'hidden'
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab' && menuRef.current) {
        const items = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>('a')].filter(Boolean) as HTMLElement[]
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-out-expo ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled && !open ? 'bg-paper/95 shadow-[0_1px_0_rgba(15,15,14,0.08)] lg:bg-paper/85 lg:backdrop-blur-md' : ''}`}
      >
        <nav
          aria-label="Hlavní"
          className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:h-20 md:px-8 lg:px-12"
        >
          <a
            href="#top"
            className={`relative z-[60] flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] transition-colors ${open ? 'text-paper' : ''}`}
            onClick={close}
          >
            <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
            {profile.name}
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative block px-4 py-2 text-[14px] font-medium text-ink/70 transition-colors hover:text-ink"
                >
                  {l.label}
                  <span className="absolute inset-x-4 bottom-1.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-paper transition-colors hover:bg-signal sm:inline-flex"
            >
              Chci nový web
            </a>
            <button
              ref={toggleRef}
              type="button"
              className={`relative z-[60] flex h-11 items-center gap-3 rounded-full px-4 text-[14px] font-medium lg:hidden ${
                open ? 'text-paper' : 'bg-ink/[0.06]'
              }`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span>{open ? 'Zavřít' : 'Menu'}</span>
              <span className="relative block h-2.5 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo ${open ? 'translate-y-[4.5px] rotate-45' : ''}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo ${open ? '-translate-y-[4.5px] -rotate-45' : ''}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[55] flex flex-col bg-ink px-5 pb-8 pt-28 text-paper md:px-8 lg:hidden"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.7, ease: EASE } }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.5, ease: EASE } }}
          >
            <ul className="flex flex-col">
              {[...links, { href: '#contact', label: 'Kontakt' }].map((l, i) => (
                <li key={l.href} className="overflow-hidden border-b border-white/10">
                  <m.a
                    href={l.href}
                    onClick={close}
                    className="flex items-baseline justify-between py-4 font-display text-[clamp(2.5rem,12vw,4.5rem)] font-medium leading-none tracking-[-0.04em]"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.06 } }}
                  >
                    {l.label}
                    <span className="text-sm font-normal tracking-normal text-mute-dark">0{i + 1}</span>
                  </m.a>
                </li>
              ))}
            </ul>
            <m.div
              className="mt-auto flex flex-col gap-1 text-[15px] text-mute-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
            >
              <span>Napište mi</span>
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="text-lg text-paper underline decoration-white/30 underline-offset-4">
                  {profile.email}
                </a>
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
