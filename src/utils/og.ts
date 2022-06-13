import type { DataType } from '@/types/data'
import type { OpenGraphMedia } from 'next-seo/lib/types'
import { PUBLIC_URL } from '@/constants'

export const getOgUrl = (title: string, subtitle?: string): string => {
  return `${PUBLIC_URL}/api/og?title=${title}&subtitle=${
    subtitle ? encodeURIComponent(subtitle) : ''
  }`
}

export const getOgImageForData = (type: DataType, title?: string): OpenGraphMedia => {
  return getOgImage(title || type, `soorria.com/${type} `)
}

export const getOgImage = (title: DataType | string, subtitle?: string): OpenGraphMedia => {
  return {
    url: getOgUrl(title, subtitle),
    width: 1200,
    height: 630,
  }
}
