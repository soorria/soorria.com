import { expect, test } from '@playwright/test'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { emptyProjectRoutes, htmlRoutes, redirectContracts } from './contracts'

const contentRoutes = (type: 'blog' | 'snippets') =>
  readdirSync(join(process.cwd(), 'src', 'data', type), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => `/${type}/${entry.name}`)

for (const route of [...contentRoutes('blog'), ...contentRoutes('snippets')]) {
  test(`${route} builds and returns HTML`, async ({ request }) => {
    const response = await request.get(route)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/html')
  })
}

for (const route of htmlRoutes) {
  test(`${route} returns HTML`, async ({ request }) => {
    const response = await request.get(route)

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/html')
  })
}

for (const route of emptyProjectRoutes) {
  test(`${route} preserves the empty-project 404`, async ({ request }) => {
    const response = await request.get(route)

    expect(response.status()).toBe(404)
  })
}

for (const [source, destination, status] of redirectContracts) {
  test(`${source} redirects to ${destination}`, async ({ request, baseURL }) => {
    const response = await request.get(source, { maxRedirects: 0 })
    const location = response.headers().location

    expect(response.status()).toBe(status)
    expect(location).toBeTruthy()

    const actual = new URL(location!, baseURL)
    const expected = new URL(destination, baseURL)

    if (destination.startsWith('http')) {
      expect(actual.href).toBe(expected.href)
    } else {
      expect(`${actual.pathname}${actual.search}${actual.hash}`).toBe(
        `${expected.pathname}${expected.search}${expected.hash}`
      )
    }
  })
}

for (const route of ['/rss', '/rss.xml', '/atom', '/atom.xml'] as const) {
  test(`${route} returns XML`, async ({ request }) => {
    const response = await request.get(route)

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')
  })
}

test('robots and sitemap remain public', async ({ request }) => {
  const [robots, sitemap] = await Promise.all([
    request.get('/robots.txt'),
    request.get('/sitemap.xml'),
  ])

  expect(robots.status()).toBe(200)
  expect(await robots.text()).toContain('Disallow: /')
  expect(sitemap.status()).toBe(200)
  expect(sitemap.headers()['content-type']).toContain('xml')
})

test('the OG endpoint returns a PNG', async ({ request }) => {
  const response = await request.get('/api/og?title=Migration%20Baseline&subtitle=soorria.com')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('image/png')
  expect((await response.body()).byteLength).toBeGreaterThan(1_000)
})

for (const userAgent of ['curl/8.7.1', 'HTTPie/3.2.4'] as const) {
  test(`${userAgent} receives the command-line card`, async ({ request }) => {
    const response = await request.get('/', {
      headers: { 'user-agent': userAgent },
    })

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/plain')
    expect(await response.text()).toContain('Soorria Saruva')
  })

  test(`${userAgent} with a card query receives HTML`, async ({ request }) => {
    const response = await request.get('/?card=nah', {
      headers: { 'user-agent': userAgent },
    })

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/html')
  })
}

test('dynamic pages retain their CDN cache contract', async ({ request }) => {
  for (const route of ['/', '/links', '/authentic-artistique-endevours']) {
    const response = await request.get(route)
    expect(response.headers()['cache-control']).toBe('s-maxage=10, stale-while-revalidate')
  }
})

test('the links subdomain rewrites the homepage and preserves exclusions', async ({ request }) => {
  const links = await request.get('/', { headers: { host: 'links.soorria.com' } })
  expect(await links.text()).toContain('the rest of my website')

  const secrets = await request.get('/secrets', { headers: { host: 'links.soorria.com' } })
  expect(await secrets.text()).toContain('Secret Stuff')
})

test('metadata and the self-hosted analytics contract are present', async ({ page }) => {
  await page.goto('/blog/event-delegation')
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    /Event Delegation/
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image'
  )
  await expect(page.locator('script[src="/potato/js/script.js"]')).toHaveCount(1)
  await expect(page.locator('script[data-api="/potato/api/event"]')).toHaveCount(1)
})

test('the art page retains request-time NFT variability', async ({ request }) => {
  const titles = new Set<string>()
  for (let index = 0; index < 6; index += 1) {
    const response = await request.get('/authentic-artistique-endevours')
    const match = (await response.text()).match(/<abbr[^>]+title="([^"]+)"/)
    expect(match?.[1]).toBeTruthy()
    titles.add(match![1])
  }
  expect(titles.size).toBeGreaterThan(1)
})

test('core pages have no broken internal links', async ({ page, request, baseURL }) => {
  const hrefs = new Set<string>()
  for (const route of ['/', '/blog', '/snippets', '/projects', '/about']) {
    await page.goto(route)
    for (const href of await page
      .locator('a[href]')
      .evaluateAll(anchors =>
        anchors
          .map(anchor => anchor.getAttribute('href'))
          .filter((href): href is string => Boolean(href))
      )) {
      const url = new URL(href, baseURL)
      if (url.origin === new URL(baseURL!).origin && !url.pathname.startsWith('/potato')) {
        hrefs.add(`${url.pathname}${url.search}`)
      }
    }
  }

  for (const href of hrefs) {
    const response = await request.get(href, { maxRedirects: 0 })
    expect(response.status(), href).toBeLessThan(400)
  }
})

test('the site remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/blog/event-delegation')
  await expect(page.getByRole('heading', { name: 'Event Delegation', level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'What and Why', level: 2 })).toBeVisible()
  await context.close()
})

test('the website client attempts its PartySocket connection', async ({ page }) => {
  const partySocket = page.waitForEvent('websocket', {
    predicate: socket => socket.url().includes('soorria-website.soorria.partykit.dev'),
    timeout: 15_000,
  })
  await page.goto('/')
  const skillsHeading = page.getByRole('heading', {
    name: /Technical Skills|What I've Learned|Tools I Use/,
  })
  await skillsHeading.scrollIntoViewIfNeeded()
  await expect(skillsHeading).toBeVisible()
  await expect(partySocket.then(socket => socket.url())).resolves.toContain(
    'soorria-website.soorria.partykit.dev'
  )
})
