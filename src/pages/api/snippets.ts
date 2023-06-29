import type { SnippetFrontMatter } from '~/types/snippet'
import { createGetAllHandler } from '~/lib/data-api'
import { createdAtFieldComparator } from '~/utils/content'

export default createGetAllHandler<SnippetFrontMatter>('snippets', {
  compareForSort: createdAtFieldComparator,
})
