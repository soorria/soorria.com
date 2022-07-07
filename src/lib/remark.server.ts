import { Parent, visit } from 'unist-util-visit'
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
    if (!lang || !isTypescriptCodeBlock(lang)) return

    const transformedLang = getJavascriptType(lang)
    const transformedCode =
      transformSync(value, {
        filename: `file.${lang === 'tsx' ? 'tsx' : 'ts'}`,
        retainLines: true,
        presets: [tsPreset],
      })?.code ?? ''

    const formattedCode = format(transformedCode, {
      semi: false,
      tabWidth: 2,
      printWidth: 80,
      singleQuote: true,
      trailingComma: 'es5',
      arrowParens: 'avoid',
      parser: 'babel',
    }).trim()

    const jsNode: Code = {
      type,
      meta: meta?.replace(/{[^}]*}/g, ''),
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
