import { DataType } from '@/types/data'
import { OpenGraphImages } from 'next-seo/lib/types'

export const getOgUrl = (category: DataType, title?: string): string => {
  return `https://mooth.tech/api/og?category=${category}&title=${
    title ? encodeURIComponent(title) : ''
  }`
}

export const getOgImage = (category: DataType, title?: string): OpenGraphImages => {
  return {
    url: getOgUrl(category, title),
    width: 1200,
    height: 630,
  }
}
