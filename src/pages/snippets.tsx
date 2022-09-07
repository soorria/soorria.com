import type { GetStaticProps } from 'next'
import type { SnippetFrontMatter } from '@/types/snippet'
import { NextSeo } from 'next-seo'
import PostLayout from '@/components/PostLayout'
import { getAllFilesFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import SnippetCard from '@/components/SnippetCard'
import { getOgImageForData } from '@/utils/og'
import { sortByCreatedAtField } from '@/utils/content'
import { PUBLIC_URL } from '@/constants'
import License from '@/components/License'

interface SnippetsPageProps {
  snippets: SnippetFrontMatter[]
}

const description =
  'Little bits of code that I find useful and you might too! Mostly written in TypeScript (with a transpiled JavaScript available) and often for React and SolidJS.'
const title = 'Snippets'
const url = `${PUBLIC_URL}/snippets`

const SnippetsPage: React.FC<SnippetsPageProps> = ({ snippets }) => {
  return (
    <PostLayout title="Snippets">
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title,
          description,
          type: 'website',
          url,
          images: [getOgImageForData(DataType.snippets)],
        }}
      />
      <p className="mt-6 mb-12 text-center text-lg">{description}</p>
      <div className="grid auto-cols-min grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {snippets.map(snippet => (
          <SnippetCard key={snippet.slug} snippet={snippet} />
        ))}
      </div>
      <div className="my-12 text-center">{snippets.length} snippets total</div>
      <License summary="License for these snippets" />
    </PostLayout>
  )
}

export default SnippetsPage

export const getStaticProps: GetStaticProps = async () => {
  const snippets = sortByCreatedAtField(
    await getAllFilesFrontMatter<SnippetFrontMatter>(DataType.snippets)
  )

  return {
    props: { snippets },
  }
}
