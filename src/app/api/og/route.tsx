import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const BASE_URL = 'https://soorria.com'

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

export const GET = async (req: NextRequest): Promise<ImageResponse> => {
  const [regular, bold] = await Promise.all([poppinsRegular, poppinsBold])
  const bottomText = req.nextUrl.searchParams.get('bottomText')
  const titleParts = req.nextUrl.searchParams.getAll('titleParts')
  const title = titleParts.length ? (
    titleParts.slice(0, 2).map((part, i) => <span key={i}>{part}</span>)
  ) : (
    <span>{req.nextUrl.searchParams.get('title') ?? '404'}</span>
  )
  const subtitle = req.nextUrl.searchParams.get('subtitle')
  const fonts = [
    bold?.data && {
      data: bold.data,
      name: 'PoppinsBold',
      style: 'normal' as const,
      weight: 400 as const,
    },
    regular?.data && {
      data: regular.data,
      name: 'PoppinsRegular',
      style: 'normal' as const,
      weight: 400 as const,
    },
  ].filter(Boolean)

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
              padding: '36px 80px',
              minWidth: 600,
              maxWidth: 960,
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
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
                flexDirection: 'column',
                alignItems: 'center',
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
                  margin: 0,
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {bottomText && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'PoppinsRegular',
                fontSize: 30,
                color: '#282a36',
                // opacity: 178 / 255,
                letterSpacing: 1.25,
              }}
            >
              {bottomText}
            </p>
          </div>
        )}
      </div>
    ),
    {
      fonts,
      debug: req.nextUrl.searchParams.has('debug'),
      headers: {
        'x-font-urls': [regular.url, bold.url].join(','),
      },
    }
  )
}
