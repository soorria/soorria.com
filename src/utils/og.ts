import type { DataType } from '@/types/data'
import type { OpenGraphMedia } from 'next-seo/lib/types'
import { PUBLIC_URL } from '@/constants'

export const getOgUrl = (category: string, title?: string): string => {
  return `${PUBLIC_URL}/api/og?category=${category}&title=${title ? encodeURIComponent(title) : ''}`
}

export const getOgImage = (category: DataType | string, title?: string): OpenGraphMedia => {
  return {
    url: getOgUrl(category, title),
    width: 1200,
    height: 630,
  }
}
