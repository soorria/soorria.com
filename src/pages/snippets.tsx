import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import PostLayout from '@/components/PostLayout'
import { SnippetFrontMatter } from '@/types/snippet'
import { getAllFilesFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import SnippetCard from '@/components/SnippetCard'
import { getOgImage } from '@/utils/og'
import { sortByCreatedAtField } from '@/utils/content'

interface SnippetsPageProps {
  snippets: SnippetFrontMatter[]
}

const description =
  'Little bits of code that I find useful. Mostly written in TypeScript and often for React.'
const title = 'Snippets'
const url = 'https://mooth.tech/snippets'

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
          images: [getOgImage(DataType.snippets)],
        }}
      />
      <p className="mt-6 mb-12 text-lg text-center">{description}</p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 auto-cols-min">
        {snippets.map(snippet => (
          <SnippetCard key={snippet.slug} snippet={snippet} />
        ))}
      </div>
      <div className="my-12 text-center">{snippets.length} snippets total</div>
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
