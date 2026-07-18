import { expect, test } from '@playwright/test'
import { renderRuntimeMarkdown } from '../../src/lib/runtime-markdown'

test('renders an existing MDX article through Astro', async ({ page }) => {
  await page.goto('/blog/react-vs-the-dom')

  await expect(page.getByText(/forcing inputs’ values to match their/i)).toBeVisible()
})

test('hydrates a React demo selected by a serializable ID', async ({ page }) => {
  await page.goto('/blog/event-delegation')

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
  await page.goto('/snippets/create-previous-memo')

  const increment = page.getByRole('button', { name: 'Increment' })
  await expect(increment).toBeVisible({ timeout: 15_000 })
  await increment.click()

  await expect(page.getByText('Current:').locator('..')).toContainText('1')
})

test('renders trusted request-time MDX while blocking dangerous expressions', async () => {
  const source = '**Fresh** copy <script>window.pwned = true</script> {globalThis.location}'
  const html = await renderRuntimeMarkdown(source)

  expect(html).toContain('<strong>Fresh</strong>')
  expect(html).not.toContain('<script>')
  expect(html).toContain('window.pwned = true')
  expect(html).toContain('{globalThis.location}')

  const trustedCmsStyle = await renderRuntimeMarkdown(
    "Building the <span style={{ color: 'var(--purple)' }}>AI workforce</span>"
  )
  expect(trustedCmsStyle).toContain('<span style="color:var(--purple)">AI workforce</span>')

  const sparkles = await renderRuntimeMarkdown('Building <Sparkles>delightful things</Sparkles>')
  expect(sparkles).toContain('data-runtime-sparkles')
  expect(sparkles).toContain('delightful things')
})

test('renders a PNG with Satori, Resvg, and a local font', async ({ request }) => {
  const response = await request.get('/api/og?title=Astro%20OG')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('image/png')
  expect((await response.body()).byteLength).toBeGreaterThan(1_000)
})
