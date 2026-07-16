import type { Plugin } from 'unified'
import type { Node as UnistNode } from 'unist'
import { visit } from 'unist-util-visit'
import type { Element, Node } from 'hast'
import { extractIdFromMeta, stripIdFromMeta } from './code-block-meta'

type ElementWithData = Element & { data?: { id?: string; meta?: string } }

const isRehypeCodeWrapper = (n: UnistNode): n is Element =>
  'data-rehype-pretty-code-fragment' in ((n as Element).properties ?? {})

/**
 * rehype-pretty-code rebuilds each <pre> into a fragment and (with
 * keepBackground: false) wipes properties on the new <pre>. mdast
 * hProperties also land on <code>, not <pre>, so they never make it to
 * CodeBlock.
 *
 * Trick: pretty-code mutates the original <pre> node in place into the
 * fragment div — it only replaces tagName/properties/children, so anything
 * we stash on `pre.data` survives. We read it back in
 * rehypeRearrangePrettyCodeOutput and put it on the final <pre>.
 */
export const rehypePreserveCodeBlockIds: Plugin = () => {
  return (tree: UnistNode) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'pre') return

      const code = node.children[0] as ElementWithData | undefined
      if (code?.tagName !== 'code') return

      // metastring lives on code.data.meta after mdast → hast
      const meta = code.data?.meta
      if (!meta) return

      const id = extractIdFromMeta(meta)
      if (!id) return

      // Stash on the <pre> — same object pretty-code will turn into the fragment
      const pre = node as ElementWithData
      pre.data = { ...pre.data, id }

      // Strip so pretty-code doesn't see a leftover id="..." in the metastring
      code.data = { ...code.data, meta: stripIdFromMeta(meta) }
    })
  }
}

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

    const extraProperties: Partial<
      Record<'data-wrapper' | 'data-title' | 'data-caption' | 'id', string>
    > = {}

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

    // `node` is the fragment = the original <pre> mutated by pretty-code, so
    // the id we stashed in rehypePreserveCodeBlockIds is still on node.data
    const id = (node as ElementWithData).data?.id
    if (id) {
      extraProperties.id = id
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
