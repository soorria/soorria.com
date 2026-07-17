import { expect, test } from '@playwright/test'
import { emptyProjectRoutes, htmlRoutes, redirectContracts } from './contracts'

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
