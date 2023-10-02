import type { Snippet, SnippetFrontMatter } from '~/types/snippet'
import PostLayout, { PostBottomSection } from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter, getFileForMdx } from '~/lib/data'
import { categoryLowerCaseToIcon, defaultCategoryIcon } from '~/components/categories'
import { formatDate } from '~/utils/date'
import { PUBLIC_URL } from '~/constants'
import { SpinningIconDivider } from '~/components/posts/SpinningIconDivider'
import PostGithubLinks from '~/components/posts/PostGithubLinks'
import type { Metadata } from 'next'
import { getOgImageForData } from '~/utils/og'
import ProseWrapper from '~/components/posts/ProseWrapper'
import MdxRenderer from '~/components/mdx/MdxRenderer'
import { ignoreError } from '~/utils/misc'
import { notFound } from 'next/navigation'

const SCROLL_VAR = '--scroll'
type SnippetPageProps = {
  params: { slug: string }
}

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const snippets = await getAllFilesFrontMatter<SnippetFrontMatter>('snippets')

  return snippets.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async ({ params }: SnippetPageProps): Promise<Metadata> => {
  const snippet = await ignoreError(getFileForMdx<Snippet>('snippets', params.slug))
  if (!snippet) return {}

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
      images: [getOgImageForData('snippets', snippet.title, snippet.ogImageTitleParts)],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@soorriously',
      description: snippet.shortDescription,
      title,
      site: '@soorriously',
      images: [getOgImageForData('snippets', snippet.title, snippet.ogImageTitleParts)],
    },
  }
}

const SnippetPage = async ({ params }: SnippetPageProps) => {
  const data = await ignoreError(getFileForMdx<Snippet>('snippets', params.slug))

  if (!data) notFound()

  const { code, ...snippet } = data

  return (
    <PostLayout title={snippet.title}>
      <SpinningIconDivider
        scrollVar={SCROLL_VAR}
        icon={categoryLowerCaseToIcon[snippet.category.toLowerCase()] || defaultCategoryIcon}
      />
      <ProseWrapper>
        <MdxRenderer code={code} type="snippets" slug={snippet.slug} />
        <PostBottomSection>
          <div suppressHydrationWarning>
            Created {formatDate(snippet.createdAt)}
            {!!snippet.updatedAt && (
              <>
                {' • '}Updated {formatDate(snippet.updatedAt)}
              </>
            )}
          </div>
          <PostGithubLinks dataType={'snippets'} slug={snippet.slug} />
        </PostBottomSection>
      </ProseWrapper>
    </PostLayout>
  )
}

export default SnippetPage
