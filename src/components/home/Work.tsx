import { ArrowUpRight } from 'lucide-react'
import { projects, screenshot, type ConceptProject } from '../../data/projects'
import { tie } from '../../lib/czech'
import { FadeIn } from '../shared/FadeIn'
import { RevealText } from '../shared/RevealText'
import { TransitionLink } from '../shared/TransitionLink'
import { SectionLabel } from './SectionLabel'

function BrowserFrame({ project }: { project: ConceptProject }) {
  const { theme, slug } = project
  return (
    <div
      className="overflow-hidden rounded-[6px] shadow-[0_50px_100px_-50px_rgba(0,0,0,0.6)]"
      style={{ background: theme.bg, boxShadow: `0 0 0 1px ${theme.fg}1a, 0 50px 100px -50px rgba(0,0,0,.55)` }}
    >
      <div className="flex h-8 items-center gap-3 px-3 md:h-9" style={{ background: `${theme.fg}0d` }}>
        <span className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full" style={{ background: `${theme.fg}33` }} />
          ))}
        </span>
        <span
          className="mx-auto hidden truncate rounded-full px-4 py-0.5 text-[11px] sm:block"
          style={{ background: `${theme.fg}14`, color: theme.fg }}
        >
          /portfolio/{slug}
        </span>
        <span className="w-10" aria-hidden="true" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={screenshot(slug, 1600)}
          srcSet={`${screenshot(slug, 800)} 800w, ${screenshot(slug, 1600)} 1600w`}
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt={`Web ${project.name} — úvodní stránka`}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.035]"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden'
          }}
        />
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: ConceptProject; index: number }) {
  const { theme } = project
  const href = `/portfolio/${project.slug}`
  const transition = { label: project.name, bg: theme.bg, fg: theme.fg }

  return (
    <article
      className="relative grid gap-8 rounded-[10px] p-5 sm:p-7 md:p-9 lg:h-[min(84vh,780px)] lg:grid-cols-12 lg:gap-10 lg:p-10"
      style={{ background: theme.bg, color: theme.fg, ['--focus-color' as string]: theme.accent }}
    >
      <div className="flex flex-col lg:col-span-4 lg:py-1">
        <div className="flex items-center justify-between text-[12px] font-medium uppercase tracking-[0.14em]" style={{ color: theme.muted }}>
          <span className="tabular-nums">0{index + 1} / 0{projects.length}</span>
          <span>Koncept</span>
        </div>

        <h3 className="mt-6 font-display text-[clamp(2.75rem,5.4vw,5.75rem)] font-medium leading-[0.92] tracking-[-0.05em] lg:mt-auto">
          {project.name}
        </h3>
        <p className="mt-3 text-[15px] font-medium" style={{ color: theme.muted }}>
          {project.sector}
        </p>
        <p className="mt-6 max-w-md text-pretty text-[16px] leading-relaxed">{project.summary}</p>

        <dl className="mt-7 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t pt-5 text-[13px]" style={{ borderColor: `${theme.fg}1f` }}>
          <dt style={{ color: theme.muted }}>Zaměření</dt>
          <dd>{project.focus.join(' · ')}</dd>
          <dt style={{ color: theme.muted }}>Písmo</dt>
          <dd>{project.system.type}</dd>
          <dt style={{ color: theme.muted }}>Paleta</dt>
          <dd className="flex items-center gap-1.5">
            {project.system.palette.map((c) => (
              <span key={c} className="size-3.5 rounded-full" style={{ background: c, boxShadow: `inset 0 0 0 1px ${theme.fg}33` }} title={c} />
            ))}
          </dd>
        </dl>

        <div className="mt-8 lg:mt-10">
          <TransitionLink
            to={href}
            {...transition}
            className="group/cta inline-flex h-12 items-center gap-3 rounded-full pl-6 pr-1.5 text-[14px] font-medium transition-opacity hover:opacity-90"
            style={{ background: theme.fg, color: theme.bg }}
          >
            Zobrazit projekt<span className="sr-only">: {project.name}</span>
            <span
              className="grid size-9 place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover/cta:rotate-45"
              style={{ background: theme.bg, color: theme.fg }}
            >
              <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </TransitionLink>
        </div>
      </div>

      <div className="order-first lg:order-none lg:col-span-8 lg:flex lg:items-center">
        <TransitionLink to={href} {...transition} className="group block w-full" tabIndex={-1} aria-hidden="true" data-cursor="Otevřít">
          <BrowserFrame project={project} />
        </TransitionLink>
      </div>
    </article>
  )
}

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-ink pb-20 pt-24 text-paper md:pb-32 md:pt-36">
      <div className="mx-auto max-w-[1680px] px-3 sm:px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 px-2 sm:px-0 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index="01" tone="dark">
              Vybrané práce
            </SectionLabel>
            <RevealText
              as="h2"
              id="work-title"
              className="mt-8 font-display text-[clamp(2.6rem,6.6vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.05em]"
              lines={[
                'Pět oborů.',
                'Pět identit.',
                [{ text: 'Nula šablon.', className: 'font-serif font-normal italic tracking-[-0.02em] text-signal' }],
              ]}
            />
          </div>
          <FadeIn className="lg:col-span-4 lg:pb-3">
            <p className="max-w-md text-pretty text-[17px] leading-relaxed text-paper/70">
              {tie(
                'Každý projekt níže je kompletní, funkční web — navržený a postavený od prázdné stránky jako koncepční studie, ve stejné kvalitě jako práce pro klienta. Otevřete kterýkoli z nich a proklikejte se jím.',
              )}
            </p>
          </FadeIn>
        </div>

        <ol className="mt-16 flex flex-col gap-4 md:mt-24 lg:gap-0">
          {projects.map((project, i) => (
            <li
              key={project.slug}
              className="lg:sticky lg:mb-[14vh] lg:last:mb-0"
              style={{ top: `calc(5.5rem + ${i * 14}px)` }}
            >
              <ProjectCard project={project} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
