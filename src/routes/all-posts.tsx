import { For, VoidComponent } from 'solid-js'
import { useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'

import PostLayout from '~/components/layout/PostLayout'
import BlogPostCard from '~/components/posts/BlogPostCard'
import SnippetCard from '~/components/posts/SnippetCard'
import { PUBLIC_URL } from '~/constants'
import { blogFrontMatters, snippetFrontMatters } from '~/lib/data'
import { blogPostFilter, sortByCreatedAtField } from '~/utils/content'

const description = "All the stuff I've written on this site"
const title = 'All Posts'
const url = `${PUBLIC_URL}/all-posts`

const SnippetsPage: VoidComponent = () => {
  const { posts } = useRouteData<typeof routeData>()
  return (
    <PostLayout title="All Posts">
      {/* <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title,
          description,
          type: 'website',
          url,
          images: [getOgImageForData(DataType.snippets)],
        }}
      /> */}
      <p class="mt-6 mb-12 text-center text-lg">{description}</p>
      <div class="grid auto-cols-min grid-flow-dense grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 sm:gap-x-8 lg:gap-12">
        <For each={posts()}>
          {p => {
            return p.type === 'snippets' ? (
              <SnippetCard snippet={p} />
            ) : (
              <div class="grid sm:col-span-2">
                <BlogPostCard post={p} />
              </div>
            )
          }}
        </For>
      </div>
      <div class="my-12 text-center">{posts()?.length} posts total</div>
    </PostLayout>
  )
}

export default SnippetsPage

export const routeData = () => {
  const posts = createServerData$(async () => {
    const posts = sortByCreatedAtField([
      ...snippetFrontMatters.list.map(s => ({ ...s, type: 'snippets' } as const)),
      ...blogPostFilter(blogFrontMatters.list).map(p => ({ ...p, type: 'blog' } as const)),
    ])

    return posts
  })

  return {
    posts,
  }
}
