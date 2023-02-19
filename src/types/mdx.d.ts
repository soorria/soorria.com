declare module '*.mdx?meta' {
  const meta: {
    frontmatter: unknown
    [k: string]: unknown
  }
  export default meta
}

declare module '*.mdx' {
  import { VoidComponent } from 'solid-js'
  const component: VoidComponent
  export default component
}
