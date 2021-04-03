import * as playwright from 'playwright-aws-lambda'
import { NextApiHandler } from 'next'
import fs from 'fs'
import path from 'path'

const handler: NextApiHandler = async (req, res) => {
  const { category, title, base } = req.query

  if (
    typeof category !== 'string' ||
    (title && typeof title !== 'string') ||
    typeof base !== 'string'
  ) {
    return res.status(406).end()
  }

  // This doesn't work sometimes. Not sure why.
  // It says they node_modules/playwrite-core/browsers.json
  // does not exist?????
  //
  // For some reason it works when I have this try/catch thing.
  // Maybe it's the path.join / fs.readdir stuff

  try {
    const browser = await playwright.launchChromium()
    const page = await browser.newPage({
      viewport: {
        width: 1200,
        height: 600,
      },
    })

    const url = `${base}/og/${category}/${title ? encodeURIComponent(title) : ''}`

    await page.goto(url, { timeout: 15 * 1000 })
    const data = await page.screenshot({
      type: 'png',
    })
    await browser.close()

    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate')
    res.setHeader('Content-Type', 'image/png')

    res.end(data)
  } catch (err) {
    res.setHeader('Content-Type', 'image/png')
    const data = fs.readFileSync(path.join(process.cwd(), './public/og.png'))
    res.end(data)
  }
}

export default handler
