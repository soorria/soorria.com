import type { SnippetFrontMatter } from '~/types/snippet'
import PostLayout from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter } from '~/lib/data'
import { getOgImageForData } from '~/utils/og'
import { sortByCreatedAtField } from '~/utils/content'
import { PUBLIC_URL } from '~/constants'
import SnippetGrid from './snippet-grid'

const description =
  'Little bits of code that I find useful and you might too! Mostly written in TypeScript & JavaScript and often for React, Vue and SolidJS.'
const title = 'Snippets'
const url = `${PUBLIC_URL}/snippets`

export const metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    images: [getOgImageForData('snippets')],
  },
}

const SnippetsPage = async () => {
  const snippets = sortByCreatedAtField(
    await getAllFilesFrontMatter<SnippetFrontMatter>('snippets')
  )

  // const filterableTags = arrayUnique(
  //   snippets.flatMap(snippet => getAllTags(snippet)).map(tag => tag.toLowerCase())
  // )

  return (
    <PostLayout title="Snippets" description={description}>
      <SnippetGrid snippets={snippets} />
    </PostLayout>
  )
}

export default SnippetsPage
