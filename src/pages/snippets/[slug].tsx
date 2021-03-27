import { GetStaticPaths, GetStaticProps } from 'next'
import { MdxRemote } from 'next-mdx-remote/types'
import PostLayout from '@/components/PostLayout'
import { Snippet, SnippetFrontMatter } from '@/types/snippet'
import gqlFetch from '@/utils/gqlFetch'
import { hydrate } from '@/lib/mdx-hydrate'
import { getFile } from '@/lib/data'
import { DataType } from '@/types/data'
import editUrl from '@/utils/editUrl'

interface SnippetPageProps {
  snippet: SnippetFrontMatter
  mdx: MdxRemote.Source
}

const SnippetPage: React.FC<SnippetPageProps> = ({ snippet, mdx }) => {
  const content = hydrate(mdx)

  return (
    <PostLayout title={snippet.title}>
      <div className="mx-auto prose md:prose-lg">
        {content}
        <div className="max-w-xs mx-auto my-12 text-sm text-center">
          Found a mistake, or want to suggest an improvement? Edit on GitHub{' '}
          <a
            href={editUrl(DataType.snippets, snippet.slug)}
            rel="noopenner noreferrer"
            target="_blank"
          >
            here
          </a>
        </div>
      </div>
    </PostLayout>
  )
}

export default SnippetPage

export const getStaticProps: GetStaticProps<SnippetPageProps, { slug: string }> = async ({
  params,
}) => {
  // For some reason, this function gets called with '<no source>' as the slug
  // even in production.
  if (!params?.slug || params.slug === '<no source>') {
    return { notFound: true }
  }

  const { slug } = params
  const { mdxSource, ...snippet } = await getFile<Snippet>(DataType.snippets, slug)

  return {
    props: { snippet, mdx: mdxSource },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { snippets } = await gqlFetch<{ snippets: { slug: string }[] }>(
    'http://snippetsapi.mooth.tech/api/v1/graphql',
    `query {
      snippets {
        slug
      }
    }`,
    {}
  )

  return {
    paths: snippets.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}
