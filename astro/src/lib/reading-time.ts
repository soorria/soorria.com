import readingTime from 'reading-time'

const wordsFormatter = Intl.NumberFormat('en', { notation: 'compact' } as Intl.NumberFormatOptions)

export const getContentMetrics = (content: string): { readingTime: string; words: string } => {
  const times = readingTime(content)
  return {
    readingTime: times.text,
    words: `~${wordsFormatter.format(times.words)} words`,
  }
}
