import { ImageResponse } from '@vercel/og'
import type { APIRoute } from 'astro'

// This endpoint needs to run on the server
export const prerender = false

const BASE_URL = 'https://soorria.com'

const getFont = async (name: string) => {
  const url = `${BASE_URL}/fonts/${name}.ttf`

  try {
    const res = await fetch(url)
    return { data: await res.arrayBuffer(), url }
  } catch {
    return { data: null, url }
  }
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const [regular, bold] = await Promise.all([
    getFont('poppins-regular'),
    getFont('poppins-bold'),
  ])

  const bottomText = url.searchParams.get('bottomText')
  const titleParts = url.searchParams.getAll('titleParts')
  const titleText = titleParts.length
    ? titleParts.slice(0, 2).join('\n')
    : url.searchParams.get('title') ?? '404'
  const subtitle = url.searchParams.get('subtitle')

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
  ].filter(Boolean) as { data: ArrayBuffer; name: string; style: 'normal'; weight: 400 }[]

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          position: 'relative',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                transform: 'translateY(-50%)',
                display: 'flex',
              },
              children: {
                type: 'img',
                props: {
                  src: 'https://soorria.com/logo.svg',
                  alt: '',
                  style: { width: '100%' },
                },
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              },
              children: {
                type: 'div',
                props: {
                  style: {
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
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          bottom: 0,
                          background: '#282a36',
                          opacity: 178 / 255,
                          borderRadius: 24,
                        },
                      },
                    },
                    {
                      type: 'p',
                      props: {
                        style: {
                          fontFamily: 'PoppinsBold',
                          fontWeight: 400,
                          fontSize: 60,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          margin: 0,
                          flexDirection: 'column',
                          alignItems: 'center',
                        },
                        children: titleText,
                      },
                    },
                    subtitle && {
                      type: 'p',
                      props: {
                        style: {
                          fontFamily: 'PoppinsRegular',
                          fontWeight: 400,
                          fontSize: 30,
                          margin: 0,
                        },
                        children: subtitle,
                      },
                    },
                  ].filter(Boolean),
                },
              },
            },
          },
          bottomText && {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: 16,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
              },
              children: {
                type: 'p',
                props: {
                  style: {
                    fontFamily: 'PoppinsRegular',
                    fontSize: 30,
                    color: '#282a36',
                    letterSpacing: 1.25,
                  },
                  children: bottomText,
                },
              },
            },
          },
        ].filter(Boolean),
      },
    },
    {
      fonts,
      headers: {
        'x-font-urls': [regular.url, bold.url].join(','),
      },
    }
  )
}
