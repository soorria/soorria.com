import { PUBLIC_URL } from '@/constants'
import { DataType } from '@/types/data'
import { OpenGraphImages } from 'next-seo/lib/types'

export const getOgUrl = (category: string, title?: string): string => {
  return `${PUBLIC_URL}/api/og?category=${category}&title=${title ? encodeURIComponent(title) : ''}`
}

export const getOgImage = (category: DataType | string, title?: string): OpenGraphImages => {
  return {
    url: getOgUrl(category, title),
    width: 1200,
    height: 630,
  }
}
