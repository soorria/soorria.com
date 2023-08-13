import type { DataType } from '~/types/data'
import type { OpenGraphMedia } from 'next-seo/lib/types'
import { PUBLIC_URL } from '~/constants'

type OgParams = {
  title: string
  subtitle?: string
  titleParts?: string[]
  bottomText?: string
  debug?: boolean
}

export const getOgUrl = ({ title, bottomText, subtitle, titleParts, debug }: OgParams): string => {
  const params = [
    `title=${encodeURIComponent(title)}`,
    `subtitle=${subtitle ? encodeURIComponent(subtitle) : ''}`,
    `bottomText=${bottomText ? encodeURIComponent(bottomText) : ''}`,
  ]

  if (titleParts) {
    params.push(...titleParts.map(part => `titleParts=${encodeURIComponent(part)}`))
  }

  if (debug) {
    params.push(`debug=${debug}`)
  }

  return `${PUBLIC_URL}/api/og?${params.join('&')}`
}

export const getOgImageForData = (
  type: DataType,
  title?: string,
  titleParts?: string[]
): OpenGraphMedia => {
  return getOgImage({ title: title || type, subtitle: `soorria.com/${type} `, titleParts })
}

export const getOgImage = (params: OgParams): OpenGraphMedia => {
  return {
    url: getOgUrl(params),
    width: 1200,
    height: 630,
  }
}
