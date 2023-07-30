export const formatDate = (date: Date | string | null): string =>
  date
    ? new Date(date).toLocaleDateString('en-GB', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      })
    : 'NO DATE'
