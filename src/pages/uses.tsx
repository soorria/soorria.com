import type { GetStaticProps } from 'next'
import CustomLink from '@/components/CustomLink'
import PostLayout, { PostBottomSection } from '@/components/PostLayout'
import { getFileWithMdx } from '@/lib/data'
import { useMdxComponent } from '@/lib/mdx'
import { BaseData, DataType } from '@/types/data'
import { getOgImage } from '@/utils/og'
import { NextSeo } from 'next-seo'

interface UsesPageProps {
  mdx: string
  updatedAt: string
}

const title = 'What I Use'
const url = 'https://mooth.tech/uses'
const shortDescription = 'Stuff I use'

const UsesPage: React.FC<UsesPageProps> = ({ mdx, updatedAt }) => {
  const Content = useMdxComponent(mdx)

  return (
    <PostLayout title={title}>
      <NextSeo
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
          images: [getOgImage('About Me')],
        }}
      />
      <div className="prose mx-auto mt-6 md:prose-lg md:mt-16">
        <Content />
        <PostBottomSection>
          Check out other <code>uses</code> pages{' '}
          <CustomLink href="https://uses.tech">here</CustomLink>
        </PostBottomSection>
      </div>
    </PostLayout>
  )
}

export default UsesPage

export const getStaticProps: GetStaticProps<UsesPageProps> = async () => {
  const { code, updatedAt } = await getFileWithMdx<BaseData & { updatedAt: string }>(
    DataType.misc,
    'uses'
  )
  return {
    props: { mdx: code, updatedAt },
  }
}
