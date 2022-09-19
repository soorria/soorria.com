import type { GetStaticProps } from 'next'
import type { PostFrontMatter } from '@/types/post'
import { NextSeo } from 'next-seo'
import { PostHeading } from '@/components/PostLayout'
import { getAllFilesFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import PostCard from '@/components/PostCard'
import MainLayout from '@/components/MainLayout'
import { getOgImageForData } from '@/utils/og'
import { filterUnpublished, sortByCreatedAtField } from '@/utils/content'
import { PUBLIC_URL } from '@/constants'

interface PostsPageProps {
  posts: PostFrontMatter[]
}

const description = 'Longer written things'
const title = 'Posts'
const url = `${PUBLIC_URL}/blog`

const PostsPage: React.FC<PostsPageProps> = ({ posts }) => {
  return (
    <MainLayout>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title,
          description,
          type: 'website',
          url,
          images: [getOgImageForData(DataType.blog)],
        }}
      />
      <PostHeading>Blog</PostHeading>
      <p className="mt-6 mb-12 text-center text-lg">{description}</p>
      <div className="grid grid-cols-1 gap-8">
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="my-12 text-center">{posts.length} ramblings total</div>
    </MainLayout>
  )
}

export default PostsPage

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterUnpublished(
    sortByCreatedAtField(await getAllFilesFrontMatter<PostFrontMatter>(DataType.blog))
  )

  return {
    props: { posts },
  }
}
