import { expect, test, type Page } from '@playwright/test'
import seo from '../src/data/seo.json' with { type: 'json' }

const routes = seo.routes.map((r) => r.path)
const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]
const allWidths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 2560]

/** Collects console errors, uncaught exceptions and failed same-origin/critical requests. */
function watch(page: Page) {
  const problems: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`)
  })
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`))
  page.on('requestfailed', (req) => {
    const failure = req.failure()?.errorText ?? ''
    // Lazy images cancelled by fast scrolling are not failures.
    if (failure.includes('ERR_ABORTED')) return
    problems.push(`requestfailed: ${req.url()} ${failure}`)
  })
  page.on('response', (res) => {
    if (res.status() >= 400 && new URL(res.url()).origin === 'http://localhost:4173') problems.push(`http ${res.status()}: ${res.url()}`)
  })
  return problems
}

/** Scroll the whole page so scroll-triggered content and lazy images load. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const step = Math.max(300, Math.floor((page.viewportSize()?.height ?? 800) * 0.8))
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(60)
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
}

/**
 * Text that runs past the viewport edge. Catches overflow hidden by
 * `overflow-x: clip` on the body, which the scrollWidth check cannot see.
 * Decorative (aria-hidden), marquee, scrollable and explicitly opted-out
 * regions are ignored.
 */
const clippedText = (page: Page) =>
  page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const allowed = (el: Element) =>
      el.closest('[aria-hidden="true"], .marquee, [data-overflow-ok], .concept-ui') !== null ||
      (() => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX
          if (o === 'auto' || o === 'scroll') return true
        }
        return false
      })()
    return [...document.querySelectorAll('h1, h2, h3, p, li, a, button, dt, dd, td, blockquote')]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && (r.right > vw + 1 || r.left < -1) && !allowed(el)
      })
      .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 40)}" right=${Math.round(el.getBoundingClientRect().right)} vw=${vw}`)
  })

const overflowX = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

for (const vp of viewports) {
  test.describe(`${vp.width}×${vp.height}`, () => {
    test.use({ viewport: vp })

    for (const path of routes) {
      test(`loads cleanly: ${path}`, async ({ page }) => {
        const problems = watch(page)
        const response = await page.goto(path, { waitUntil: 'networkidle' })
        expect(response?.status()).toBe(200)

        const entry = seo.routes.find((r) => r.path === path)!
        await expect(page).toHaveTitle(entry.title)
        await expect(page.locator('h1')).toHaveCount(1)

        await scrollThrough(page)
        expect(await overflowX(page)).toBeLessThanOrEqual(0)
        expect(problems).toEqual([])
      })
    }

    test('primary CTA is visible in the first viewport', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' })
      const cta = vp.width < 640 ? page.getByRole('link', { name: 'Chci nový web' }).first() : page.getByRole('banner').getByRole('link', { name: 'Chci nový web' })
      await expect(cta).toBeVisible()
      await expect(cta).toBeInViewport()
    })
  })
}

test.describe('horizontal overflow at every breakpoint', () => {
  for (const width of allWidths) {
    test(`no overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      for (const path of routes) {
        await page.goto(path, { waitUntil: 'networkidle' })
        await scrollThrough(page)
        await page.waitForTimeout(1200)
        expect(await overflowX(page), `${path} at ${width}px`).toBeLessThanOrEqual(0)
        expect(await clippedText(page), `${path} at ${width}px`).toEqual([])
      }
    })
  }
})

test('every concept project is linked from the homepage and opens', async ({ page }) => {
  // Phone width: cards are in normal flow there (on desktop they stack as sticky cards).
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'networkidle' })
  for (const path of routes.filter((p) => p !== '/')) {
    await expect(page.locator(`#work a[href="${path}"]`).first()).toBeAttached()
  }
  const first = page.getByRole('link', { name: /Zobrazit projekt\s*:\s*Aurelis/ })
  await first.scrollIntoViewIfNeeded()
  await first.click()
  await expect(page).toHaveURL(/\/portfolio\/aurelis$/)
  await expect(page).toHaveTitle(seo.routes[1].title)
  // Back to the portfolio through the concept bar.
  await page.getByRole('link', { name: /zpět na portfolio/i }).click()
  await expect(page).toHaveURL(/\/#work$/)
})

test('desktop navigation scrolls to sections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.getByRole('navigation', { name: 'Hlavní' }).getByRole('link', { name: 'Služby' }).click()
  await expect(page).toHaveURL(/#services$/)
  await expect(page.locator('#services')).toBeInViewport()
})

test('mobile menu opens, traps focus, closes on navigation and Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/', { waitUntil: 'networkidle' })
  const toggle = page.locator('button[aria-controls="mobile-menu"]')
  await toggle.click()
  const dialog = page.getByRole('dialog', { name: 'Menu' })
  await expect(dialog).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await dialog.getByRole('link', { name: /Proces/ }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/#process$/)

  // The header hides while scrolling down and returns on scroll up.
  await page.mouse.wheel(0, -300)
  await toggle.click()
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('every route survives a hard refresh (no SPA fallback)', async ({ page }) => {
  for (const path of routes) {
    const res = await page.goto(path)
    expect(res?.status(), path).toBe(200)
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page).toHaveTitle(seo.routes.find((r) => r.path === path)!.title)
  }
})

test('prerendered HTML carries per-route SEO metadata', async ({ request }) => {
  for (const route of seo.routes) {
    const html = await (await request.get(route.path)).text()
    expect(html).toContain(`<title>${route.title.replace(/&/g, '&amp;')}</title>`)
    expect(html).toContain(`name="description" content="${route.description.replace(/&/g, '&amp;')}"`)
    expect(html).toMatch(/property="og:title"/)
    expect(html).toMatch(/rel="canonical"/)
    expect(html).toContain(`<html lang="${route.lang}">`)
  }
})

test('unknown URLs return a real 404 page', async ({ page }) => {
  const res = await page.goto('/this-does-not-exist', { waitUntil: 'networkidle' })
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tady nic')
  await expect(page.getByRole('link', { name: /Zpět na portfolio/ })).toBeVisible()
})

test('demo-only actions explain themselves and lead to contact', async ({ page }) => {
  await page.goto('/portfolio/aurelis', { waitUntil: 'networkidle' })
  const button = page.getByRole('button', { name: 'Request the complete portfolio' })
  await button.scrollIntoViewIfNeeded()
  await button.click()
  const status = page.getByRole('status')
  await expect(status).toContainText('v tomto konceptu vypnuté')
  await status.getByRole('link', { name: /Chci nový web/ }).click()
  await expect(page).toHaveURL(/\/#contact$/)
})

test('contact builds a pre-filled mailto brief', async ({ page }) => {
  await page.goto('/#contact', { waitUntil: 'networkidle' })
  await page.getByText('Landing page', { exact: true }).click()
  await page.getByText('Za 1–3 měsíce', { exact: true }).click()
  const href = await page.locator('#contact a[href^="mailto:"]').first().getAttribute('href')
  expect(href).toContain(encodeURIComponent('Nový projekt: Landing page'))
  expect(href).toContain(encodeURIComponent('Termín: Za 1–3 měsíce'))
})

test('content is fully visible with reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  for (const path of routes) {
    await page.goto(path, { waitUntil: 'networkidle' })
    await expect(page.locator('h1')).toBeVisible()
  }
  await context.close()
})

test('keyboard users get a skip link and visible focus', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Přeskočit na obsah' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport()
})

test('content is visible before any JavaScript has loaded', async ({ page }) => {
  // A slow phone connection paints the pre-rendered HTML long before the bundle arrives.
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('**/*.js', (route) => route.abort())
  for (const path of routes) {
    await page.goto(path, { waitUntil: 'load' })
    await page.waitForTimeout(2500)
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('h1, h2, h3, p, li, img')]
        .filter((el) => {
          if (!el.getBoundingClientRect().height) return false
          for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
            const cs = getComputedStyle(n)
            if (cs.opacity === '0' || cs.clipPath.includes('inset(100%')) return true
          }
          return false
        })
        .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 40)}"`),
    )
    expect(hidden, path).toEqual([])
  }
})

test('FAQ items toggle independently on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'networkidle' })
  const buttons = page.locator('button[aria-controls*="-panel-"]')
  const third = buttons.nth(2)
  await third.scrollIntoViewIfNeeded()
  const before = (await third.boundingBox())!.y
  await third.click()
  await expect(third).toHaveAttribute('aria-expanded', 'true')
  // The first answer stays open, so the tapped question does not move.
  await expect(buttons.first()).toHaveAttribute('aria-expanded', 'true')
  await page.waitForTimeout(700)
  expect(Math.abs((await third.boundingBox())!.y - before)).toBeLessThan(2)
  await third.click()
  await expect(third).toHaveAttribute('aria-expanded', 'false')
})
