// Captures the concept sites for the homepage case studies and share images.
// Expects the site to be running (default http://localhost:4173, override with BASE).
//
//   public/work/<slug>.jpg      1600×1000  case-study image
//   public/work/<slug>-800.jpg   800×500   small variant for srcset
//   public/work/og-<slug>.jpg   1200×630   Open Graph image (og-home.jpg for /)

import { chromium } from 'playwright'
import { mkdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public/work')
const base = process.env.BASE || 'http://localhost:4173'
const seo = JSON.parse(await readFile(join(root, 'src/data/seo.json'), 'utf8'))
await mkdir(out, { recursive: true })

const hideChrome = '.concept-ui { display: none !important; }'

async function shoot(browser, path, { width, height, scale, file }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale })
  await page.goto(base + path, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: hideChrome })
  await page.waitForTimeout(4200)
  await page.screenshot({ path: join(out, file), type: 'jpeg', quality: 82 })
  await page.close()
}

const browser = await chromium.launch()
for (const route of seo.routes) {
  const slug = route.path === '/' ? 'home' : route.path.split('/').pop()
  if (slug !== 'home') {
    await shoot(browser, route.path, { width: 1440, height: 900, scale: 1600 / 1440, file: `${slug}.jpg` })
    await shoot(browser, route.path, { width: 1440, height: 900, scale: 800 / 1440, file: `${slug}-800.jpg` })
  }
  await shoot(browser, route.path, { width: 1200, height: 630, scale: 1, file: `og-${slug}.jpg` })
  console.log(`captured ${route.path}`)
}
await browser.close()
