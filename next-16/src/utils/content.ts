import type { BlogPostFrontMatter } from '~/types/blog-post'

interface HasCreatedAtField {
  createdAt: string
}

export const createdAtFieldComparator = <T extends HasCreatedAtField>(a: T, b: T): number =>
  b.createdAt > a.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0

export const sortByCreatedAtField = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.sort(createdAtFieldComparator)

const filterUnpublished = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.filter(el => process.env.NODE_ENV !== 'production' || !!el.createdAt)

const filterPrivate = <T extends { private?: boolean }>(arr: T[]): T[] =>
  arr.filter(el => process.env.NODE_ENV !== 'production' || !el.private)

export const addRefToUrl = (url: string, ref = 'soorria.com'): string => {
  const u = new URL(url)
  u.searchParams.set('ref', ref)
  return u.toString()
}

const composeFilters = <T>(...filters: Array<(arr: T[]) => T[]>): ((arr: T[]) => T[]) => {
  return arr => {
    return filters.reduce((arr, filter) => filter(arr), arr)
  }
}

export const blogPostFilter = composeFilters<BlogPostFrontMatter>(filterPrivate, filterUnpublished)

export const getAllTags = <T extends { category: string; tags: string[] }>(item: T): string[] => [
  item.category,
  ...item.tags,
]
