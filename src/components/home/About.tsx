import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { firstName, profile } from '../../data/profile'
import { tie } from '../../lib/czech'
import { FadeIn } from '../shared/FadeIn'
import { SectionLabel } from './SectionLabel'

const statement = tie(
  `Jsem ${firstName}. Weby navrhuji a sám je i programuji — takže kdo nápad vymyslí, ten ho také dotáhne. Jeden kontakt, jeden standard, od první schůzky po spuštění.`,
)

const defaultBio = [
  'Zní to jako detail, ale není. Většina webů ztratí to nejlepší při předávce: designér si ho představí, vývojář ho přibližně napodobí a za výsledek nakonec nikdo pořádně neodpovídá.',
  'Já odpovídám za všechno — koncept, rozhraní, rychlost i drobnosti, díky kterým návštěvník uvěří tomu, co vidí. Výsledkem je web, který vypadá přesně tak, jak měl, funguje na každé obrazovce a přivádí vám poptávky, ne jen pochvaly.',
]

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <m.span style={{ opacity }} className="inline">
      {children}{' '}
    </m.span>
  )
}

/** Statement whose words fill in as it scrolls through the viewport. Static under reduced motion. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const reduce = useReducedMotion()
  const words = text.split(' ')

  return (
    <p ref={ref} className="font-display text-[clamp(1.9rem,4.1vw,4.25rem)] font-medium leading-[1.06] tracking-[-0.035em] text-balance">
      {reduce ? (
        text
      ) : (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {w}
              </Word>
            ))}
          </span>
        </>
      )}
    </p>
  )
}

export function About() {
  const bio = (profile.bio.length ? profile.bio : defaultBio).map(tie)
  // The side column only exists when there are real details to put in it.
  const hasDetails = profile.stack.length > 0 || profile.experience.length > 0 || profile.projects.length > 0

  return (
    <section id="about" aria-labelledby="about-title" className="py-24 md:py-40">
      <div className="mx-auto grid max-w-[1680px] gap-10 px-5 md:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-3">
          <SectionLabel index="02">O mně</SectionLabel>
          <h2 id="about-title" className="sr-only">
            O mně — {profile.name}
          </h2>
        </div>

        <div className="lg:col-span-9">
          <ScrollStatement text={statement} />

          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-2 lg:gap-16">
            <FadeIn
              className={`grid gap-5 text-[17px] leading-relaxed text-ink/75 ${hasDetails ? '' : 'md:col-span-2 md:grid-cols-2 md:gap-x-12 lg:gap-x-16'}`}
            >
              {profile.intro && <p className="text-ink md:col-span-full">{tie(profile.intro)}</p>}
              {bio.map((p) => (
                <p key={p.slice(0, 24)} className="text-pretty">
                  {p}
                </p>
              ))}
            </FadeIn>

            {hasDetails && (
              <FadeIn delay={0.1} className="flex flex-col gap-10">
                {profile.stack.length > 0 && (
                  <div>
                    <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-mute">Nástroje, se kterými pracuji</h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {profile.stack.map((t) => (
                        <li key={t} className="rounded-full px-4 py-2 text-[14px] ring-1 ring-ink/15">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile.experience.length > 0 && (
                  <div>
                    <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-mute">Zkušenosti</h3>
                    <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                      {profile.experience.map((e) => (
                        <li key={e} className="py-3 text-[15px]">
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile.projects.length > 0 && (
                  <div>
                    <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-mute">Realizované projekty</h3>
                    <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                      {profile.projects.map((p) => (
                        <li key={p.name} className="py-4">
                          <a href={p.url} target="_blank" rel="noreferrer" className="group flex items-baseline justify-between gap-4">
                            <span className="text-[17px] font-medium underline decoration-ink/20 underline-offset-4 group-hover:decoration-ink">
                              {p.name}
                            </span>
                            <span className="text-[13px] text-mute">{p.stack.join(' · ')}</span>
                          </a>
                          <p className="mt-1 text-[15px] text-ink/70">{p.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </FadeIn>
            )}
          </div>

          {profile.stats.length > 0 && (
            <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden border-y border-ink/10 md:grid-cols-4">
              {profile.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse gap-2 py-6">
                  <dt className="text-[14px] text-mute">{s.label}</dt>
                  <dd className="font-display text-[clamp(2.5rem,4vw,4rem)] font-medium leading-none tracking-[-0.04em]">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  )
}
