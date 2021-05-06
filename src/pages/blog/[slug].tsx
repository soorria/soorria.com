import { GetStaticPaths, GetStaticProps } from 'next'
import { MdxRemote } from 'next-mdx-remote/types'
import PostLayout from '@/components/PostLayout'
import { Post, PostFrontMatter } from '@/types/post'
import { hydrate } from '@/lib/mdx-hydrate'
import { getAllFilesFrontMatter, getFileWithMdx } from '@/lib/data'
import { DataType } from '@/types/data'
import editUrl from '@/utils/editUrl'
import { NextSeo } from 'next-seo'
import { getOgImage } from '@/utils/og'

interface PostPageProps {
  post: PostFrontMatter
  mdx: MdxRemote.Source
}

const PostPage: React.FC<PostPageProps> = ({ post, mdx }) => {
  const content = hydrate(mdx)
  const url = `https://mooth.tech/posts/${post.slug}`
  const title = `${post.title} | Blog`

  return (
    <PostLayout title={post.title}>
      <NextSeo
        title={title}
        description={post.shortDescription}
        canonical={url}
        openGraph={{
          url,
          title,
          description: post.shortDescription,
          type: 'article',
          article: {
            tags: [post.category, ...post.tags],
            section: 'Blog',
            authors: ['Soorria Saruva'],
            publishedTime: new Date(post.createdAt).toISOString(),
            modifiedTime: new Date(post.updatedAt).toISOString(),
          },
          images: [getOgImage(DataType.blog, post.title)],
        }}
      />
      <div className="mx-auto mt-6 prose md:mt-16 md:prose-lg">
        {content}
        <div className="max-w-xs py-12 mx-auto text-sm text-center">
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
  const { mdxSource, ...snippet } = await getFileWithMdx<Post>(DataType.blog, slug)

  return {
    props: { post: snippet, mdx: mdxSource },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snippets = await (await getAllFilesFrontMatter<PostFrontMatter>(DataType.blog)).filter(
    p => !!p.createdAt
  )

  return {
    paths: snippets.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}
