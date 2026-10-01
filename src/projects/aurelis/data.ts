export const HERO = { photo: '1487958449943-2429e8be8625', alt: 'White angular facade of Hotel Lumen against a pale sky' }

export interface AurelisProject {
  name: string
  place: string
  year: string
  type: string
  photo: string
  alt: string
}

export const works: AurelisProject[] = [
  {
    name: 'Villa Serein',
    place: 'Lake Geneva, Switzerland',
    year: '2024',
    type: 'Private residence',
    photo: '1600585154340-be6161a56a0c',
    alt: 'Timber and glass villa glowing at dusk beneath a mature tree',
  },
  {
    name: 'Kaskáda Residences',
    place: 'Prague, Czech Republic',
    year: '2023',
    type: 'Residential, 84 units',
    photo: '1479839672679-a46483c0e7c8',
    alt: 'Stacked white residential volumes with deep-set balconies',
  },
  {
    name: 'The Ribbon',
    place: 'Rotterdam, Netherlands',
    year: '2022',
    type: 'Mixed-use tower',
    photo: '1518005020951-eccb494ad742',
    alt: 'Curving striped facade seen from below against a blue sky',
  },
  {
    name: 'Casa Alba',
    place: 'Comporta, Portugal',
    year: '2024',
    type: 'Private residence',
    photo: '1523217582562-09d0def993a6',
    alt: 'Whitewashed cubic house among pine trees',
  },
  {
    name: 'Atelier House',
    place: 'Brno, Czech Republic',
    year: '2021',
    type: 'Studio & home',
    photo: '1600566753190-17f0baa2a6c3',
    alt: 'House clad in charred timber and warm cedar boards',
  },
]

export const featured = {
  name: 'Hotel Lumen',
  facts: [
    ['Location', 'Lisbon, Portugal'],
    ['Programme', 'Hotel, 64 keys'],
    ['Area', '9,400 m²'],
    ['Completion', '2025'],
    ['Scope', 'Architecture, interiors, development'],
  ],
  images: [
    { photo: '1486718448742-163732cd1544', alt: 'Terracotta facade ribbons curving against the sky' },
    { photo: '1600607687939-ce8a6c25118c', alt: 'Suite interior with oak wall, pale stone and soft daylight' },
    { photo: '1502005229762-cf1b2da7c5d6', alt: 'Oak staircase rising through a double-height hall' },
  ],
}

export const principles = [
  {
    title: 'Light before form',
    body: 'Every project begins by tracing the sun across the site. Plans follow the light, never the other way round.',
  },
  {
    title: 'Material honesty',
    body: 'Stone that looks like stone, timber that ages like timber. Nothing is disguised, so nothing needs hiding in twenty years.',
  },
  {
    title: 'Built for the next owner',
    body: 'As developers we hold our buildings for decades. We design them for the people who will inherit them.',
  },
]

export const stats = [
  { value: 34, suffix: '', label: 'Buildings completed' },
  { value: 212, suffix: 'k m²', label: 'Designed and delivered' },
  { value: 17, suffix: '', label: 'Years in practice' },
  { value: 9, suffix: '', label: 'International awards' },
]

export const disciplines = [
  ['Architecture', 'From feasibility to the last detail drawing.'],
  ['Interiors', 'Rooms, furniture and light, designed as one.'],
  ['Development', 'We finance, build and hold our own projects.'],
  ['Masterplanning', 'Districts that stay walkable for a century.'],
]
