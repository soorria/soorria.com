import { createGetBySlugHandler } from '@/lib/data-api'
import { DataType } from '@/types/data'

export default createGetBySlugHandler(DataType.snippets)
