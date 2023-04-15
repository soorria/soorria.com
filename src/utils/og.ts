import type { DataType } from '~/types/data'
import type { OpenGraphMedia } from 'next-seo/lib/types'
import { PUBLIC_URL } from '~/constants'

export const getOgUrl = (title: string, subtitle?: string, titleParts?: string[]): string => {
  const params = [
    `title=${encodeURIComponent(title)}`,
    `subtitle=${subtitle ? encodeURIComponent(subtitle) : ''}`,
  ]

  if (titleParts) {
    params.push(...titleParts.map(part => `titleParts=${encodeURIComponent(part)}`))
  }

  return `${PUBLIC_URL}/api/og?${params.join('&')}`
}

export const getOgImageForData = (
  type: DataType,
  title?: string,
  titleParts?: string[]
): OpenGraphMedia => {
  return getOgImage(title || type, `soorria.com/${type} `, titleParts)
}

export const getOgImage = (
  title: DataType | string,
  subtitle?: string,
  titleParts?: string[]
): OpenGraphMedia => {
  return {
    url: getOgUrl(title, subtitle, titleParts),
    width: 1200,
    height: 630,
  }
}
