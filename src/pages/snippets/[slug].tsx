import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Snippet, SnippetFrontMatter } from '~/types/snippet'
import PostLayout, { PostBottomSection } from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter, getFileWithMdx } from '~/lib/data'
import { DataType } from '~/types/data'
import { NextSeo } from 'next-seo'
import { getOgImageForData } from '~/utils/og'
import { useMdxComponent } from '~/lib/mdx'
import { categoryLowerCaseToIcon, defaultCategoryIcon } from '~/components/categories'
import { formatDate } from '~/utils/date'
import { PUBLIC_URL } from '~/constants'
import License from '~/components/License'
import { SpinningIconDivider } from '~/components/posts/SpinningIconDivider'
import PostGithubLinks from '~/components/posts/PostGithubLinks'

const SCROLL_VAR = '--scroll'
interface SnippetPageProps {
  snippet: SnippetFrontMatter
  mdx: string
}

const SnippetPage: React.FC<SnippetPageProps> = ({ snippet, mdx }) => {
  const url = `${PUBLIC_URL}/snippets/${snippet.slug}`
  const SEOTitle = `${snippet.title} | Snippets`
  const Content = useMdxComponent(mdx)

  return (
    <PostLayout title={snippet.title}>
      <NextSeo
        title={SEOTitle}
        description={snippet.shortDescription}
        canonical={url}
        openGraph={{
          url,
          title: SEOTitle,
          description: snippet.shortDescription,
          type: 'article',
          article: {
            tags: [snippet.category, ...snippet.tags],
            section: 'Snippets',
            authors: ['Soorria Saruva'],
            publishedTime: new Date(snippet.createdAt).toISOString(),
            modifiedTime: new Date(snippet.updatedAt || snippet.createdAt).toISOString(),
          },
          images: [getOgImageForData(DataType.snippets, snippet.title)],
        }}
      />
      <SpinningIconDivider
        scrollVar={SCROLL_VAR}
        icon={categoryLowerCaseToIcon[snippet.category.toLowerCase()] || defaultCategoryIcon}
      />
      <div className="prose mx-auto mt-6 mb-12 md:prose-lg">
        <Content />
        <PostBottomSection>
          <div suppressHydrationWarning>
            Created {formatDate(snippet.createdAt)}
            {!!snippet.updatedAt && (
              <>
                {' • '}Updated {formatDate(snippet.updatedAt)}
              </>
            )}
          </div>
          <PostGithubLinks dataType={DataType.snippets} slug={snippet.slug} />
        </PostBottomSection>
      </div>
      {/* {snippet.notMine || (
        <License
          summary="License &amp; Attribution"
          attribution={{
            url,
            title: snippet.title,
          }}
        />
      )} */}
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
  const { code, ...snippet } = await getFileWithMdx<Snippet>(DataType.snippets, slug)

  return {
    props: { snippet, mdx: code },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snippets = await getAllFilesFrontMatter<SnippetFrontMatter>(DataType.snippets)

  return {
    paths: snippets.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}
