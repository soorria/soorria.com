import { Component } from 'solid-js'
import { NoHydration } from 'solid-js/web'

import PostLayout from '~/components/layout/PostLayout'
import ProseWrapper from '~/components/layout/ProseWrapper'
import Logo from '~/components/logo'
import { SpinningIconDivider } from '~/components/posts/SpinningIconDivider'
import { PUBLIC_URL } from '~/constants'
import About from '~/data/misc/about/index.mdx'
import aboutMeta from '~/data/misc/about/index.mdx?meta'
import { Seo } from '~/lib/seo'
import { getOgImage } from '~/utils/og'
// import About from '~/data/snippets/use-local-storage/index.mdx'

const title = 'About Me'
const url = `${PUBLIC_URL}/about`
const shortDescription = 'Who I am and what I do'

const AboutPage: Component = () => {
  return (
    <PostLayout title={title}>
      <Seo
        title={title}
        description={shortDescription}
        canonical={url}
        openGraph={{
          url,
          title,
          description: shortDescription,
          type: 'article',
          article: {
            section: 'Blog',
            authors: ['Soorria Saruva'],
            modifiedTime: new Date(
              (aboutMeta as unknown as { updatedAt: string }).updatedAt as string
            ).toISOString(),
            publishedTime: new Date(
              (aboutMeta as unknown as { updatedAt: string }).updatedAt as string
            ).toISOString(),
          },
          images: [getOgImage('About Me', 'soorria.com')],
        }}
      />
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
