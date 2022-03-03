interface HasCreatedAtField {
  createdAt: string
}

export const createdAtFieldComparator = <T extends HasCreatedAtField>(a: T, b: T): number =>
  b.createdAt > a.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0

export const sortByCreatedAtField = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.sort(createdAtFieldComparator)

export const filterUnpublished = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.filter(el => process.env.NODE_ENV !== 'production' || !!el.createdAt)

export const addRefToUrl = (url: string, ref = 'mooth.tech'): string => {
  const u = new URL(url)
  u.searchParams.set('ref', ref)
  return u.toString()
}
