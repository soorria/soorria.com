import { A } from 'solid-start'
import MainLayout from '~/components/layout/MainLayout'
import { PostHeading } from '~/components/layout/PostLayout'

export default function NotFound() {
  return (
    <MainLayout>
      <PostHeading>404 - You're lost!</PostHeading>
      <A href="/" class="group mx-auto my-8 block max-w-xs text-center text-lg">
        Click <span class="text-drac-pink group-hover:underline">here</span> to go home.
      </A>
    </MainLayout>
  )
}
