import type { DataType } from '~/types/data'
import { PUBLIC_URL } from '~/constants'

export const getOgUrl = (title: string, subtitle?: string): string => {
  return `${PUBLIC_URL}/api/og?title=${encodeURIComponent(title)}&subtitle=${
    subtitle ? encodeURIComponent(subtitle) : ''
  }`
}

export const getOgImageForData = (type: DataType, title?: string) => {
  return getOgImage(title || type, `soorria.com/${type} `)
}

export const getOgImage = (title: DataType | (string & {}), subtitle?: string) => {
  return {
    url: getOgUrl(title, subtitle),
    width: 1200,
    height: 630,
  }
}
