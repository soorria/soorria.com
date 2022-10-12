import { ImageResponse } from '@vercel/og'
import type { PageConfig } from 'next'
import type { NextRequest } from 'next/server'

export const config: PageConfig = {
  runtime: 'experimental-edge',
}
const BASE_URL = process.env.VERCEL_URL ?? 'http://localhost:3000'

const getFont = async (name: string) => {
  const url = `${BASE_URL}/fonts/${name}.ttf`

  try {
    const res = await fetch(url)
    return { data: await res.arrayBuffer(), url }
  } catch (reason) {
    return { data: null, url }
  }
}

const poppinsRegular = getFont('poppins-regular')
const poppinsBold = getFont('poppins-bold')

type Falsy = null | undefined | false | 0 | ''

const filterBoolean = <T extends any = any, TArray extends Array<T | Falsy> = Array<T | Falsy>>(
  array: TArray
): Array<T> => array.filter(Boolean) as Array<T>

const handler = async (req: NextRequest): Promise<ImageResponse> => {
  const [regular, bold] = await Promise.all([poppinsRegular, poppinsBold])
  const title = req.nextUrl.searchParams.get('title') ?? '404'
  const subtitle = req.nextUrl.searchParams.get('subtitle')
  const fonts = filterBoolean([
    bold && {
      data: bold.data,
      name: 'PoppinsBold',
      style: 'normal',
      weight: 400,
    },
    regular && {
      data: regular.data,
      name: 'PoppinsRegular',
      style: 'normal',
      weight: 400,
    },
  ])

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            transform: 'translateY(-50%)',
            display: 'flex',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://soorria.com/logo.svg" alt="" style={{ width: '100%' }} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 56,
              minWidth: 600,
              maxWidth: 900,
              color: '#f8f8f2',
              borderRadius: 24,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: '#282a36',
                opacity: 178 / 255,
                borderRadius: 24,
              }}
            ></div>
            <p
              style={{
                fontFamily: 'PoppinsBold',
                fontWeight: 400,
                fontSize: 60,
                lineHeight: 1,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {title}
            </p>
            {subtitle ? (
              <p
                style={{
                  fontFamily: 'PoppinsRegular',
                  fontWeight: 400,
                  fontSize: 30,
                  marginTop: 24,
                }}
              >
                soorria.com
              </p>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      fonts: fonts.length ? fonts : undefined,

      headers: {
        'x-urls': [regular.url, bold.url].join(','),
      },
    }
  )
}

export default handler
