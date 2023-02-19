// export default () => <>hi</>

import { json } from 'solid-start'

export const GET = (ctx: any) => {
  console.log(ctx)
  return json({ a: true })
}
