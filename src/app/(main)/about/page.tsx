import PostLayout from '~/components/posts/PostLayout'
import { getFileForMdx } from '~/lib/data'
import type { BaseData } from '~/types/data'
import { PUBLIC_URL } from '~/constants'
import { getOgImage } from '~/utils/og'
import ProseWrapper from '~/components/posts/ProseWrapper'
import MdxRenderer from '~/components/mdx/MdxRenderer'

const title = 'About Me'
const url = `${PUBLIC_URL}/about`
const shortDescription = 'Who I am and what I do'

export const metadata = {
  title,
  description: shortDescription,
  alternates: { canonical: url },

  openGraph: {
    url,
    title,
    description: shortDescription,

    type: 'article',
    section: 'Blog',
    authors: ['Soorria Saruva'],
    // modifiedTime: new Date(updatedAt).toISOString(),
    // publishedTime: new Date(updatedAt).toISOString(),
    images: [getOgImage({ title: 'About Me', subtitle: 'soorria.com' })],
  },
}

const AboutPage = async () => {
  const {
    code: code,
    updatedAt: _updatedAt,
    slug,
  } = await getFileForMdx<BaseData & { updatedAt: string }>('misc', 'about')

  return (
    <PostLayout title={title}>
      <ProseWrapper>
        <MdxRenderer code={code} type="misc" slug={slug} />
      </ProseWrapper>
    </PostLayout>
  )
}

export default AboutPage
