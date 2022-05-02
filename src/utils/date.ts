export const formatDate = (date: Date | string): string =>
  new Date(date).toLocaleDateString(undefined, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
