import type { BlogPost, BlogPostFrontMatter } from '~/types/blog-post'
import PostLayout, { PostBottomSection } from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter, getFileWithMdx } from '~/lib/data'
import { DataType } from '~/types/data'
import { getOgImageForData } from '~/utils/og'
import { Mdx } from '~/lib/mdx'
import { PUBLIC_URL } from '~/constants'
import { renderIcon, SpinningIconDivider } from '~/components/posts/SpinningIconDivider'
import { BookIcon, ClockIconSolid, EditIcon, GlobeAuIcon, TextIcon } from '~/components/icons'
import { formatDate } from '~/utils/date'
import cx from '~/utils/cx'
import PostGithubLinks from '~/components/posts/PostGithubLinks'
import { categoryLowerCaseToIcon } from '~/components/categories'
import Image from 'next/image'
import { Metadata } from 'next'

type PostPageProps = {
  params: { slug: string }
}

export const generateStaticParams = async () => {
  const posts = await getAllFilesFrontMatter<BlogPostFrontMatter>(DataType.blog)

  return posts.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async ({ params }: PostPageProps): Promise<Metadata> => {
  const post = await getFileWithMdx<BlogPost>(DataType.blog, params.slug)

  const url = `${PUBLIC_URL}/posts/${post.slug}`
  const title = `${post.title} | Blog`
  return {
    title,
    description: post.shortDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title,
      description: post.shortDescription,
      type: 'article',
      tags: [post.category, ...post.tags],
      section: 'Blog',
      authors: ['Soorria Saruva'],
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt || post.createdAt).toISOString(),
      images: [getOgImageForData(DataType.blog, post.title)],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@soorria',
      description: post.shortDescription,
      title,
      site: '@soorria',
      images: [getOgImageForData(DataType.blog, post.title)],
    },
  }
}

const SCROLL_VAR = '--scroll'
const PostPage = async (props: PostPageProps) => {
  const { code, ...post } = await getFileWithMdx<BlogPost>(DataType.blog, props.params.slug)

  const icon =
    (post.category && categoryLowerCaseToIcon[post.category.toLowerCase()]) || GlobeAuIcon

  const ogImageData = getOgImageForData(DataType.blog, post.title, post.ogImageTitleParts)

  return (
    <PostLayout title={post.title}>
      <SpinningIconDivider scrollVar={SCROLL_VAR} icon={renderIcon(icon, SCROLL_VAR)} />

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

      <div className="prose mx-auto mt-6 md:prose-lg md:mt-16">
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

        <Mdx code={code} />

        <PostBottomSection>
          <PostGithubLinks dataType={DataType.blog} slug={post.slug} />
        </PostBottomSection>
      </div>
    </PostLayout>
  )
}

export default PostPage
