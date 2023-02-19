import type { Element, ElementContent, Node } from 'hast'
import type { Plugin } from 'unified'
import type { Node as UnistNode } from 'unist'
import { visit, Visitor } from 'unist-util-visit'

const isPreElement = (n: Node): n is Element => (n as Element).tagName === 'pre'

export const rehypeRearrangeShikiOutput: Plugin = () => {
  const visitor = (node: Element, _index: number, _parent: Element) => {
    if (!Array.isArray(node.properties?.className) || !node.properties?.className.includes('shiki'))
      return

    const children = node.children as ElementContent[]

    let language = 'code'
    let newChildren = [] as ElementContent[]

    for (const child of children) {
      if (child.type !== 'element') {
        continue
      }

      const props = child.properties
      const className =
        (Array.isArray(props?.className) ? props?.className : [props?.className]) ?? []

      if (className.includes('language-id')) {
        language =
          (child.children as unknown as Array<{ value: string }>)?.find(c => Boolean(c.value))
            ?.value ?? ''
      } else if (className.includes('code-container')) {
        newChildren = child.children
      }
    }

    node.properties = {
      ...node.properties,
      language,
    }

    node.children = newChildren
  }

  return (tree: UnistNode) => visit(tree, isPreElement, visitor as Visitor)
}
