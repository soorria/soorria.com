import { readFile } from 'node:fs/promises'
import { createElement } from 'react'

import type { APIRoute } from 'astro'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

export const prerender = false

const WIDTH = 1200
const HEIGHT = 630
const font = readFile(new URL('../../../public/fonts/poppins-regular.ttf', import.meta.url))

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get('title') ?? 'Astro migration spike'
  const fontData = await font
  const svg = await satori(
    createElement(
      'div',
      {
        style: {
          alignItems: 'center',
          background: '#282a36',
          color: '#f8f8f2',
          display: 'flex',
          fontFamily: 'Poppins',
          fontSize: 64,
          height: '100%',
          justifyContent: 'center',
          padding: 80,
          textAlign: 'center',
          width: '100%',
        },
      },
      title
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: 'Poppins', data: fontData, weight: 400, style: 'normal' }],
    }
  )
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  })
    .render()
    .asPng()

  return new Response(new Uint8Array(png), {
    headers: {
      'Cache-Control': 'public, max-age=60',
      'Content-Type': 'image/png',
    },
  })
}
