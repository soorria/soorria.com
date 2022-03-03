import type { Node as UnistNode, Parent } from 'unist'
import { visit } from 'unist-util-visit'

/**
 * MIT License
 *
 * Copyright (c) 2021 Cody Brunner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// eslint-disable-next-line
export function rehypeCodeTitles() {
  return (tree: UnistNode) => visit(tree, 'element', visitor)

  function visitor(node: UnistNode, index: number | null, parent: Parent | null): void {
    if (!parent || node.tagName !== 'pre') {
      return
    }

    const pre = node
    const code = Array.isArray(pre.children) ? pre.children[0] : pre.children
    const className: Array<string | never> = code.properties.className || []

    const updatedClassName = className.reduce((acc, cls) => {
      // If cls is something like...
      // i.e. language-typescript:lib/mdx.ts
      if (cls.includes(':')) {
        // Split on the ':'
        const [langClassName, title] = cls.split(':')
        // Add the title block to the tree at the index prior
        // to the <pre /> with the title we found.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        parent.children.splice(index!, 0, {
          children: [
            {
              tagName: 'span',
              type: 'element',
              children: [{ type: 'text', value: title }],
            },
          ],
          properties: { className: ['code-title'] },
          tagName: 'div',
          type: 'element',
        })
        acc.push(langClassName)
        return acc
      }
      if (cls.slice(0, 9) === 'language-') {
        acc.push(cls)
        return acc
      }
      return acc
    }, [] as Array<string>)

    pre.children = [{ ...code, properties: { className: updatedClassName } }]
  }
}
