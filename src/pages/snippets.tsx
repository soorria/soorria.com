import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { PostHeading } from '@/components/PostLayout'
import Container from '@/components/Container'
import { SnippetFrontMatter } from '@/types/snippet'
import { getAllFilesFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import SnippetCard from '@/components/SnippetCard'

interface SnippetsPageProps {
  snippets: SnippetFrontMatter[]
}

const description =
  'Little bits of code that I find useful. Mostly written in TypeScript and often for React.'
const title = 'Snippets'
const url = 'https://mooth.tech/snippets'

const SnippetsPage: React.FC<SnippetsPageProps> = ({ snippets }) => {
  return (
    <Container>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{ title, description, type: 'website', url }}
      />
      <div className="py-8">
        <PostHeading>Snippets</PostHeading>
        <p className="mt-6 mb-12 text-lg text-center">{description}</p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 auto-cols-min">
          {snippets.map(snippet => (
            <SnippetCard key={snippet.slug} snippet={snippet} />
          ))}
        </div>
        <div className="my-12 text-center">{snippets.length} snippets total</div>
      </div>
    </Container>
  )
}

export default SnippetsPage

export const getStaticProps: GetStaticProps = async () => {
  const snippets = (
    await getAllFilesFrontMatter<SnippetFrontMatter>(DataType.snippets)
  ).sort((a, b) => (b.created_at > a.created_at ? 1 : b.created_at < a.created_at ? -1 : 0))

  return {
    props: { snippets },
  }
}
