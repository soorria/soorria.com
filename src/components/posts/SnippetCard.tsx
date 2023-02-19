import { Show, VoidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { ClockIconSolid, EditIcon } from '~/components/icons'
import { categoryLowerCaseToIcon, defaultCategoryIcon } from '~/lib/categories'
import type { SnippetFrontMatter } from '~/types/snippet'
import { formatDate } from '~/utils/date'

import PostListItemLink from './PostListItemLink'

const SnippetCard: VoidComponent<{ snippet: SnippetFrontMatter }> = props => {
  const icon = () =>
    categoryLowerCaseToIcon[props.snippet.category.toLowerCase()] || defaultCategoryIcon
  return (
    <PostListItemLink href={`/snippets/${props.snippet.slug}`}>
      <div class="absolute inset-0 flex items-center text-drac-highlight text-opacity-20">
        <div class="h-48 w-48 -translate-x-6 scale-110 group-hocus:-rotate-20 group-hocus:scale-125 motion-safe:transition-transform">
          <Dynamic component={icon()} />
        </div>
      </div>
      <div class="relative z-10 flex h-full flex-col space-y-3">
        <div class="font-display text-xl font-bold text-drac-pink group-hover:underline">
          {props.snippet.title}
        </div>
        <div class="min-h-[3rem] flex-1">{props.snippet.shortDescription}</div>
        <div class="flex items-center justify-between text-sm tabular-nums">
          <div class="tooltip flex items-center space-x-2" aria-label="Created at">
            <ClockIconSolid role="presentation" class="inline-block h-4 w-4" />
            <span>{formatDate(props.snippet.createdAt)}</span>
          </div>
          <Show
            when={props.snippet.updatedAt && props.snippet.createdAt !== props.snippet.updatedAt}
          >
            <div class="tooltip flex items-center space-x-2" aria-label="Updated at">
              <EditIcon role="presentation" class="inline-block h-4 w-4" />
              <span>{formatDate(props.snippet.updatedAt!)}</span>
            </div>
          </Show>
        </div>
      </div>
    </PostListItemLink>
  )
}

export default SnippetCard
