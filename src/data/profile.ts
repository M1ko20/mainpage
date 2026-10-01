/**
 * The single source of truth for everything personal on the site.
 *
 * Only fill in what is true. Every optional field that is left empty
 * (empty string / empty array) is hidden from the UI automatically —
 * no section renders placeholder text.
 */

export interface SocialLink {
  label: string
  href: string
}

export interface RealProject {
  name: string
  description: string
  url: string
  stack: string[]
}

export interface Stat {
  value: string
  label: string
}

export interface Testimonial {
  quote: string
  author: string
  role: string
}

export interface Profile {
  name: string
  /** Short role line used in the nav, footer and SEO. */
  role: string
  location: string
  email: string
  phone: string
  socials: SocialLink[]
  /** 1–3 sentences. Replaces the default About lead when filled. */
  intro: string
  /** Longer bio, one paragraph per entry. */
  bio: string[]
  stack: string[]
  experience: string[]
  projects: RealProject[]
  stats: Stat[]
  testimonials: Testimonial[]
}

export const profile: Profile = {
  name: 'Adam Mikoláš',
  role: 'Webdesignér a vývojář',
  location: '',
  email: 'adam.mikolas64@gmail.com',
  phone: '',
  socials: [],
  intro: '',
  bio: [],
  stack: [],
  experience: [],
  projects: [],
  stats: [],
  testimonials: [],
}

export const firstName = profile.name.split(' ')[0]
