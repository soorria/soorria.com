import { Component } from 'solid-js'
import { NoHydration } from 'solid-js/web'

import PostLayout from '~/components/layout/PostLayout'
import ProseWrapper from '~/components/layout/ProseWrapper'
import Logo from '~/components/logo'
import { SpinningIconDivider } from '~/components/posts/SpinningIconDivider'
import { PUBLIC_URL } from '~/constants'
import About from '~/data/misc/about/index.mdx'
// import About from '~/data/snippets/use-local-storage/index.mdx'

const title = 'About Me'
const url = `${PUBLIC_URL}/about`
const shortDescription = 'Who I am and what I do'

const AboutPage: Component = () => {
  return (
    <PostLayout title={title}>
      <SpinningIconDivider scrollVar="--scroll" icon={Logo} />
      <NoHydration>
        <ProseWrapper>
          <About />
        </ProseWrapper>
      </NoHydration>
    </PostLayout>
  )
}

export default AboutPage
