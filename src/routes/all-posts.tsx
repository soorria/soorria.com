import type { SnippetFrontMatter } from '~/types/snippet'
import { getAllFilesFrontMatter } from '~/lib/data'
import { DataType } from '~/types/data'
import SnippetCard from '~/components/posts/SnippetCard'
import BlogPostCard from '~/components/posts/BlogPostCard'
import { getOgImageForData } from '~/utils/og'
import { blogPostFilter, sortByCreatedAtField } from '~/utils/content'
import { PUBLIC_URL } from '~/constants'
import type { BlogPostFrontMatter } from '~/types/blog-post'
import { For, VoidComponent } from 'solid-js'
import { useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import PostLayout from '~/components/layout/PostLayout'

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
            const key = `${p.type}/${p.slug}`

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
    const [snippets, blogPosts] = await Promise.all([
      getAllFilesFrontMatter<SnippetFrontMatter>('snippets'),
      getAllFilesFrontMatter<BlogPostFrontMatter>('blog'),
    ])

    const posts = sortByCreatedAtField([
      ...snippets.map(s => ({ ...s, type: 'snippets' } as const)),
      ...blogPostFilter(blogPosts).map(p => ({ ...p, type: 'blog' } as const)),
    ])

    return posts
  })

  return {
    posts,
  }
}
