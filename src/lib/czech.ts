const NBSP = '\u00a0'

/**
 * Czech typography: a one-letter preposition or conjunction (k, s, v, z, o, u, a, i)
 * must not end a line, and a dash must not start one — both get a no-break space.
 */
export const tie = (text: string) =>
  text.replace(/(?<=^|[\s(„])([kosuvzaiKOSUVZAI]) /g, `$1${NBSP}`).replace(/ ([—–]) /g, `${NBSP}$1 `)

/** Applies `tie` to every string in a data structure. */
export function tieAll<T>(value: T): T {
  if (typeof value === 'string') return tie(value) as T
  if (Array.isArray(value)) return value.map(tieAll) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, tieAll(v)])) as T
  }
  return value
}
