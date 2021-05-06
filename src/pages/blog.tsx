import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { PostHeading } from '@/components/PostLayout'
import { PostFrontMatter } from '@/types/post'
import { getAllFilesFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import PostCard from '@/components/PostCard'
import MainLayout from '@/components/MainLayout'
import { getOgImage } from '@/utils/og'
import { filterUnpublished, sortByCreatedAtField } from '@/utils/content'

interface PostsPageProps {
  posts: PostFrontMatter[]
}

const description = 'Written things'
const title = 'Posts'
const url = 'https://mooth.tech/blog'

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
          images: [getOgImage(DataType.blog)],
        }}
      />
      <PostHeading>Blog</PostHeading>
      <p className="mt-6 mb-12 text-lg text-center">{description}</p>
      <div className="grid grid-cols-1 gap-8">
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
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
