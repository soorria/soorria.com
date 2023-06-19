import PostLayout from '~/components/posts/PostLayout'
import { getFileWithMdx } from '~/lib/data'
import { Mdx } from '~/lib/mdx'
import { BaseData, DataType } from '~/types/data'
import { PUBLIC_URL } from '~/constants'
import { getOgImage } from '~/utils/og'

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
      <div className="prose mx-auto mt-6 md:prose-lg md:mt-16">
        <Mdx code={code} />
      </div>
    </PostLayout>
  )
}

export default AboutPage
