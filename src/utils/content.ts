interface HasCreatedAtField {
  createdAt: string
}

export const sortByCreatedAtField = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.sort((a, b) => (b.createdAt > a.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0))

export const filterUnpublished = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.filter(el => process.env.NODE_ENV !== 'production' || !!el.createdAt)

export const addRefToUrl = (url: string, ref = 'mooth.tech'): string => {
  if (url.includes('?')) {
    return `${url}&ref=${ref}`
  }
  return `${url}?ref=${ref}`
}
