import { Show, VoidComponent } from 'solid-js'

import { BookIcon, ClockIconSolid, EditIcon, TextIcon } from '~/components/icons'
import type { BlogPostFrontMatter } from '~/types/blog-post'
import { formatDate } from '~/utils/date'

import PostListItemLink from './PostListItemLink'

const BlogPostCard: VoidComponent<{ post: BlogPostFrontMatter }> = props => (
  <PostListItemLink href={`/blog/${props.post.slug}`}>
    <div class="relative z-10 flex h-full flex-col space-y-4">
      <div class="font-display text-2xl font-bold text-drac-pink group-hover:underline sm:text-2xl">
        {props.post.title}
      </div>
      <div class="flex-1 text-base">{props.post.shortDescription}</div>
      <hr class="my-2 border-drac-content/10" />
      <div class="grid grid-cols-2 items-center justify-items-center gap-4 text-sm tabular-nums sm:grid-cols-4">
        <div class="tooltip flex items-center space-x-2" aria-label="Reading time">
          <BookIcon role="presentation" class="inline-block h-3 w-3" />
          <span>{props.post.readingTime}</span>
        </div>

        <div class="tooltip flex items-center space-x-2" aria-label="Word count">
          <TextIcon role="presentation" class="inline-block h-3 w-3" />
          <span>{props.post.words}</span>
        </div>

        <Show when={props.post.updatedAt} keyed>
          {time => (
            <div class="tooltip flex items-center space-x-2" aria-label="Updated at">
              <EditIcon role="presentation" class="inline-block h-3 w-3" />
              <span>{formatDate(time)}</span>
            </div>
          )}
        </Show>

        <div
          class="tooltip flex items-center space-x-2"
          style={{ 'grid-column-end': -1 }}
          aria-label="Created at"
        >
          <ClockIconSolid role="presentation" class="inline-block h-3 w-3" />
          <span>{props.post.createdAt ? formatDate(props.post.createdAt) : 'UNPUBLISHED'}</span>
        </div>
      </div>
    </div>
  </PostListItemLink>
)

export default BlogPostCard
