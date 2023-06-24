import PostLayout from '~/components/posts/PostLayout'
import { getFileWithMdx } from '~/lib/data'
import { Mdx } from '~/lib/mdx'
import { BaseData, DataType } from '~/types/data'
import { PUBLIC_URL } from '~/constants'
import { getOgImage } from '~/utils/og'
import ProseWrapper from '~/components/posts/ProseWrapper'

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
    images: [getOgImage('About Me', 'soorria.com')],
  },
}

const AboutPage = async () => {
  const { code, updatedAt: _updatedAt } = await getFileWithMdx<BaseData & { updatedAt: string }>(
    DataType.misc,
    'about'
  )

  return (
    <PostLayout title={title}>
      <ProseWrapper>
        <Mdx code={code} />
      </ProseWrapper>
    </PostLayout>
  )
}

export default AboutPage
