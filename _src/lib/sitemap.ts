import globby from 'globby'

const PAGES_DIR = 'src/pages'
const DATA_DIR = '_data'

export const generateSitemap = async (): Promise<string> => {
  const pageFiles = await globby([
    `${PAGES_DIR}/**/*.tsx`,
    `${DATA_DIR}/**/*.mdx`,
    `!${PAGES_DIR}/_*.tsx`,
    `!${DATA_DIR}/misc/*.mdx`,
  ])

  const pages = pageFiles
    .map(pageFile =>
      pageFile.replace(PAGES_DIR, '').replace(DATA_DIR, '').replace('.tsx', '').replace('.mdx', '')
    )
    // Ignore dynamic route files
    .filter(page => !page.includes('['))

  const urls = pages
    .map(page => `<url><loc>https://soorria.com${page}</loc></url>`)
    .join('')
    .replace(/\s*/g, '')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return sitemap
}
