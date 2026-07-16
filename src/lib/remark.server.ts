import { visit } from 'unist-util-visit'
import type { Parent } from 'unist'
import { transformSync } from '@babel/core'
// @ts-expect-error no types
import tsPreset from '@babel/preset-typescript'
import { format as prettierFormat, type Options as PrettierOptions } from 'prettier'
import type { Transformer } from 'unified'
import type { Code } from 'mdast'
import fs from 'fs'
import { extractIdFromMeta, stripIdFromMeta } from './code-block-meta'

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
    node.lang ||= 'text'

    const { lang, value, meta, data, type } = node
    // For plain (non-TsJsSwitcher) blocks, leave id in meta — rehypePreserveCodeBlockIds
    // picks it up after mdast → hast. hProperties don't survive rehype-pretty-code.
    const id = extractIdFromMeta(meta)

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

    // Id goes on the TsJsSwitcher wrapper (not the inner <pre>s), so strip it
    // from both metas before pretty-code runs.
    if (id) {
      if (node.meta) node.meta = stripIdFromMeta(node.meta)
      if (jsMeta) jsMeta = stripIdFromMeta(jsMeta)
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

    const attributes: Array<{ type: 'mdxJsxAttribute'; name: string; value: string }> = [
      {
        type: 'mdxJsxAttribute',
        name: 'data-jsx',
        value: (node.lang === 'jsx').toString(),
      },
    ]

    if (id) {
      attributes.push({
        type: 'mdxJsxAttribute',
        name: 'id',
        value: id,
      })
    }

    const wrapper = {
      type: 'mdxJsxFlowElement',
      name: 'TsJsSwitcher',
      attributes,
      children: [node, jsNode],
    }

    parent.children.splice(index, 1, wrapper)
  }

  return async tree => {
    visit(tree, 'code', visitor, undefined)

    await Promise.all(promises)
  }
}
