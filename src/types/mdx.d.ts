declare module '*.mdx?meta' {
  export const frontMatter: {
    title?: string
    hasContent: boolean
    readingTime: string
    words: string
    [key: string]: unknown
  }
}

declare module '*.mdx' {
  import { VoidComponent } from 'solid-js'
  const component: VoidComponent
  export default component
}
