import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { briefTimings, briefTypes } from '../../data/content'
import { profile } from '../../data/profile'
import { tie } from '../../lib/czech'
import { FadeIn } from '../shared/FadeIn'
import { Magnetic } from '../shared/Magnetic'
import { RevealText } from '../shared/RevealText'
import { SectionLabel } from './SectionLabel'

function ChipGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: readonly T[]
  value: T | null
  onChange: (v: T) => void
}) {
  return (
    <fieldset>
      <legend className="text-[12px] font-medium uppercase tracking-[0.14em] text-mute-dark">{legend}</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="peer sr-only"
            />
            <span className="inline-flex h-11 items-center rounded-full px-5 text-[15px] ring-1 ring-white/20 transition-colors hover:ring-white/50 peer-checked:bg-paper peer-checked:text-ink peer-checked:ring-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function buildMailto(type: string | null, timing: string | null) {
  const subject = type ? `Nový projekt: ${type}` : 'Poptávka nového projektu'
  const body = [
    'Dobrý den,',
    '',
    `Projekt: ${type ?? '—'}`,
    `Termín: ${timing ?? '—'}`,
    '',
    'O firmě:',
    '',
    '',
    'Čeho má web dosáhnout:',
    '',
    '',
    'Odkazy (současný web, weby, které se vám líbí):',
    '',
  ].join('\n')
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function Contact() {
  const [type, setType] = useState<(typeof briefTypes)[number] | null>(null)
  const [timing, setTiming] = useState<(typeof briefTimings)[number] | null>(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-ink py-24 text-paper md:py-40">
      <div
        className="pointer-events-none absolute -right-[30vw] -top-[40vw] size-[90vw] opacity-[0.16]"
        style={{ background: 'radial-gradient(closest-side, #ff5a1f, rgba(255,90,31,0.35) 45%, transparent)' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1680px] px-5 md:px-8 lg:px-12">
        <SectionLabel index="07" tone="dark">
          Máte projekt?
        </SectionLabel>

        <RevealText
          as="h2"
          id="contact-title"
          // Four short lines on phones; from `sm` up the lines flow together and wrap balanced.
          className="mt-10 text-balance font-display text-[11.5vw] font-medium leading-[0.92] tracking-[-0.05em] sm:text-[clamp(3.5rem,8.4vw,10rem)] sm:leading-[0.9] sm:tracking-[-0.055em]"
          lineClassName="sm:inline"
          lines={[
            'Postavme web, ',
            'na který bude ',
            'konkurence ',
            [{ text: 'zírat.', className: 'font-serif font-normal italic tracking-[-0.025em] text-signal' }],
          ]}
        />

        {profile.email ? (
          <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-10">
            <FadeIn className="flex flex-col gap-10 lg:col-span-7">
              <ChipGroup legend="Co budeme stavět?" name="type" options={briefTypes} value={type} onChange={setType} />
              <ChipGroup legend="Kdy má být hotovo?" name="timing" options={briefTimings} value={timing} onChange={setTiming} />
            </FadeIn>

            <FadeIn delay={0.1} className="flex flex-col justify-end gap-6 lg:col-span-5 lg:items-end">
              <p className="max-w-sm text-pretty text-[16px] leading-relaxed text-paper/65 lg:text-right">
                {tie(
                  'Vyberte, co sedí, a otevře se vám e-mail s krátkým briefem připraveným k doplnění. Přijde rovnou mně — žádné formuláře, žádné obchodní oddělení.',
                )}
              </p>
              <Magnetic strength={0.25}>
                <a
                  href={buildMailto(type, timing)}
                  className="group inline-flex h-16 items-center gap-4 rounded-full bg-signal pl-8 pr-2 text-[17px] font-medium text-ink transition-colors duration-300 hover:bg-paper hover:text-ink md:h-20 md:pl-10 md:text-[19px]"
                >
                  Chci nový web
                  <span className="grid size-12 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-out-expo group-hover:rotate-45 md:size-16">
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </span>
                </a>
              </Magnetic>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] lg:justify-end">
                <a href={`mailto:${profile.email}`} className="underline decoration-white/25 underline-offset-4 hover:decoration-white">
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-[13px] text-paper/70 ring-1 ring-white/15 transition-colors hover:text-paper hover:ring-white/40"
                >
                  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span aria-live="polite">{copied ? 'Zkopírováno' : 'Kopírovat e-mail'}</span>
                </button>
                {profile.phone && (
                  <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="underline decoration-white/25 underline-offset-4 hover:decoration-white">
                    {profile.phone}
                  </a>
                )}
              </div>
            </FadeIn>
          </div>
        ) : null}
      </div>
    </section>
  )
}
