import globby from 'globby'

const DATA_DIR = '_data'

export const generateSitemap = async (): Promise<string> => {
  const pageFiles = await globby([
    'src/pages/**/*.tsx',
    `${DATA_DIR}/**/*.mdx`,
    '!src/pages/_*.tsx',
    `!${DATA_DIR}/misc/*.mdx`,
  ])

  const pages = pageFiles
    .map(pageFile =>
      pageFile.replace('src/pages', '').replace('_data', '').replace('.tsx', '').replace('.mdx', '')
    )
    // Ignore dynamic route files
    .filter(page => !page.includes('['))

  const urls = pages
    .map(page => `<url><loc>https://mooth.tech${page}</loc></url>`)
    .join('')
    .replace(/\s*/g, '')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return sitemap
}
