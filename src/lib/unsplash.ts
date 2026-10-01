const BASE = 'https://images.unsplash.com/photo-'

export interface PhotoOptions {
  /** Height / width. When set, the image is cropped server-side to that ratio. */
  ratio?: number
  quality?: number
}

export function photoUrl(id: string, width: number, { ratio, quality = 72 }: PhotoOptions = {}): string {
  const params = new URLSearchParams({ auto: 'format', fit: 'crop', w: String(width), q: String(quality) })
  if (ratio) params.set('h', String(Math.round(width * ratio)))
  return `${BASE}${id}?${params.toString()}`
}

export function photoSrcSet(id: string, widths: readonly number[], options?: PhotoOptions): string {
  return widths.map((w) => `${photoUrl(id, w, options)} ${w}w`).join(', ')
}

export const DEFAULT_WIDTHS = [480, 800, 1200, 1800] as const
