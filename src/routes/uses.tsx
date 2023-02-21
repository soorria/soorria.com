import { VoidComponent } from 'solid-js'

import CustomLink from '~/components/CustomLink'
import PostLayout, { PostBottomSection } from '~/components/layout/PostLayout'
import ProseWrapper from '~/components/layout/ProseWrapper'
import { PUBLIC_URL } from '~/constants'
import Uses from '~/data/misc/uses/index.mdx'
import { frontMatter } from '~/data/misc/uses/index.mdx?meta'

const title = frontMatter.title || 'What I Use'
const url = `${PUBLIC_URL}/uses`
const shortDescription = 'Stuff I use'

const UsesPage: VoidComponent = () => {
  return (
    <PostLayout title={title}>
      {/* <NextSeo
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
            modifiedTime: new Date(updatedAt).toISOString(),
            publishedTime: new Date(updatedAt).toISOString(),
          },
          images: [getOgImage('Uses')],
        }}
      /> */}
      <ProseWrapper>
        <Uses />
        <PostBottomSection>
          Check out other <code>uses</code> pages{' '}
          <CustomLink href="https://uses.tech">here</CustomLink>
        </PostBottomSection>
      </ProseWrapper>
    </PostLayout>
  )
}

export default UsesPage
