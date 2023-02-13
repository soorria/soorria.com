import type { SnippetFrontMatter } from '~/types/snippet'
import { createGetAllHandler } from '~/lib/data-api'
import { DataType } from '~/types/data'
import { createdAtFieldComparator } from '~/utils/content'

export default createGetAllHandler<SnippetFrontMatter>(DataType.snippets, {
  compareForSort: createdAtFieldComparator,
})
