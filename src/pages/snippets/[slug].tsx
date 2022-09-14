import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Snippet, SnippetFrontMatter } from '@/types/snippet'
import PostLayout, { PostBottomSection } from '@/components/PostLayout'
import { getAllFilesFrontMatter, getFileWithMdx } from '@/lib/data'
import { DataType } from '@/types/data'
import { editUrl, historyUrl } from '@/utils/repo'
import { NextSeo } from 'next-seo'
import { getOgImageForData } from '@/utils/og'
import { useMdxComponent } from '@/lib/mdx'
import { categoryLowerCaseToIcon, defaultCategoryIcon } from '@/components/categories'
import { formatDate } from '@/utils/date'
import { useScrollCssVar } from '@/utils/use-scroll-css-var'
import { PUBLIC_URL } from '@/constants'
import License from '@/components/License'

const SCROLL_VAR = '--scroll'
const CategoryIconDivider: React.FC<{ category: string }> = ({ category }) => {
  useScrollCssVar(SCROLL_VAR)

  const Icon = categoryLowerCaseToIcon[category.toLowerCase()] || defaultCategoryIcon

  const line = (
    <div role="presentation" className="flex items-center opacity-50">
      <div className="h-px flex-1 bg-current" />
    </div>
  )

  return (
    <div
      className="grid gap-4 pb-6 text-center text-drac-highlight"
      style={{ gridTemplateColumns: '1fr auto 1fr' }}
    >
      {line}
      <Icon
        className="inline-block h-6 w-6 transition-transform"
        style={{
          transform: `rotate(calc(var(${SCROLL_VAR}) * 2 * 360deg))`,
        }}
      />
      {line}
    </div>
  )
}
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
      <CategoryIconDivider category={snippet.category} />
      <div className="prose mx-auto mt-6 mb-12 md:prose-lg">
        <Content />
        <PostBottomSection>
          <div suppressHydrationWarning>
            Created {formatDate(snippet.createdAt)}
            {!!snippet.updatedAt && ` • Updated ${formatDate(snippet.updatedAt)}`}
          </div>
          <div>
            Found a mistake, or want to suggest an improvement? Edit on GitHub{' '}
            <a
              href={editUrl(DataType.snippets, snippet.slug)}
              className="focus-ring -mx-1 rounded px-1"
              rel="noopenner noreferrer"
              target="_blank"
            >
              here
            </a>
            <br />
            and see edit history{' '}
            <a
              href={historyUrl(DataType.snippets, snippet.slug)}
              className="focus-ring -mx-1 rounded px-1"
              rel="noopenner noreferrer"
              target="_blank"
            >
              here
            </a>
          </div>
        </PostBottomSection>
      </div>
      <License
        summary="License &amp; Attribution"
        attribution={{
          url,
          title: snippet.title,
        }}
      />
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
