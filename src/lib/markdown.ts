import { marked } from 'marked'

export const mdToHtml = async (text: string, opts: { inline?: boolean } = {}) => {
  text = text.replace(/Sparkles/g, 's-sparkles')
  if (opts.inline) return marked.parseInline(text)
  return marked(text)
}
