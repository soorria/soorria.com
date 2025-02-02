import { visit } from 'unist-util-visit'
import type { Parent } from 'unist'
import { transformSync } from '@babel/core'
// @ts-expect-error no types
import tsPreset from '@babel/preset-typescript'
import { format as prettierFormat, type Options as PrettierOptions } from 'prettier'
import type { Transformer } from 'unified'
import type { Code } from 'mdast'
import fs from 'fs'

const isTypescriptCodeBlock = (lang: string) => ['ts', 'tsx', 'typescript'].includes(lang)
const getJavascriptType = (lang: string) => (lang === 'tsx' ? 'jsx' : 'js')
let prettierConfig: PrettierOptions

try {
  prettierConfig = JSON.parse(fs.readFileSync('./src/data/.prettierrc', 'utf8')) as PrettierOptions
} catch (e) {
  console.log('failed to read data prettier config', e)
  prettierConfig = {
    semi: false,
    tabWidth: 2,
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'es5',
    arrowParens: 'avoid',
    proseWrap: 'always',
  }
}

const format = (code: string) => prettierFormat(code, { ...prettierConfig, parser: 'babel' })

export const remarkTypeScriptTransform = (): Transformer => {
  const promises: Promise<void>[] = []

  const visitor = (node: Code, index: number, parent: Parent) => {
    const { lang, value, meta, data, type } = node
    if (!lang) {
      node.lang = 'text'
      return
    }
    if (!isTypescriptCodeBlock(lang) || meta?.match(/\bnojs\b/)) {
      node.meta = meta?.replace(/\bnojs\b/, '')
      return
    }

    const transformedLang = getJavascriptType(lang)
    const transformedCode =
      transformSync(value, {
        filename: `file.${lang === 'tsx' ? 'tsx' : 'ts'}`,
        retainLines: true,
        presets: [tsPreset],
      })?.code ?? ''

    let jsMeta = meta
    const hasJsLines = meta?.match(/\bjsLines="(?<lines>[^"]+)"/)
    const removeTsLines = !meta?.match(/\bjsKeepLines\b/) || hasJsLines

    if (removeTsLines) {
      jsMeta = jsMeta?.replace(/{[^}]*}/g, '')

      if (hasJsLines) {
        const jsLines = hasJsLines.groups?.lines
        if (jsLines) {
          jsMeta = jsMeta?.replace(hasJsLines[0], '') + ` {${jsLines}}`
        }
      }
    }

    const jsNode: Code = {
      type,
      meta: jsMeta?.trim(),
      data: data,
      lang: transformedLang,
      value: 'THIS SHOULD NOT EXIST!! FORMATTING TRANSPIlED JS FAILED',
    }
    node.lang = node.lang === 'tsx' ? 'tsx' : 'ts'

    promises.push(
      format(transformedCode).then(formattedCode => {
        jsNode.value = formattedCode
      })
    )

    const wrapper = {
      type: 'mdxJsxFlowElement',
      name: 'TsJsSwitcher',
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'data-jsx',
          value: (node.lang === 'jsx').toString(),
        },
      ],
      children: [node, jsNode],
    }

    parent.children.splice(index, 1, wrapper)
  }

  return async tree => {
    visit(tree, 'code', visitor, undefined)

    await Promise.all(promises)
  }
}
