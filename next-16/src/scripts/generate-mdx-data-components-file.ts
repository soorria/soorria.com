import glob from 'globby'
import { pascalCase } from 'change-case'
import { promises as fs } from 'fs'

const main = async () => {
  const componentFiles = await glob('src/data/*/*/components.{js,ts,tsx,jsx}', {})

  const importSources = componentFiles
    .map(file => {
      const [type, slug] = file
        .replace('src/data/', '')
        .replace(/\/components\.[jt]sx?/, '')
        .split('/') as [string, string]
      const importPath = file.replace('src/data/', '~data/').replace(/\.[jt]sx?/, '')
      const importName = pascalCase(slug)

      return {
        type,
        slug,
        importPath,
        importName,
        key: `${type}/${slug}`,
      }
    })
    .sort((a, b) => a.key.localeCompare(b.key))

  const imports = importSources.map(({ importPath, importName }) => {
    return `import * as ${importName} from '${importPath}'`
  })

  const dataComponents = `
export const dataComponents = {
${importSources
  .map(({ importName, key }) => {
    return `  '${key}': ${importName},`
  })
  .join('\n')}
}
`.trimStart()

  await fs.writeFile(
    'src/components/mdx/data-components.generated.ts',
    `${imports.join('\n')}\n\n${dataComponents}`
  )
}

main()
