interface HasCreatedAtField {
  createdAt: string
}

const sortByCreatedAtField = (a: HasCreatedAtField, b: HasCreatedAtField): 1 | -1 | 0 =>
  b.createdAt > a.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0

export default sortByCreatedAtField
