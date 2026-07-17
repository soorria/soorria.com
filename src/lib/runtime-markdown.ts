import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

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
export const renderRuntimeMarkdown = async (source: string): Promise<string> =>
  String(await runtimeMarkdown.process(source))
