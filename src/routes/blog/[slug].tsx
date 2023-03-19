import { createMemo, lazy, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { RouteDataArgs, useParams, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'

import Fragment from '~/components/Fragment'
import { BookIcon, ClockIconSolid, EditIcon, GlobeAuIcon, TextIcon } from '~/components/icons'
import PostLayout, { PostBottomSection } from '~/components/layout/PostLayout'
import ProseWrapper from '~/components/layout/ProseWrapper'
import { baseComponents, RenderedMdxComponent } from '~/components/mdx/base'
import PostGithubLinks from '~/components/posts/PostGithubLinks'
import { SpinningIconDivider } from '~/components/posts/SpinningIconDivider'
import { PUBLIC_URL } from '~/constants'
import { blogFrontMatters } from '~/lib/data'
import { Seo } from '~/lib/seo'
import cx from '~/utils/cx'
import { formatDate } from '~/utils/date'
import { getOgImageForData } from '~/utils/og'

const SCROLL_VAR = '--scroll'
export const routeData = ({ params }: RouteDataArgs) => {
  const post = createServerData$(
    async ([, slug]) => {
      return blogFrontMatters.bySlug[slug]
    },
    {
      key: () => ['blog', params.slug || ''] as const,
    }
  )

  return { post }
}

const posts = Object.fromEntries(
  Object.entries(import.meta.glob('~/data/blog/*/index.mdx')).map(([key, value]) => [
    key.split('/').at(-2) || '',
    value,
  ])
) as Record<string, () => Promise<{ default: RenderedMdxComponent }>>

const PostPage = () => {
  const { post } = useRouteData<typeof routeData>()
  const params = useParams()
  const url = () => `${PUBLIC_URL}/posts/${post()?.slug}`
  const SEOTitle = () => `${post()?.title} | Blog`

  const component = createMemo(() => {
    const load = posts[params.slug || '']
    if (!load) return Fragment
    return lazy(load)
  })

  return (
    <Show when={post()} keyed>
      {post => (
        <PostLayout title={post.title}>
          <Seo
            title={SEOTitle()}
            description={post.shortDescription}
            canonical={url()}
            openGraph={{
              url: url(),
              title: SEOTitle(),
              description: post.shortDescription,
              type: 'article',
              article: {
                tags: [post.category, ...post.tags].filter(Boolean),
                section: 'Blog',
                authors: ['Soorria Saruva'],
                publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : 'N/A',
                modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : 'N/A',
              },
              images: [getOgImageForData('blog', post.title)],
            }}
          />

          <SpinningIconDivider scrollVar={SCROLL_VAR} icon={GlobeAuIcon} />

          <div class="grid grid-cols-2 items-center justify-items-center gap-4 text-sm tabular-nums sm:grid-cols-4">
            <div class="tooltip flex items-center space-x-2" aria-label="Reading time">
              <BookIcon class="inline-block h-4 w-4" />
              <span>{post.readingTime}</span>
            </div>

            <div class="tooltip flex items-center space-x-2" aria-label="Word count">
              <TextIcon class="inline-block h-4 w-4" />
              <span>{post.words}</span>
            </div>

            <div
              class={cx(
                'tooltip flex items-center space-x-2',
                post.updatedAt ? '' : 'pointer-events-none opacity-0'
              )}
              aria-label="Updated at"
            >
              <EditIcon class="inline-block h-3 w-3" />
              {post.updatedAt && <span>{formatDate(post.updatedAt)}</span>}
            </div>

            <div class="tooltip flex items-center space-x-2" aria-label="Created at">
              <ClockIconSolid class="inline-block h-4 w-4" />
              {post.createdAt && <span>{formatDate(post.createdAt)}</span>}
            </div>
          </div>

          <ProseWrapper>
            <Dynamic component={component()} components={baseComponents} />

            <PostBottomSection>
              <PostGithubLinks dataType="blog" slug={post.slug} />
            </PostBottomSection>
          </ProseWrapper>
        </PostLayout>
      )}
    </Show>
  )
}

export default PostPage
