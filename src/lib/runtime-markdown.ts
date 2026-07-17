import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { htmlEscape } from '../utils/html-escape'

const runtimeMarkdown = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeAccessibleEmojis)
  .use(rehypeStringify)

/**
 * Renders trusted, request-time CMS copy without evaluating MDX imports,
 * expressions, raw HTML, or JavaScript. Interactive content belongs in
 * compile-time MDX modules and Astro islands instead.
 */
export const renderRuntimeMarkdown = async (source: string): Promise<string> => {
  const safeColorSpans: string[] = []
  const withPlaceholders = source.replace(
    /<span\s+style=\{\{\s*color:\s*['"]var\(--([a-z-]+)\)['"]\s*\}\}\s*>([\s\S]*?)<\/span>/g,
    (original, color: string, content: string) => {
      const allowedColors = new Set(['pink', 'purple', 'red', 'green', 'cyan', 'content', 'base'])
      if (!allowedColors.has(color)) return original

      const index = safeColorSpans.push(
        `<span style="color:var(--${color})">${htmlEscape(content)}</span>`
      )
      return `RUNTIME_COLOR_SPAN_${index - 1}_TOKEN`
    }
  )
  let html = String(await runtimeMarkdown.process(withPlaceholders))
  safeColorSpans.forEach((span, index) => {
    html = html.replace(`RUNTIME_COLOR_SPAN_${index}_TOKEN`, span)
  })
  return html
}
