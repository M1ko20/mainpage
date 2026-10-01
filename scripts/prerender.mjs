// Post-build step: turn the client build into a fully static site.
//
// For every route it writes a real HTML file containing
//   - the page itself, rendered with React (so content paints before any JS),
//   - its own <title>, description, Open Graph / Twitter tags and canonical URL,
//   - <link>s to the route's own lazy CSS/JS chunks, so nothing flashes unstyled.
// It also writes 404.html, robots.txt and (when the site URL is known) sitemap.xml.
//
// Every route therefore exists as a static file on Netlify: direct visits and
// refreshes work without a SPA rewrite, share previews are correct per page,
// and unknown URLs get a genuine 404 status.
//
// The absolute site URL comes from SITE_URL, or Netlify's built-in URL
// variable during Netlify builds. Without either, URLs stay relative.
// BASE_PATH (e.g. /mainpage on GitHub Pages) is the sub-path the site is
// served from; SITE_URL then includes it.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const seo = JSON.parse(await readFile(join(root, 'src/data/seo.json'), 'utf8'))
const manifest = JSON.parse(await readFile(join(dist, '.vite/manifest.json'), 'utf8'))
const template = await readFile(join(dist, 'index.html'), 'utf8')
const { render } = await import(pathToFileURL(join(root, 'dist-server/entry-server.js')).href)
const siteUrl = (process.env.SITE_URL || process.env.URL || '').replace(/\/$/, '')

const escape = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const base = (process.env.BASE_PATH ?? '').replace(/^\/|\/$/g, '').replace(/^(?=.)/, '/')

const absolute = (path) => (siteUrl || base) + path

function setAttr(html, selector, attr, value) {
  // selector is e.g. 'meta[name="description"]' → matches <meta name="description" ... content="…" />
  const [, tag, key, keyValue] = selector.match(/^(\w+)\[(\w+(?::\w+)?)="([^"]+)"\]$/)
  const pattern = new RegExp(`(<${tag}\\s+[^>]*${key}="${keyValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*\\s${attr}=")[^"]*(")`)
  if (!pattern.test(html)) throw new Error(`prerender: could not find ${selector} in dist/index.html`)
  return html.replace(pattern, `$1${escape(value)}$2`)
}

/** CSS and JS files of a lazily loaded source module, following its static imports. */
function chunkAssets(source) {
  const css = new Set()
  const js = new Set()
  const visit = (key) => {
    const chunk = manifest[key]
    if (!chunk || chunk.isEntry) return
    if (js.has(chunk.file)) return
    js.add(chunk.file)
    chunk.css?.forEach((file) => css.add(file))
    chunk.imports?.forEach(visit)
  }
  visit(source)
  return { css: [...css], js: [...js] }
}

const routeModule = (path) => {
  if (path === '/') return null
  const prefix = path === '/404' ? 'src/pages/NotFound' : `src/projects${path.replace('/portfolio', '')}/`
  return Object.keys(manifest).find((key) => key.startsWith(prefix) && manifest[key].isDynamicEntry) ?? null
}

async function page({ lang, title, description, path, image, themeColor, noindex = false }) {
  let html = template.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)

  // The portfolio's own fonts are preloaded only where they are used above the fold.
  if (path !== '/') html = html.replace(/\s*<link[^>]*data-home-only[^>]*>/g, '')

  const module = routeModule(path)
  if (module) {
    const { css, js } = chunkAssets(module)
    const links = [
      ...css.map((file) => `<link rel="stylesheet" crossorigin href="${base}/${file}">`),
      ...js.map((file) => `<link rel="modulepreload" crossorigin href="${base}/${file}">`),
    ]
    html = html.replace('</head>', `  ${links.join('\n    ')}\n  </head>`)
  }

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  html = setAttr(html, 'meta[name="description"]', 'content', description)
  html = setAttr(html, 'meta[property="og:title"]', 'content', title)
  html = setAttr(html, 'meta[property="og:description"]', 'content', description)
  html = setAttr(html, 'meta[name="twitter:title"]', 'content', title)
  html = setAttr(html, 'meta[name="twitter:description"]', 'content', description)
  if (image) {
    html = setAttr(html, 'meta[property="og:image"]', 'content', absolute(image))
    html = setAttr(html, 'meta[name="twitter:image"]', 'content', absolute(image))
  }
  if (themeColor) html = setAttr(html, 'meta[name="theme-color"]', 'content', themeColor)
  if (noindex) {
    html = html.replace(/\s*<link rel="canonical"[^>]*>/, '').replace(/\s*<meta property="og:url"[^>]*>/, '')
    html = html.replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
  } else {
    html = setAttr(html, 'link[rel="canonical"]', 'href', absolute(path))
    html = setAttr(html, 'meta[property="og:url"]', 'content', absolute(path))
  }
  if (lang !== 'cs') html = setAttr(html, 'meta[property="og:locale"]', 'content', 'en_US')

  const body = await render(path === '/404' ? '/__not-found__' : path)
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

for (const route of seo.routes) {
  const file = route.path === '/' ? join(dist, 'index.html') : join(dist, route.path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, await page(route))
}

await writeFile(join(dist, '404.html'), await page({ ...seo.notFound, path: '/404', noindex: true }))

const robots = ['User-agent: *', 'Allow: /', siteUrl && `Sitemap: ${siteUrl}/sitemap.xml`].filter(Boolean).join('\n')
await writeFile(join(dist, 'robots.txt'), robots + '\n')

if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = seo.routes
    .map((r) => `  <url><loc>${siteUrl}${r.path}</loc><lastmod>${today}</lastmod><priority>${r.path === '/' ? '1.0' : '0.8'}</priority></url>`)
    .join('\n')
  await writeFile(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
}

// Build-only artefacts must not be published.
await rm(join(dist, '.vite'), { recursive: true, force: true })
await rm(join(root, 'dist-server'), { recursive: true, force: true })

console.log(
  `prerender: ${seo.routes.length} routes + 404 rendered${siteUrl ? ` (site: ${siteUrl}, sitemap written)` : ' (no SITE_URL — relative URLs, no sitemap)'}`,
)
