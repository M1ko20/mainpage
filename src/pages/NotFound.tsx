import { ArrowLeft } from 'lucide-react'
import { TransitionLink } from '../components/shared/TransitionLink'
import { useSeo } from '../lib/seo'
import { useBodyTheme } from '../lib/useBodyTheme'

export default function NotFound() {
  useSeo(null)
  useBodyTheme('#f1efea')

  return (
    <main className="mx-auto flex min-h-dvh max-w-[1680px] flex-col justify-between px-5 py-8 md:px-8 lg:px-12">
      <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-mute">Chyba 404</p>
      <div>
        <h1 className="font-display text-[clamp(3rem,11vw,12rem)] font-medium leading-[0.9] tracking-[-0.055em]">
          Tady nic
          <br />
          <span className="font-serif font-normal italic tracking-[-0.03em]">není</span>
          <span className="text-signal">.</span>
        </h1>
        <p className="mt-8 max-w-md text-[17px] leading-relaxed text-ink/70">
          Stránka, kterou hledáte, se přesunula, nebo nikdy neexistovala. Ukázky práce jsou ale přesně tam, kde mají být.
        </p>
        <TransitionLink
          to="/#work"
          className="mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-ink px-7 text-[15px] font-medium text-paper transition-colors hover:bg-signal"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Zpět na portfolio
        </TransitionLink>
      </div>
      <span />
    </main>
  )
}
