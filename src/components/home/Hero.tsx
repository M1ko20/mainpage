import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { tie } from '../../lib/czech'
import { enter } from '../../lib/enter'
import { profile } from '../../data/profile'
import { Magnetic } from '../shared/Magnetic'
import { RevealText } from '../shared/RevealText'
import { Reel } from './Reel'

export function Hero() {
  return (
    <section id="top" className="relative pb-16 pt-24 md:pb-24 md:pt-32">
      <div className="mx-auto w-full max-w-[1680px] px-5 md:px-8 lg:px-12">
        <div
          className="enter enter-fade flex items-center justify-between border-b border-ink/10 pb-4 text-[12px] font-medium uppercase tracking-[0.14em] text-mute"
          style={enter(0.2, 1)}
        >
          <p>{profile.role}</p>
          <p className="hidden sm:block">Návrh — Vývoj — Spuštění</p>
        </div>

        <div className="relative xl:pb-32">
          <RevealText
            as="h1"
            immediate
            delay={0.15}
            stagger={0.09}
            duration={1.2}
            className="mt-8 font-display text-[clamp(3.1rem,10.2vw,12.5rem)] font-medium leading-[0.9] tracking-[-0.055em] md:mt-12"
            lines={[
              'První dojem,',
              [{ text: 'který prodává.', className: 'font-serif font-normal italic tracking-[-0.03em]' }],
            ]}
          />

          <div
            className="enter enter-rise mt-10 flex flex-col gap-8 md:mt-12 xl:absolute xl:right-0 xl:top-[calc(3rem+min(10.2vw,12.5rem)*0.97)] xl:mt-0 xl:w-[34%] 2xl:w-[32%]"
            style={enter(0.75, 1.1)}
          >
            <p className="max-w-[34rem] text-pretty text-[clamp(1.125rem,1.35vw,1.3rem)] leading-[1.45] text-ink/75">
              {tie('Navrhuji a programuji weby pro firmy, které si nemohou dovolit vypadat jako všichni ostatní. Strategie, design, kód i spuštění —')}{' '}
              <span className="text-ink">{tie('jeden člověk od začátku do konce, žádné šablony.')}</span>
            </p>
            <div className="grid gap-3 min-[480px]:flex min-[480px]:flex-wrap min-[480px]:items-center">
              <Magnetic className="block min-[480px]:inline-block">
                <a
                  href="#contact"
                  className="group flex h-14 items-center justify-between gap-3 rounded-full bg-ink pl-7 pr-2 min-[480px]:inline-flex min-[480px]:justify-start text-[15px] font-medium text-paper transition-colors duration-300 hover:bg-signal"
                >
                  Chci nový web
                  <span className="grid size-10 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </a>
              </Magnetic>
              <a
                href="#work"
                className="group flex h-14 items-center justify-between gap-2 rounded-full px-6 text-[15px] min-[480px]:inline-flex min-[480px]:justify-start font-medium ring-1 ring-ink/15 transition-colors hover:bg-ink/5"
              >
                Prohlédnout ukázky
                <ArrowDown size={16} className="transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="enter enter-rise mt-16 md:mt-24" style={enter(0.6, 1.3, { y: '40px' })}>
          <Reel />
        </div>
      </div>
    </section>
  )
}
