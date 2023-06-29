import glob from 'globby'
import { pascalCase } from 'change-case'
import { promises as fs } from 'fs'

const main = async () => {
  const componentFiles = await glob('_data/*/*/components.js', {})

  const importSources = componentFiles.map(file => {
    const [type, slug] = file.replace('_data/', '').replace('/components.js', '').split('/') as [
      string,
      string
    ]
    const importPath = file.replace('_data/', '~data/').replace('.js', '')
    const importName = pascalCase(slug)

    return {
      type,
      slug,
      importPath,
      importName,
    }
  })

  const imports = importSources.map(({ importPath, importName }) => {
    return `import * as ${importName} from '${importPath}'`
  })

  const dataComponents = `
export const dataComponents = {
${importSources
  .map(({ type, slug, importName }) => {
    const key = `${type}/${slug}`
    return `  '${key}': ${importName},`
  })
  .join('\n')}
}
`.trim()

  await fs.writeFile(
    'src/components/mdx/data-components.generated.ts',
    `${imports.join('\n')}\n\n${dataComponents}`
  )
}

main()
