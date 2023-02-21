import { createMemo, lazy, Show, VoidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { RouteDataArgs, useParams, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'

import Fragment from '~/components/Fragment'
import PostLayout, { PostBottomSection } from '~/components/layout/PostLayout'
import License from '~/components/License'
import { baseComponents, RenderedMdxComponent } from '~/components/mdx/base'
import PostGithubLinks from '~/components/posts/PostGithubLinks'
import { SpinningIconDivider } from '~/components/posts/SpinningIconDivider'
import { PUBLIC_URL } from '~/constants'
import { categoryLowerCaseToIcon, defaultCategoryIcon } from '~/lib/categories'
import { snippetFrontMatters } from '~/lib/data'
import { formatDate } from '~/utils/date'

const SCROLL_VAR = '--scroll'

export const routeData = ({ params }: RouteDataArgs) => {
  const snippet = createServerData$(
    async ([, slug]) => {
      return snippetFrontMatters.bySlug[slug]
    },
    {
      key: () => ['snippets', params.slug || ''] as const,
    }
  )

  return { snippet }
}

const snippets = Object.fromEntries(
  Object.entries(import.meta.glob('~/data/snippets/*/index.mdx')).map(([key, value]) => [
    key.split('/').at(-2) || '',
    value,
  ])
) as Record<string, () => Promise<{ default: RenderedMdxComponent }>>

const SnippetPage: VoidComponent = () => {
  const { snippet } = useRouteData<typeof routeData>()
  const params = useParams()
  const url = () => `${PUBLIC_URL}/snippets/${snippet()?.slug}`
  const SEOTitle = () => `${snippet()?.title} | Snippets`

  const component = createMemo(() => {
    const load = snippets[params.slug || '']
    if (!load) return Fragment
    return lazy(load)
  })

  return (
    <Show when={snippet()} keyed>
      {snippet => (
        <PostLayout title={snippet.title ?? ''}>
          {/* <NextSeo
            title={SEOTitle}
            description={snippet.shortDescription}
            canonical={url}
            openGraph={{
              url,
              title: SEOTitle,
              description: snippet.shortDescription,
              type: 'article',
              article: {
                tags: [snippet.category, ...snippet.tags],
                section: 'Snippets',
                authors: ['Soorria Saruva'],
                publishedTime: new Date(snippet.createdAt).toISOString(),
                modifiedTime: new Date(snippet.updatedAt || snippet.createdAt).toISOString(),
              },
              images: [getOgImageForData(DataType.snippets, snippet.title)],
            }}
          /> */}
          <SpinningIconDivider
            scrollVar={SCROLL_VAR}
            icon={
              categoryLowerCaseToIcon[snippet.category.toLowerCase() || ''] || defaultCategoryIcon
            }
          />
          <div class="prose mx-auto mt-6 mb-12 md:prose-lg">
            <Dynamic component={component()} components={baseComponents} />
            <PostBottomSection>
              <div>
                Created {formatDate(snippet.createdAt)}
                {!!snippet.updatedAt && (
                  <>
                    {' • '}Updated {formatDate(snippet.updatedAt)}
                  </>
                )}
              </div>
              <PostGithubLinks dataType="snippets" slug={snippet.slug} />
            </PostBottomSection>
          </div>
          {snippet.notMine || (
            <License
              summary="License &amp; Attribution"
              attribution={{
                url: url(),
                title: snippet.title,
              }}
            />
          )}
        </PostLayout>
      )}
    </Show>
  )
}

export default SnippetPage
