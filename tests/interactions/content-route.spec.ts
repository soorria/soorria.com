import { expect, test } from '@playwright/test'

test.describe('migrated blog content route', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/event-delegation')
  })

  test('renders the shared shell, metadata, metrics, and MDX content', async ({ page }) => {
    await expect(page).toHaveTitle('Event Delegation | Blog • Soorria Saruva')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://soorria.com/posts/event-delegation'
    )
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Event Delegation', level: 1 })).toBeVisible()
    await expect(page.getByLabel('Reading time')).toContainText('5 min read')
    await expect(page.getByLabel('Word count')).toContainText('~868 words')
    await expect(page.getByRole('heading', { name: 'What and Why', level: 2 })).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  test('hydrates the MDX demo through its serializable registry ID', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Click me!' })
    await expect(button).toBeVisible()

    const island = page.locator('astro-island').filter({ has: button })
    await expect(island).not.toHaveAttribute('ssr', '')
    await button.click()
    await expect(button.getByText('Clicked!')).toBeVisible()

    const reload = page.getByRole('button', { name: 'Reload Demo' })
    await reload.click()
    await expect(reload.locator('svg')).toHaveAttribute('style', /rotate\(-360deg\)/)
  })

  test('switches generated TypeScript code blocks to JavaScript', async ({ page }) => {
    const switcher = page.locator('[data-ts-js-switcher]').first()
    await expect(switcher.locator("pre[data-language='ts']")).toBeVisible()
    await expect(switcher.locator("pre[data-language='js']")).toBeHidden()

    await switcher.getByRole('button', { name: 'switch to js' }).click()

    await expect(switcher).toHaveClass(/show-js/)
    await expect(switcher.locator("pre[data-language='ts']")).toBeHidden()
    await expect(switcher.locator("pre[data-language='js']")).toBeVisible()
  })

  test('slides the switcher copy button from copy to copied', async ({ page }) => {
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async () => {} },
      })
    })

    const button = page.locator('[data-copy-switcher]').first()
    const copyLabel = button.locator('[data-copy-label]')
    const copiedLabel = button.locator('[data-copied-label]')

    await expect(copyLabel).toHaveText('copy')
    await expect(copiedLabel).toHaveText('copied')
    await button.click()
    await expect(button).toHaveAttribute('data-copy-state', 'copied')
    await expect
      .poll(() => copyLabel.evaluate(element => getComputedStyle(element).transform))
      .not.toBe('none')
    await expect
      .poll(() => copiedLabel.evaluate(element => getComputedStyle(element).transform))
      .toBe('none')
  })

  test('slides a standard code-block copy button from copy to copied', async ({ page }) => {
    await page.goto('/blog/immer')
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async () => {} },
      })
    })

    const codeBlock = page.locator('.code-block').first()
    await expect(codeBlock).toHaveClass(/ring-drac-purple/)
    await expect(codeBlock).toHaveClass(/bg-drac-base/)

    const button = codeBlock.locator('[data-copy-code]')
    const copyLabel = button.locator('[data-copy-label]')
    const copiedLabel = button.locator('[data-copied-label]')

    await button.click()
    await expect(button).toHaveAttribute('data-copy-state', 'copied')
    await expect
      .poll(() => copyLabel.evaluate(element => getComputedStyle(element).transform))
      .not.toBe('none')
    await expect
      .poll(() => copiedLabel.evaluate(element => getComputedStyle(element).transform))
      .toBe('none')
  })

  test('keeps browser-only comments out of the prerender pass', async ({ page }) => {
    const commentsIsland = page.locator('astro-island[client="only"]')
    await expect(commentsIsland).toHaveCount(1)
    await expect(commentsIsland).toHaveAttribute('component-export', 'default')
  })
})
