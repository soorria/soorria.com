import { GetStaticPaths, GetStaticProps } from 'next'
import { MdxRemote } from 'next-mdx-remote/types'
import PostLayout from '@/components/PostLayout'
import { Snippet, SnippetFrontMatter } from '@/types/snippet'
import { hydrate } from '@/lib/mdx-hydrate'
import { getAllFilesFrontMatter, getFileWithMdx } from '@/lib/data'
import { DataType } from '@/types/data'
import editUrl from '@/utils/editUrl'
import { NextSeo } from 'next-seo'
import useTrackHit from '@/hooks/useTrackHit'
import { getOgImage } from '@/utils/og'

interface SnippetPageProps {
  snippet: SnippetFrontMatter
  mdx: MdxRemote.Source
}

const SnippetPage: React.FC<SnippetPageProps> = ({ snippet, mdx }) => {
  const content = hydrate(mdx)
  const url = `https://mooth.tech/snippets/${snippet.slug}`
  const title = `${snippet.title} snippet`

  useTrackHit('snippets', snippet.slug)

  return (
    <PostLayout title={snippet.title}>
      <NextSeo
        title={title}
        description={snippet.short_description}
        canonical={url}
        openGraph={{
          url,
          title,
          description: snippet.short_description,
          type: 'article',
          article: {
            tags: [snippet.category, ...snippet.tags],
            section: 'Snippets',
            authors: ['Soorria Saruva'],
            publishedTime: new Date(snippet.created_at).toISOString(),
            modifiedTime: new Date(snippet.updated_at).toISOString(),
          },
          images: [getOgImage(DataType.snippets, title)],
        }}
      />
      <div className="mx-auto mt-6 prose md:prose-lg">
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
  const { mdxSource, ...snippet } = await getFileWithMdx<Snippet>(DataType.snippets, slug)

  return {
    props: { snippet, mdx: mdxSource },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snippets = await getAllFilesFrontMatter<SnippetFrontMatter>(DataType.snippets)

  return {
    paths: snippets.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}
