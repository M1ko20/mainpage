import { reasons } from '../../data/content'
import { FadeIn } from '../shared/FadeIn'
import { RevealText } from '../shared/RevealText'
import { SectionLabel } from './SectionLabel'

export function Why() {
  return (
    <section id="why" aria-labelledby="why-title" className="py-24 md:py-40">
      <div className="mx-auto max-w-[1680px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index="05">Proč se mnou</SectionLabel>
          </div>
          <RevealText
            as="h2"
            id="why-title"
            className="font-display text-[clamp(2.4rem,5.6vw,6rem)] font-medium leading-[0.95] tracking-[-0.05em] lg:col-span-9"
            lines={[
              'Kvalita agentury,',
              [{ text: 'bez agentury.', className: 'font-serif font-normal italic tracking-[-0.02em] text-mute' }],
            ]}
          />
        </div>

        <ul className="mt-16 grid gap-x-10 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <FadeIn as="li" key={r.title} delay={(i % 3) * 0.08} className="border-t border-ink/15 pb-12 pt-6 md:pb-16">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[clamp(1.4rem,1.9vw,1.75rem)] font-medium tracking-[-0.03em]">{r.title}</h3>
                <span className="text-[13px] tabular-nums text-mute">0{i + 1}</span>
              </div>
              <p className="mt-4 max-w-md text-pretty text-[16px] leading-relaxed text-ink/70">{r.body}</p>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  )
}
