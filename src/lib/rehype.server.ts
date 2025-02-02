import type { Plugin } from 'unified'
import type { Node as UnistNode } from 'unist'
import { visit } from 'unist-util-visit'
import type { Element, Node } from 'hast'

const isRehypeCodeWrapper = (n: UnistNode<Record<string, any>>): n is Element =>
  'data-rehype-pretty-code-fragment' in ((n as Element).properties ?? {})

export const rehypeRearrangePrettyCodeOutput: Plugin = () => {
  const visitor = (
    node: Element,
    index: number | undefined,
    parent: Node & { children: Element[]; name?: string }
  ) => {
    if (index === undefined) {
      return
    }

    const isInTsJsSwitcher = parent.type === 'mdxJsxFlowElement' && parent.name === 'TsJsSwitcher'

    const children = node.children as Element[]

    /**
     * Children are like this:
     *
     * 1. title (optional)
     * 2. pre w/ code
     * 3. caption (optional)
     *
     */
    const [first, second, third] = children

    const extraProperties: Partial<Record<'data-wrapper' | 'data-title' | 'data-caption', string>> =
      {}

    if (isInTsJsSwitcher) {
      extraProperties['data-wrapper'] = 'true'
    }

    if ('data-rehype-pretty-code-title' in (first?.properties ?? {})) {
      extraProperties['data-title'] = (first!.children![0] as { value: string })?.value
    }

    const pre = (extraProperties['data-title'] ? second : first)!

    const maybeCaptionEl = extraProperties['data-title'] ? third : second
    if (maybeCaptionEl) {
      extraProperties['data-caption'] = (maybeCaptionEl.children![0] as { value: string })?.value
    }

    pre.properties = {
      ...pre.properties,
      ...extraProperties,
    }

    parent.children[index] = pre

    if (isInTsJsSwitcher) {
      const isJsPre =
        typeof pre.properties['data-language'] === 'string' &&
        pre.properties['data-language'].includes('js')

      if (isJsPre) return

      const attrs = (parent as unknown as { attributes: any[] }).attributes
      if (attrs) {
        const title = extraProperties['data-title']
        const caption = extraProperties['data-caption']

        if (title) {
          attrs.push({ type: 'mdxJsxAttribute', name: 'data-title', value: title })
        }
        if (caption) {
          attrs.push({ type: 'mdxJsxAttribute', name: 'data-caption', value: caption })
        }
      }
    }
  }

  return (tree: UnistNode) => visit(tree, isRehypeCodeWrapper, visitor, undefined)
}
