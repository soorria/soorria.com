import type { Node as UnistNode } from 'unist'
import { visit, Visitor } from 'unist-util-visit'
import type { Element, Node } from 'hast'

const isPreElement = (n: Node): n is Element => (n as any).tagName === 'pre'

export function rehypeRearrangeShikiOutput() {
  const visitor = (node: Element, _index: number, _parent: Element) => {
    if (!Array.isArray(node.properties?.className) || !node.properties?.className.includes('shiki'))
      return

    const children = node.children as any[]

    let language = 'code'
    let newChildren = [] as any[]

    for (const child of children) {
      if (child.type !== 'element') {
        continue
      }

      const props = child.properties
      const className = props?.className ?? []

      if (className.includes('language-id')) {
        language = child.children.find((c: any) => Boolean(c.value)).value
      } else if (className.includes('code-container')) {
        newChildren = child.children
      }
    }

    node.properties = {
      ...node.properties,
      language,
    } as any

    node.children = newChildren
  }

  return (tree: UnistNode) => visit(tree, isPreElement, visitor as Visitor)
}
