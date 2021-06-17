import { NextApiHandler } from 'next'
import core from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'
import fs from 'fs'
import path from 'path'

const handler: NextApiHandler = async (req, res) => {
  const { category, title, base: _base } = req.query
  const base = typeof _base === 'string' && _base ? _base : 'https://mooth.tech'
  try {
    if (typeof category !== 'string' || (title && typeof title !== 'string')) {
      throw new Error('Invalid query')
    }

    const browser = await core.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    })

    const page = await browser.newPage()

    page.setViewport({
      width: 1200,
      height: 630,
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
    console.log('og image -', err)
    res.setHeader('Content-Type', 'image/png')
    let data
    try {
      data = fs.readFileSync(path.join(process.cwd(), './public/og.png'))
    } catch (err) {
      const response = await fetch('https://mooth.tech/og.png')
      data = await (response as any).buffer()
    }
    res.end(data)
  }
}

export default handler
