import { GetStaticPaths, GetStaticProps } from 'next'
import { MdxRemote } from 'next-mdx-remote/types'
import PostLayout from 'src/components/PostLayout'
import { Snippet } from 'src/types/snippet'
import gqlFetch from 'src/utils/gqlFetch'
import { hydrate } from 'src/utils/mdx-hydrate'
import { render } from 'src/utils/mdx-render'

interface SnippetPageProps {
  snippet: Omit<Snippet, 'mdSource'>
  mdx: MdxRemote.Source
}

const SnippetPage: React.FC<SnippetPageProps> = ({ snippet, mdx }) => {
  const content = hydrate(mdx)

  return (
    <PostLayout title={snippet.title}>
      <div className="mx-auto prose md:prose-lg">{content}</div>
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

  const data = await gqlFetch<{ snippet: Snippet }>(
    'https://snippetsapi.mooth.tech/api/v1/graphql',
    `query Snippet($slug: ID!) {
      snippet(slug: $slug) {
        slug
        title
        short_description
        types
        mdSource
      }
    }
  `,
    { slug }
  )

  const { snippet } = data

  const mdx = await render(snippet.mdSource)

  return {
    props: { snippet, mdx },
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
