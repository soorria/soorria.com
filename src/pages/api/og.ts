import { NextApiHandler } from 'next'
import fs from 'fs'
import path from 'path'

const handler: NextApiHandler = async (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const playwright = require('playwright-aws-lambda')
    const { category, title, base: _base } = req.query
    const base = typeof _base === 'string' && _base ? _base : 'https://mooth.tech'

    if (typeof category !== 'string' || (title && typeof title !== 'string')) {
      throw 1
    }

    // This doesn't work sometimes. Not sure why.
    // It says they node_modules/playwrite-core/browsers.json
    // does not exist?????
    //
    // For some reason it works when I have this try/catch thing.
    // Maybe it's the path.join / fs.readdir stuff

    // // For some reason this fixes it. What the fuck
    // const fileThatDoesntExistSometimes = path.join(
    //   process.cwd(),
    //   './node_modules/playwright-core/browsers.json'
    // )
    // fs.readFileSync(fileThatDoesntExistSometimes)

    const browser = await playwright.launchChromium()
    const page = await browser.newPage({
      viewport: {
        width: 1200,
        height: 630,
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
    console.log(err)
    res.setHeader('Content-Type', 'image/png')
    let data
    try {
      data = fs.readFileSync(path.join(process.cwd(), './public/og.png'))
      console.log('READING OG IMAGE FROM DISK')
    } catch (err) {
      console.log('FETCHING OG IMAGE')
      const response = await fetch('https://mooth.tech/og.png')
      data = await (response as any).buffer()
    }
    res.end(data)
  }
}

export default handler
