import type { BlogPost, BlogPostFrontMatter } from '~/types/blog-post'
import PostLayout, { PostBottomSection } from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter, getFileForMdx } from '~/lib/data'
import { getOgImageForData } from '~/utils/og'
import { PUBLIC_URL } from '~/constants'
import { SpinningIconDivider } from '~/components/posts/SpinningIconDivider'
import { BookIcon, ClockIconSolid, EditIcon, GlobeAuIcon, TextIcon } from '~/components/icons'
import { formatDate } from '~/utils/date'
import cx from '~/utils/cx'
import PostGithubLinks from '~/components/posts/PostGithubLinks'
import { categoryLowerCaseToIcon } from '~/components/categories'
import type { Metadata } from 'next'
import ProseWrapper from '~/components/posts/ProseWrapper'
import MdxRenderer from '~/components/mdx/MdxRenderer'
import { ignoreError } from '~/utils/misc'
import { notFound } from 'next/navigation'

type PostPageProps = {
  params: { slug: string }
}

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const posts = await getAllFilesFrontMatter<BlogPostFrontMatter>('blog')

  return posts.filter(p => !!p.createdAt).map(({ slug }) => ({ slug }))
}

export const generateMetadata = async ({ params }: PostPageProps): Promise<Metadata> => {
  const post = await ignoreError(getFileForMdx<BlogPost>('blog', params.slug))
  if (!post) return {}

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
      modifiedTime: new Date(post.updatedAt || post.createdAt || 0).toISOString(),
      images: [getOgImageForData('blog', post.title)],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@soorriously',
      description: post.shortDescription,
      title,
      site: '@soorriously',
      images: [getOgImageForData('blog', post.title)],
    },
  }
}

const SCROLL_VAR = '--scroll'
const PostPage = async (props: PostPageProps) => {
  const data = await ignoreError(getFileForMdx<BlogPost>('blog', props.params.slug))

  if (!data) {
    return notFound()
  }

  const { code: code, ...post } = data

  const icon =
    (post.category && categoryLowerCaseToIcon[post.category.toLowerCase()]) || GlobeAuIcon

  return (
    <PostLayout title={post.title}>
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

      <ProseWrapper>
        <MdxRenderer code={code} type="blog" slug={post.slug} />

        <PostBottomSection>
          <PostGithubLinks dataType={'blog'} slug={post.slug} />
        </PostBottomSection>
      </ProseWrapper>
    </PostLayout>
  )
}

export default PostPage
