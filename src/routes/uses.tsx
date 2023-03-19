import { VoidComponent } from 'solid-js'
import { NoHydration } from 'solid-js/web'

import CustomLink from '~/components/CustomLink'
import PostLayout, { PostBottomSection } from '~/components/layout/PostLayout'
import ProseWrapper from '~/components/layout/ProseWrapper'
import { PUBLIC_URL } from '~/constants'
import Uses from '~/data/misc/uses/index.mdx'
import usesMeta from '~/data/misc/uses/index.mdx?meta'
import { frontMatter } from '~/data/misc/uses/index.mdx?meta'
import { Seo } from '~/lib/seo'
import { getOgImage } from '~/utils/og'

const title = frontMatter.title || 'What I Use'
const url = `${PUBLIC_URL}/uses`
const shortDescription = 'Stuff I use'

const UsesPage: VoidComponent = () => {
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
              (usesMeta as unknown as { updatedAt: string }).updatedAt as string
            ).toISOString(),
            publishedTime: new Date(
              (usesMeta as unknown as { updatedAt: string }).updatedAt as string
            ).toISOString(),
          },
          images: [getOgImage('Uses')],
        }}
      />
      <NoHydration>
        <ProseWrapper>
          <Uses />
          <PostBottomSection>
            Check out other <code>uses</code> pages{' '}
            <CustomLink href="https://uses.tech">here</CustomLink>
          </PostBottomSection>
        </ProseWrapper>
      </NoHydration>
    </PostLayout>
  )
}

export default UsesPage
