import { tieAll } from '../lib/czech'

export interface ConceptProject {
  slug: string
  name: string
  sector: string
  summary: string
  focus: string[]
  /** Colours used for the case-study card and the page transition. */
  theme: { bg: string; fg: string; muted: string; accent: string }
  /** Short description of the visual system, shown on the card. */
  system: { type: string; palette: string[]; motion: string }
}

export const projects: ConceptProject[] = tieAll([
  {
    slug: 'aurelis',
    name: 'Aurelis',
    sector: 'Architektura a development',
    summary:
      'Editoriální web pro architektonické studio, které prodává zdrženlivostí. Velké patkové písmo, pomalé odhalování a fotografie, které mají prostor dýchat.',
    focus: ['Editoriální layout', 'Patková typografie', 'Pomalý, filmový pohyb'],
    theme: { bg: '#ECE9E3', fg: '#1D1C1A', muted: '#5E5950', accent: '#8A7F6C' },
    system: { type: 'Cormorant Garamond / Jost', palette: ['#ECE9E3', '#1D1C1A', '#8A7F6C'], motion: 'Pomalé odhalování' },
  },
  {
    slug: 'noir',
    name: 'Noir',
    sector: 'Moderní gastronomie',
    summary:
      'Noční, filmový zážitek pro restauraci s degustačním menu. Celý web je choreografie s jediným cílem: rezervací.',
    focus: ['Filmový parallax', 'Systém menu', 'Rezervace'],
    theme: { bg: '#0B0A09', fg: '#F3EDE3', muted: '#8B8378', accent: '#C9A45C' },
    system: { type: 'Bodoni Moda / Manrope', palette: ['#0B0A09', '#F3EDE3', '#C9A45C'], motion: 'Parallax a atmosféra' },
  },
  {
    slug: 'nexora',
    name: 'Nexora',
    sector: 'AI infrastruktura',
    summary:
      'SaaS web pro AI startup připravený na launch: produktové rozhraní, které působí živě, vizualizace dat a ceník, který odpoví na otázky dřív, než musí obchod.',
    focus: ['Produktový příběh', 'Vizualizace dat', 'Ceník a konverze'],
    theme: { bg: '#05060B', fg: '#E8EAF2', muted: '#8A90A6', accent: '#7C5CFF' },
    system: { type: 'Space Grotesk / JetBrains Mono', palette: ['#05060B', '#7C5CFF', '#22D3EE'], motion: 'Datový, zářivý' },
  },
  {
    slug: 'form-object',
    name: 'Form / Object',
    sector: 'Kreativní studio',
    summary:
      'Web studia, který se chová jako jeho práce — hlasitý, asymetrický, trochu nezkrotný — a přesto každý odkaz vede přesně tam, kam čekáte.',
    focus: ['Experimentální layout', 'Práce s kurzorem', 'Brutalistní typografie'],
    theme: { bg: '#2B2BFF', fg: '#E9E7E1', muted: '#DCDBFF', accent: '#E9E7E1' },
    system: { type: 'Archivo Expanded / Plex Mono', palette: ['#E9E7E1', '#0A0A0A', '#2B2BFF'], motion: 'Svižný, řízený kurzorem' },
  },
  {
    slug: 'alex-morgan',
    name: 'Alex Morgan',
    sector: 'Strategie a poradenství',
    summary:
      'Osobní značka ve švýcarském gridu pro nezávislého poradce vedení firem. Nic dekorativního. Všechno slouží důvěryhodnosti.',
    focus: ['Švýcarská typografie', 'Osobní značka', 'Hierarchie obsahu'],
    theme: { bg: '#FFFFFF', fg: '#111111', muted: '#6E6E6E', accent: '#E4002B' },
    system: { type: 'Inter', palette: ['#FFFFFF', '#111111', '#E4002B'], motion: 'Minimální, přesný' },
  },
])

export const screenshot = (slug: string, size: 800 | 1600 = 1600) => `${import.meta.env.BASE_URL}work/${slug}${size === 800 ? '-800' : ''}.jpg`
