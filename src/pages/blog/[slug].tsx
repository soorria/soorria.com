import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Post, PostFrontMatter } from '@/types/post'
import PostLayout from '@/components/PostLayout'
import { getAllFilesFrontMatter, getFileWithMdx } from '@/lib/data'
import { DataType } from '@/types/data'
import { editUrl } from '@/utils/repo'
import { NextSeo } from 'next-seo'
import { getOgImageForData } from '@/utils/og'
import { filterUnpublished } from '@/utils/content'
import { useMdxComponent } from '@/lib/mdx'
import { PUBLIC_URL } from '@/constants'
import { SpinningIconDivider } from '@/components/posts/SpinningIconDivider'
import { defaultCategoryIcon } from '@/components/categories'
import { BookIcon, ClockIconSolid, EditIcon, TextIcon } from '@/components/icons'
import { formatDate } from '@/utils/date'
import cx from '@/utils/cx'

interface PostPageProps {
  post: PostFrontMatter
  mdx: string
}

const SCROLL_VAR = '--scroll'
const PostPage: React.FC<PostPageProps> = ({ post, mdx }) => {
  const url = `${PUBLIC_URL}/posts/${post.slug}`
  const SEOTitle = `${post.title} | Blog`
  const Content = useMdxComponent(mdx)

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
          images: [getOgImageForData(DataType.blog, post.title)],
        }}
      />

      <SpinningIconDivider scrollVar={SCROLL_VAR} icon={defaultCategoryIcon} />

      <div className="grid grid-cols-2 items-center justify-items-center gap-4 text-sm sm:grid-cols-4">
        <div className="flex items-center space-x-2">
          <BookIcon className="inline-block h-4 w-4" />
          <span>{post.readingTime}</span>
        </div>

        <div className="flex items-center space-x-2">
          <TextIcon className="inline-block h-4 w-4" />
          <span>{post.words}</span>
        </div>

        <div
          className={cx(
            'flex items-center space-x-2',
            post.updatedAt ? '' : 'pointer-events-none opacity-0'
          )}
        >
          <EditIcon className="inline-block h-3 w-3" />
          <span>{post.updatedAt ? formatDate(post.updatedAt) : 'UNCHANGED'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <ClockIconSolid className="inline-block h-4 w-4" />
          <span>{post.createdAt ? formatDate(post.createdAt) : 'UNPUBLISHED'}</span>
        </div>
      </div>

      <div className="prose mx-auto mt-6 md:prose-lg md:mt-16">
        <Content />
        <div className="mx-auto max-w-xs py-12 text-center text-sm">
          Found a mistake, or want to suggest an improvement? Edit on GitHub{' '}
          <a href={editUrl(DataType.blog, post.slug)} rel="noopenner noreferrer" target="_blank">
            here
          </a>
        </div>
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
  const { code, ...snippet } = await getFileWithMdx<Post>(DataType.blog, slug)

  return {
    props: { post: snippet, mdx: code },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snippets = filterUnpublished(await getAllFilesFrontMatter<PostFrontMatter>(DataType.blog))

  return {
    paths: snippets.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}
