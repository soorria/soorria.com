import { visit } from 'unist-util-visit'
import type { Parent } from 'unist'
import { transformSync } from '@babel/core'
// @ts-expect-error no types
import tsPreset from '@babel/preset-typescript'
import { format } from 'prettier'
import type { Transformer } from 'unified'
import type { Code } from 'mdast'

const isTypescriptCodeBlock = (lang: string) => ['ts', 'tsx', 'typescript'].includes(lang)
const getJavascriptType = (lang: string) => (lang === 'tsx' ? 'jsx' : 'js')

export const remarkTypeScriptTransform = (): Transformer => {
  const visitor = (node: Code, index: number, parent: Parent) => {
    const { lang, value, meta, data, type } = node
    if (!lang || !isTypescriptCodeBlock(lang) || meta?.match(/\bnojs\b/)) return

    const transformedLang = getJavascriptType(lang)
    const transformedCode =
      transformSync(value, {
        filename: `file.${lang === 'tsx' ? 'tsx' : 'ts'}`,
        retainLines: true,
        presets: [tsPreset],
      })?.code ?? ''

    const formattedCode = !meta?.match(/\bnoformat\b/i)
      ? format(transformedCode, {
          semi: false,
          tabWidth: 2,
          printWidth: 80,
          singleQuote: true,
          trailingComma: 'es5',
          arrowParens: 'avoid',
          parser: 'babel',
        }).trim()
      : transformedCode

    let jsMeta = meta
    const hasJsLines = meta?.match(/\bjsLines="(?<lines>[^"]+)"/)
    const removeTsLines = !meta?.match(/\bjsKeepLines\b/) || hasJsLines

    if (removeTsLines) {
      jsMeta = jsMeta?.replace(/{[^}]*}/g, '')

      if (hasJsLines) {
        const jsLines = hasJsLines.groups?.lines
        if (jsLines) {
          jsMeta += `{${jsLines}}`
        }
      }
    }

    const jsNode: Code = {
      type,
      meta: jsMeta,
      // meta,
      data,
      lang: transformedLang,
      value: formattedCode,
    }

    const wrapper = {
      type: 'mdxJsxFlowElement',
      name: 'TsJsSwitcher',
      attributes: [],
      children: [node, jsNode],
    }

    parent.children.splice(index, 1, wrapper)
  }

  return tree => visit(tree, 'code', visitor)
}
