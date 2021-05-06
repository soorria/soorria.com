interface HasCreatedAtField {
  createdAt: string
}

export const sortByCreatedAtField = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.sort((a, b) => (b.createdAt > a.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0))

export const filterUnpublished = <T extends HasCreatedAtField>(arr: T[]): T[] =>
  arr.filter(el => process.env.NODE_ENV !== 'production' || !!el.createdAt)
