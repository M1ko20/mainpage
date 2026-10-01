import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import seo from '../src/data/seo.json' with { type: 'json' }

for (const { path } of seo.routes) {
  test(`no WCAG 2.1 AA violations: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path, { waitUntil: 'networkidle' })
    // Let every in-view fade finish so contrast is measured on final colours.
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
      await page.waitForTimeout(150)
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(2500)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // [data-blend]: text rendered with mix-blend-mode: difference. axe cannot compute blended
      // colours and reports white-on-background; the rendered result is inverted, high-contrast text.
      // [data-decorative]: aria-hidden display wordmarks that carry no information (WCAG 1.4.3 exempts decoration).
      .exclude('[data-blend]')
      .exclude('[data-decorative]')
      .analyze()
    const summary = results.violations.flatMap((v) =>
      v.nodes.map((n) => `${v.id}: ${n.target.join(' ')} — ${(n.any[0]?.message ?? n.failureSummary ?? '').split('\n')[0].slice(0, 140)}`),
    )
    expect(summary).toEqual([])
  })
}
