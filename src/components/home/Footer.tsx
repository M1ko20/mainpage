import { ArrowUp } from 'lucide-react'
import { profile } from '../../data/profile'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="overflow-hidden bg-ink pb-8 text-paper">
      <div className="mx-auto max-w-[1680px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 border-t border-white/10 pt-12 text-[14px] md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-medium">{profile.name}</p>
            <p className="mt-1 text-mute-dark">
              {profile.role}
              {profile.location && ` — ${profile.location}`}
            </p>
          </div>
          <div className="flex flex-col gap-2 md:col-span-4">
            <p className="text-mute-dark">Kontakt</p>
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="w-fit hover:text-signal">
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="w-fit hover:text-signal">
                {profile.phone}
              </a>
            )}
          </div>
          {profile.socials.length > 0 && (
            <nav aria-label="Sociální sítě" className="flex flex-col gap-2 md:col-span-3">
              <p className="text-mute-dark">Najdete mě i jinde</p>
              {profile.socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="w-fit hover:text-signal">
                  {s.label}
                </a>
              ))}
            </nav>
          )}
          <div className="md:col-start-12 md:justify-self-end">
            <a
              href="#top"
              className="grid size-12 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-paper hover:text-ink"
              aria-label="Zpět nahoru"
            >
              <ArrowUp size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <p
          data-decorative
          className="mt-16 select-none whitespace-nowrap font-display text-[15.5vw] font-semibold leading-[0.8] tracking-[-0.06em] text-paper/[0.07] md:mt-24"
          aria-hidden="true"
        >
          {profile.name}
        </p>

        <div className="mt-8 flex flex-col justify-between gap-2 text-[13px] text-mute-dark sm:flex-row">
          <p>
            © {year} {profile.name}
          </p>
          <p>Navrženo a nakódováno ručně, bez šablon.</p>
        </div>
      </div>
    </footer>
  )
}
