import type { BlogPost } from '~/types/blog-post'

interface HasCreatedAtField {
  createdAt?: string
}

export const createdAtFieldComparator = <T extends HasCreatedAtField>(a: T, b: T): number =>
  !a.createdAt || !b.createdAt
    ? -1000
    : b.createdAt > a.createdAt
    ? 1
    : b.createdAt < a.createdAt
    ? -1
    : 0

export const sortByCreatedAtField = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.sort(createdAtFieldComparator)

export const filterUnpublished = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.filter(el => import.meta.env.DEV || !!el.createdAt)

export const filterPrivate = <T extends { private?: boolean }>(arr: T[]): T[] =>
  arr.filter(el => import.meta.env.DEV || !el.private)

export const addRefToUrl = (url: string, ref = 'soorria.com'): string => {
  const u = new URL(url)
  u.searchParams.set('ref', ref)
  return u.toString()
}

export const composeFilters = <T>(...filters: Array<(arr: T[]) => T[]>): ((arr: T[]) => T[]) => {
  return arr => {
    return filters.reduce((arr, filter) => filter(arr), arr)
  }
}

export const blogPostFilter = composeFilters<BlogPost>(filterPrivate, filterUnpublished)

export const getAllTags = <T extends { category: string; tags: string[] }>(item: T): string[] => [
  item.category,
  ...item.tags,
]

export const itemMatchesTag = <T extends { category?: string; tags?: string[] }>(
  tag: string,
  { category, tags = [] }: T
): boolean => {
  return category?.toLowerCase() === tag || tags.map(t => t.toLowerCase()).includes(tag)
}
