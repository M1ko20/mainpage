import { ArrowLeft } from 'lucide-react'
import { TransitionLink } from './TransitionLink'
import { profile } from '../../data/profile'

interface ConceptBarProps {
  position?: 'left' | 'right'
}

/**
 * The only piece of the portfolio frame visible on a concept site: it tells
 * the visitor where they are and gets them back in one click.
 */
export function ConceptBar({ position = 'left' }: ConceptBarProps) {
  return (
    <div
      lang="cs"
      className={`concept-ui fixed bottom-3 z-[120] md:bottom-5 ${position === 'left' ? 'left-3 md:left-5' : 'right-3 md:right-5'}`}
    >
      <TransitionLink
        to="/#work"
        label="Vybrané práce"
        className="group flex h-9 items-center gap-2 rounded-full bg-[#111110]/90 pl-2 pr-3.5 text-[12px] font-medium tracking-[0.01em] text-[#F1EFEA] shadow-lg ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-[#111110]"
        aria-label={`Koncepční projekt — zpět na portfolio: ${profile.name}`}
      >
        <span className="grid size-6 place-items-center rounded-full bg-white/10 transition-transform duration-300 group-hover:-translate-x-0.5">
          <ArrowLeft size={13} aria-hidden="true" />
        </span>
        <span>
          Koncept · <span className="hidden sm:inline">{profile.name}</span>
          <span className="sm:hidden">{profile.name.split(' ')[0]}</span>
        </span>
      </TransitionLink>
    </div>
  )
}
