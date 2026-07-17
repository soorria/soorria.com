import { temporaryRedirect } from '../lib/temporary-redirect'

export const prerender = false
export const GET = temporaryRedirect('/?ref=/contact#contact')
