import { NextApiHandler } from 'next'

const pw = process.env.PREVIEW_PW

const handler: NextApiHandler = (req, res) => {
  if (req.method === 'POST') {
    if (req.body.pw === pw) {
      res.setPreviewData({})
      console.log(1)
    } else {
      res.clearPreviewData()
    }
  }

  res.end()
}

export default handler
