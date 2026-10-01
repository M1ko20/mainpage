import { useEffect } from 'react'
import seo from '../data/seo.json'

interface SeoEntry {
  lang: string
  title: string
  description: string
  image?: string
  themeColor?: string
}

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Keeps <head> in sync during client-side navigation. The initial HTML for
 * every route is already correct (see scripts/prerender.mjs); this only
 * matters when moving between routes without a full page load.
 */
export function useSeo(path: string | null) {
  useEffect(() => {
    const entry: SeoEntry = (path && seo.routes.find((r) => r.path === path)) || seo.notFound
    const site = window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, '')
    const url = path ? site + path : window.location.origin + window.location.pathname
    document.documentElement.lang = entry.lang
    document.title = entry.title
    setMeta('meta[property="og:locale"]', 'content', entry.lang === 'cs' ? 'cs_CZ' : 'en_US')
    setMeta('meta[name="description"]', 'content', entry.description)
    setMeta('meta[property="og:title"]', 'content', entry.title)
    setMeta('meta[property="og:description"]', 'content', entry.description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[name="twitter:title"]', 'content', entry.title)
    setMeta('meta[name="twitter:description"]', 'content', entry.description)
    setMeta('link[rel="canonical"]', 'href', url)
    if (entry.image) {
      setMeta('meta[property="og:image"]', 'content', site + entry.image)
      setMeta('meta[name="twitter:image"]', 'content', site + entry.image)
    }
    if (entry.themeColor) setMeta('meta[name="theme-color"]', 'content', entry.themeColor)
  }, [path])
}
