import type { GetStaticPaths, GetStaticProps } from 'next'
import type { BlogPost, BlogPostFrontMatter } from '~/types/blog-post'
import PostLayout, { PostBottomSection } from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter, getFileWithMdx } from '~/lib/data'
import { DataType } from '~/types/data'
import { NextSeo } from 'next-seo'
import { getOgImageForData, getOgUrl } from '~/utils/og'
import { filterUnpublished } from '~/utils/content'
import { useMdxComponent } from '~/lib/mdx'
import { PUBLIC_URL } from '~/constants'
import { SpinningIconDivider } from '~/components/posts/SpinningIconDivider'
import { BookIcon, ClockIconSolid, EditIcon, GlobeAuIcon, TextIcon } from '~/components/icons'
import { formatDate } from '~/utils/date'
import cx from '~/utils/cx'
import PostGithubLinks from '~/components/posts/PostGithubLinks'
import { categoryLowerCaseToIcon } from '~/components/categories'
import Image from 'next/image'

interface PostPageProps {
  post: BlogPostFrontMatter
  mdx: string
}

const SCROLL_VAR = '--scroll'
const PostPage: React.FC<PostPageProps> = ({ post, mdx }) => {
  const url = `${PUBLIC_URL}/posts/${post.slug}`
  const SEOTitle = `${post.title} | Blog`
  const Content = useMdxComponent(mdx)

  const icon =
    (post.category && categoryLowerCaseToIcon[post.category.toLowerCase()]) || GlobeAuIcon

  const ogImageData = getOgImageForData(DataType.blog, post.title, post.ogImageTitleParts)

  return (
    <PostLayout title={post.title}>
      <NextSeo
        title={SEOTitle}
        description={post.shortDescription}
        canonical={url}
        openGraph={{
          url,
          title: SEOTitle,
          description: post.shortDescription,
          type: 'article',
          article: {
            tags: [post.category, ...post.tags],
            section: 'Blog',
            authors: ['Soorria Saruva'],
            publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : 'N/A',
            modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : 'N/A',
          },
          images: [ogImageData],
        }}
      />

      <SpinningIconDivider scrollVar={SCROLL_VAR} icon={icon} />

      <div className="grid grid-cols-2 items-center justify-items-center gap-4 text-sm tabular-nums sm:grid-cols-4">
        <div className="tooltip flex items-center space-x-2" aria-label="Reading time">
          <BookIcon className="inline-block h-4 w-4" />
          <span>{post.readingTime}</span>
        </div>

        <div className="tooltip flex items-center space-x-2" aria-label="Word count">
          <TextIcon className="inline-block h-4 w-4" />
          <span>{post.words}</span>
        </div>

        <div
          className={cx(
            'tooltip flex items-center space-x-2',
            post.updatedAt ? '' : 'pointer-events-none opacity-0'
          )}
          aria-label="Updated at"
        >
          <EditIcon className="inline-block h-3 w-3" />
          <span suppressHydrationWarning>{formatDate(post.updatedAt)}</span>
        </div>

        <div className="tooltip flex items-center space-x-2" aria-label="Created at">
          <ClockIconSolid className="inline-block h-4 w-4" />
          <span suppressHydrationWarning>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      <div className="prose mx-auto mt-6 md:mt-16 md:prose-lg">
        {process.env.NODE_ENV !== 'production' && (
          <details>
            <summary>OG Image</summary>
            <Image
              src={ogImageData.url.replace('https://soorria.com', 'http://localhost:3000')}
              width={1200}
              height={630}
              alt=""
              id="__dev_og_image__"
            />
          </details>
        )}

        <Content />
        <PostBottomSection>
          <PostGithubLinks dataType={DataType.blog} slug={post.slug} />
        </PostBottomSection>
      </div>
    </PostLayout>
  )
}

export default PostPage

export const getStaticProps: GetStaticProps<PostPageProps, { slug: string }> = async ({
  params,
}) => {
  // For some reason, this function gets called with '<no source>' as the slug
  // even in production.
  if (!params?.slug || params.slug === '<no source>') {
    return { notFound: true }
  }

  const { slug } = params
  const { code, ...snippet } = await getFileWithMdx<BlogPost>(DataType.blog, slug)

  return {
    props: { post: snippet, mdx: code },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snippets = filterUnpublished(
    await getAllFilesFrontMatter<BlogPostFrontMatter>(DataType.blog)
  )

  return {
    paths: snippets.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}
