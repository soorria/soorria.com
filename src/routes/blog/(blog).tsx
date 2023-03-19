import { For } from 'solid-js'
import { useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'

import MainLayout from '~/components/layout/MainLayout'
import { PostHeading } from '~/components/layout/PostLayout'
import PostCard from '~/components/posts/BlogPostCard'
import { PUBLIC_URL } from '~/constants'
import { blogFrontMatters } from '~/lib/data'
import { Seo } from '~/lib/seo'
import { blogPostFilter, sortByCreatedAtField } from '~/utils/content'
import { getOgImageForData } from '~/utils/og'

const description =
  'Attempts at writing about things that I think are interesting, useful, or just cool'
const title = 'Blog'
const url = `${PUBLIC_URL}/blog`

const PostsPage = () => {
  const { posts } = useRouteData<typeof routeData>()
  return (
    <MainLayout>
      <Seo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title,
          description,
          type: 'website',
          url,
          images: [getOgImageForData('blog')],
        }}
      />
      <PostHeading>{title}</PostHeading>
      <p class="mt-6 mb-12 text-center text-lg">{description}</p>
      <div class="grid grid-cols-1 gap-8">
        <For each={posts()}>{post => <PostCard post={post} />}</For>
      </div>
      <div class="my-12 text-center">{posts()?.length} ramblings total</div>
    </MainLayout>
  )
}

export default PostsPage

export const routeData = () => {
  const posts = createServerData$(async () => {
    return blogPostFilter(sortByCreatedAtField(blogFrontMatters.list))
  })

  return {
    posts,
  }
}
