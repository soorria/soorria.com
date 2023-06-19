import CustomLink from '~/components/CustomLink'
import PostLayout, { PostBottomSection } from '~/components/posts/PostLayout'
import { getFileWithMdx } from '~/lib/data'
import { Mdx } from '~/lib/mdx'
import { BaseData, DataType } from '~/types/data'
import { getOgImage } from '~/utils/og'
import { PUBLIC_URL } from '~/constants'

const title = 'What I Use'
const url = `${PUBLIC_URL}/uses`
const shortDescription = 'Stuff I use'

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
    images: [getOgImage('Uses')],
  },
}

const UsesPage = async () => {
  const { code, updatedAt: _updatedAt } = await getFileWithMdx<BaseData & { updatedAt: string }>(
    DataType.misc,
    'uses'
  )

  return (
    <PostLayout title={title}>
      <div className="prose mx-auto mt-6 md:prose-lg md:mt-16">
        <Mdx code={code} />
        <PostBottomSection>
          Check out other <code>uses</code> pages{' '}
          <CustomLink href="https://uses.tech">here</CustomLink>
        </PostBottomSection>
      </div>
    </PostLayout>
  )
}

export default UsesPage
