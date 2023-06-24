import type { Snippet, SnippetFrontMatter } from '~/types/snippet'
import PostLayout, { PostBottomSection } from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter, getFileWithMdx } from '~/lib/data'
import { DataType } from '~/types/data'
import { Mdx } from '~/lib/mdx'
import { categoryLowerCaseToIcon, defaultCategoryIcon } from '~/components/categories'
import { formatDate } from '~/utils/date'
import { PUBLIC_URL } from '~/constants'
import { SpinningIconDivider, renderIcon } from '~/components/posts/SpinningIconDivider'
import PostGithubLinks from '~/components/posts/PostGithubLinks'
import { Metadata } from 'next'
import { getOgImageForData } from '~/utils/og'
import ProseWrapper from '~/components/posts/ProseWrapper'

const SCROLL_VAR = '--scroll'
type SnippetPageProps = {
  params: { slug: string }
}

export const generateStaticParams = async () => {
  const snippets = await getAllFilesFrontMatter<SnippetFrontMatter>(DataType.snippets)

  return snippets.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async ({ params }: SnippetPageProps): Promise<Metadata> => {
  const snippet = await getFileWithMdx<Snippet>(DataType.snippets, params.slug)

  const url = `${PUBLIC_URL}/snippets/${snippet.slug}`
  const title = `${snippet.title} | Snippets`
  return {
    title,
    description: snippet.shortDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title,
      description: snippet.shortDescription,
      type: 'article',
      tags: [snippet.category, ...snippet.tags],
      section: 'Snippets',
      authors: ['Soorria Saruva'],
      publishedTime: new Date(snippet.createdAt).toISOString(),
      modifiedTime: new Date(snippet.updatedAt || snippet.createdAt).toISOString(),
      images: [getOgImageForData(DataType.snippets, snippet.title)],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@soorria',
      description: snippet.shortDescription,
      title,
      site: '@soorria',
      images: [getOgImageForData(DataType.snippets, snippet.title)],
    },
  }
}

const SnippetPage = async ({ params }: SnippetPageProps) => {
  const { code, ...snippet } = await getFileWithMdx<Snippet>(DataType.snippets, params.slug)

  return (
    <PostLayout title={snippet.title}>
      <SpinningIconDivider
        scrollVar={SCROLL_VAR}
        icon={renderIcon(
          categoryLowerCaseToIcon[snippet.category.toLowerCase()] || defaultCategoryIcon,
          SCROLL_VAR
        )}
      />
      <ProseWrapper>
        <Mdx code={code} />
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
      </ProseWrapper>
    </PostLayout>
  )
}

export default SnippetPage
