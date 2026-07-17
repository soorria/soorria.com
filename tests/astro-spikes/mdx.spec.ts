import { expect, test } from '@playwright/test'

test('renders an existing MDX article through Astro', async ({ page }) => {
  await page.goto('/spikes/mdx')

  await expect(page.getByRole('heading', { name: 'Existing article' })).toBeVisible()
  await expect(page.getByText(/forcing inputs’ values to match their/i)).toBeVisible()
})

test('hydrates a React demo selected by a serializable ID', async ({ page }) => {
  await page.goto('/spikes/mdx')

  const demoHeading = page.getByRole('heading', { name: 'Serializable React demo registry' })
  await demoHeading.scrollIntoViewIfNeeded()

  const button = page.getByRole('button', { name: /Click me!/i })
  await expect(button).toBeVisible()
  const island = page.locator('astro-island').filter({ has: button })
  await expect(island).not.toHaveAttribute('ssr', '')
  await button.click()

  const reload = page.getByRole('button', { name: 'Reload Demo' }).first()
  await reload.click()
  await expect(reload.locator('svg')).toHaveAttribute('style', /rotate\(-360deg\)/)
})

test('hydrates a Solid demo selected by a serializable ID', async ({ page }) => {
  await page.goto('/spikes/mdx')

  const demoHeading = page.getByRole('heading', { name: 'Serializable Solid demo registry' })
  await demoHeading.scrollIntoViewIfNeeded()

  const increment = page.getByRole('button', { name: 'Increment' })
  await expect(increment).toBeVisible({ timeout: 15_000 })
  await increment.click()

  await expect(page.getByText('Current:').locator('..')).toContainText('1')
})

test('renders request-time Markdown without evaluating HTML or MDX', async ({ page }) => {
  const source = '**Fresh** copy <script>window.pwned = true</script> {globalThis.location}'
  await page.goto(`/spikes/runtime-markdown?source=${encodeURIComponent(source)}`)

  const runtimeContent = page.locator('[data-runtime-markdown]')
  await expect(runtimeContent.getByText('Fresh')).toHaveCount(1)
  await expect(runtimeContent.locator('strong')).toHaveText('Fresh')
  await expect(runtimeContent.locator('script')).toHaveCount(0)
  await expect(runtimeContent).toContainText('window.pwned = true')
  await expect(runtimeContent).toContainText('{globalThis.location}')
  expect(await page.evaluate(() => 'pwned' in window)).toBe(false)
})

test('renders a PNG with Satori, Resvg, and a local font', async ({ request }) => {
  const response = await request.get('/spikes/og.png?title=Astro%20OG%20spike')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('image/png')
  expect((await response.body()).byteLength).toBeGreaterThan(1_000)
})
