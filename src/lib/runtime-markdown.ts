import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import { evaluate } from '@mdx-js/mdx'
import { createElement, type PropsWithChildren } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as reactRuntime from 'react/jsx-runtime'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { Node as UnistNode } from 'unist'
import { htmlEscape } from '../utils/html-escape'

const runtimeMarkdown = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeAccessibleEmojis)
  .use(rehypeStringify)

const renderSafeMarkdown = async (source: string): Promise<string> => {
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

type AstNode = {
  type?: string
  name?: string
  computed?: boolean
  property?: AstNode
  [key: string]: unknown
}

const blockedIdentifiers = new Set([
  'eval',
  'Function',
  'AsyncFunction',
  'GeneratorFunction',
  'require',
  'process',
  'global',
  'globalThis',
  'module',
  'exports',
  '__dirname',
  '__filename',
])
const blockedProperties = new Set(['constructor', 'prototype', '__proto__'])

const rejectUnsafeMdx = () => (tree: UnistNode) => {
  visit(tree, node => {
    if (node.type === 'mdxjsEsm') throw new Error('Runtime MDX imports and exports are disabled')
    if (
      (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
      (node as AstNode).name?.toLowerCase() === 'script'
    ) {
      throw new Error('Runtime MDX scripts are disabled')
    }
  })
}

const rejectDangerousExpressions = () => (tree: AstNode) => {
  const walk = (value: unknown, parent?: AstNode) => {
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value)) {
      value.forEach(child => walk(child, parent))
      return
    }

    const node = value as AstNode
    if (
      node.type === 'Identifier' &&
      node.name &&
      blockedIdentifiers.has(node.name) &&
      !(parent?.type === 'MemberExpression' && parent.property === node && !parent.computed)
    ) {
      throw new Error(`Runtime MDX cannot access ${node.name}`)
    }
    if (
      node.type === 'MemberExpression' &&
      node.property?.name &&
      blockedProperties.has(node.property.name)
    ) {
      throw new Error(`Runtime MDX cannot access ${node.property.name}`)
    }

    for (const [key, child] of Object.entries(node)) {
      if (key !== 'position') walk(child, node)
    }
  }

  walk(tree)
}

const RuntimeSparkles = ({ children, block }: PropsWithChildren<{ block?: boolean }>) =>
  createElement(
    'span',
    {
      className: `relative ${block ? 'block' : 'inline-block'}`,
      'data-runtime-sparkles': '',
    },
    createElement('span', { className: 'relative', style: { zIndex: 10 } }, children)
  )

const runtimeComponents = {
  Sparkles: RuntimeSparkles,
  sparkles: RuntimeSparkles,
  's-sparkles': RuntimeSparkles,
}

/**
 * Renders trusted request-time CMS MDX with the landing-page component set.
 * Unsafe or invalid MDX falls back to the non-evaluating Markdown renderer.
 */
export const renderRuntimeMarkdown = async (source: string): Promise<string> => {
  try {
    const { default: Content } = await evaluate(source, {
      ...reactRuntime,
      development: false,
      remarkPlugins: [remarkGfm, rejectUnsafeMdx],
      rehypePlugins: [rehypeAccessibleEmojis],
      recmaPlugins: [rejectDangerousExpressions],
    })
    return renderToStaticMarkup(createElement(Content, { components: runtimeComponents }))
  } catch {
    return renderSafeMarkdown(source)
  }
}
