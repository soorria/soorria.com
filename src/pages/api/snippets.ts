import { createGetAllHandler } from '@/lib/data-api'
import { DataType } from '@/types/data'

export default createGetAllHandler(DataType.snippets)
