import { readFile } from 'node:fs/promises'
import { createElement } from 'react'
import type { APIRoute } from 'astro'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

export const prerender = false
const WIDTH = 1200
const HEIGHT = 630
const regularFont = readFile(new URL('../../../public/fonts/poppins-regular.ttf', import.meta.url))
const boldFont = readFile(new URL('../../../public/fonts/poppins-bold.ttf', import.meta.url))

export const GET: APIRoute = async ({ url }) => {
  const titleParts = url.searchParams.getAll('titleParts').slice(0, 2)
  const title = titleParts.length ? titleParts.join('\n') : url.searchParams.get('title') || '404'
  const subtitle = url.searchParams.get('subtitle')
  const bottomText = url.searchParams.get('bottomText')
  const [regular, bold] = await Promise.all([regularFont, boldFont])
  const svg = await satori(
    createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          position: 'relative',
        },
      },
      createElement('div', {
        style: {
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #bd93f9 0 50%, #ff79c6 50% 100%)',
        },
      }),
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            padding: '36px 80px',
            minWidth: 600,
            maxWidth: 960,
            color: '#f8f8f2',
            borderRadius: 24,
            background: 'rgba(40,42,54,.82)',
          },
        },
        createElement(
          'div',
          {
            style: {
              fontFamily: 'PoppinsBold',
              fontSize: 60,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.2,
            },
          },
          title
        ),
        subtitle
          ? createElement(
              'div',
              { style: { fontFamily: 'PoppinsRegular', fontSize: 30 } },
              subtitle
            )
          : null
      ),
      bottomText
        ? createElement(
            'div',
            {
              style: {
                position: 'absolute',
                bottom: 16,
                fontFamily: 'PoppinsRegular',
                fontSize: 30,
                color: '#282a36',
              },
            },
            bottomText
          )
        : null
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'PoppinsRegular', data: regular, weight: 400, style: 'normal' },
        { name: 'PoppinsBold', data: bold, weight: 400, style: 'normal' },
      ],
      debug: url.searchParams.has('debug'),
    }
  )
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng()
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=0, s-maxage=31536000, immutable',
    },
  })
}
