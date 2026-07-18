import { expect, test } from '@playwright/test'

test.describe('migrated landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('preserves the layered hero and reveals animated content', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero).toHaveCSS('background-image', /svg|circuit/i)
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(hero.locator('p[aria-hidden="true"]')).toHaveCount(2)

    await page.waitForTimeout(2_500)
    const animatedElements = page.locator('.slide-in-direct, .slide-in > *')
    const opacity = await animatedElements.evaluateAll(elements =>
      elements.map(element => Number.parseFloat(getComputedStyle(element).opacity))
    )
    expect(opacity.every(value => value > 0.99)).toBe(true)
  })

  test('cycles the server-rendered subtitle without a React island', async ({ page }) => {
    const subtitle = page.locator('[data-subtitle]')
    const before = await subtitle.innerHTML()

    await page.getByRole('button', { name: 'refresh subtitle about me' }).click()

    await expect.poll(() => subtitle.innerHTML()).not.toBe(before)
    await expect(page.locator('[data-subtitle-icon]')).toHaveAttribute('style', /rotate: -1turn/)
  })

  test('animates Sparkles components rendered from runtime MDX', async ({ page }) => {
    await page.locator('[data-subtitle]').evaluate(element => {
      element.innerHTML =
        '<span class="relative inline-block" data-runtime-sparkles><span class="relative">sparkly</span></span>'
    })

    await expect(page.locator('[data-runtime-sparkles] .animation-sparkle')).toBeAttached({
      timeout: 2_000,
    })
  })
})
