import { temporaryRedirect } from '../lib/temporary-redirect'

export const prerender = false
export const GET = temporaryRedirect('/snippets/cypress')
