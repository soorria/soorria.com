// import { Resvg } from '@resvg/resvg-js'
// import { ImageResponse } from '@vercel/og'
// import { ReactNode } from 'react'
// import satori from 'satori'
// import { html } from 'satori-html'
import { json } from 'solid-start'

// // import poppinsBold from '~public/fonts/poppins-bold.ttf'
// // import poppinsRegular from '~public/fonts/poppins-regular.ttf'

// const BASE_URL = 'https://soorria.com'

// type Falsy = null | undefined | false | 0 | ''
// type FontOption = NonNullable<
//   NonNullable<ConstructorParameters<typeof ImageResponse>[1]>['fonts']
// >[number]

// const getFont = async (name: string) => {
//   const url = `${BASE_URL}/fonts/${name}.ttf`

//   try {
//     const res = await fetch(url)
//     return { data: await res.arrayBuffer(), url }
//   } catch (reason) {
//     return { data: null, url }
//   }
// }

// const poppinsRegular = getFont('poppins-regular')
// const poppinsBold = getFont('poppins-bold')

// const filterBoolean = <T, TArray extends Array<T | Falsy> = Array<T | Falsy>>(
//   array: TArray
// ): Array<T> => array.filter(Boolean) as Array<T>

// export const GET = async ({
//   ...args
// }: {
//   request: Request
//   fetch: typeof globalThis.fetch
// }): Promise<ImageResponse> => {
//   const [regular, bold] = await Promise.all([poppinsRegular, poppinsBold])
//   const request = args.request
//   const url = new URL(request.url)
//   const title = url.searchParams.get('title') ?? '404'
//   const subtitle = url.searchParams.get('subtitle')
//   const fonts = filterBoolean([
//     bold && {
//       data: bold.data,
//       name: 'PoppinsBold',
//       style: 'normal',
//       weight: 400,
//     },
//     regular && {
//       data: regular.data,
//       name: 'PoppinsRegular',
//       style: 'normal',
//       weight: 400,
//     },
//   ])
//   // const fonts = [
//   //   {
//   //     data: Buffer.from(poppinsBold),
//   //     name: 'PoppinsBold',
//   //     style: 'normal',
//   //     weight: 400,
//   //   },
//   //   {
//   //     data: Buffer.from(poppinsRegular),
//   //     name: 'PoppinsRegular',
//   //     style: 'normal',
//   //     weight: 400,
//   //   },
//   // ] as FontOption[]

//   const out = html`<div
//     style=${{
//       height: '100%',
//       width: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: 'white',
//       position: 'relative',
//     }}
//   >
//     <div
//       style=${{
//         position: 'absolute',
//         left: 0,
//         right: 0,
//         top: 0,
//         bottom: 0,
//         transform: 'translateY(-50%)',
//         display: 'flex',
//       }}
//     >
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img src="https://soorria.com/logo.svg" alt="" style=${{ width: '100%' }} />
//     </div>
//     <div
//       style=${{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100%',
//       }}
//     >
//       <div
//         style=${{
//           display: 'flex',
//           flexDirection: 'column',
//           textAlign: 'center',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: '36px 80px',
//           minWidth: 600,
//           maxWidth: 960,
//           color: '#f8f8f2',
//           borderRadius: 24,
//         }}
//       >
//         <div
//           style=${{
//             position: 'absolute',
//             left: 0,
//             right: 0,
//             top: 0,
//             bottom: 0,
//             background: '#282a36',
//             opacity: 178 / 255,
//             borderRadius: 24,
//             display: 'flex',
//           }}
//         ></div>
//         <p
//           style=${{
//             fontFamily: 'PoppinsBold',
//             fontWeight: 400,
//             fontSize: 60,
//             whiteSpace: 'pre-wrap',
//             wordBreak: 'break-word',
//             margin: 0,
//           }}
//         >
//           ${title}
//         </p>
//         <!-- ${subtitle
//           ? /** html`<p
//                 style=${{
//                   fontFamily: 'PoppinsRegular',
//                   fontWeight: 400,
//                   fontSize: 30,
//                   margin: 0,
//                 }}
//               >
//                 ${subtitle}
//               </p>`*/
//             null
//           : null} -->
//       </div>
//     </div>
//   </div>`

//   console.log(1)

//   try {
//     const svg = await satori(out as any as ReactNode, {
//       fonts: fonts,
//       // fonts: [],
//       height: 630,
//       width: 1200,
//       debug: url.searchParams.has('debug'),
//     })

//     console.log(2, svg)

//     const resvg = new Resvg(svg, {
//       fitTo: {
//         mode: 'width',
//         value: 1200,
//       },
//     })

//     console.log(3, resvg)

//     const image = resvg.render()

//     console.log(4, image)

//     return new Response(image.asPng(), {
//       headers: {
//         'Content-Type': 'image/png',
//         'Cache-Control': 'public, max-age=31536000, immutable',
//       },
//     })
//   } catch (err) {
//     console.log(1.1, err)
//   }

//   return json({})
// }

export const GET = () => {
  return json({
    todo: true,
  })
}
