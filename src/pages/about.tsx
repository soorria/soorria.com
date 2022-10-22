import type { GetStaticProps } from 'next'
import PostLayout from '~/components/posts/PostLayout'
import { getFileWithMdx } from '~/lib/data'
import { useMdxComponent } from '~/lib/mdx'
import { BaseData, DataType } from '~/types/data'
import { NextSeo } from 'next-seo'
import { PUBLIC_URL } from '~/constants'
import { getOgImage } from '~/utils/og'

interface AboutPageProps {
  mdx: string
  updatedAt: string
}

const title = 'About Me'
const url = `${PUBLIC_URL}/about`
const shortDescription = 'Who I am and what I do'

const AboutPage: React.FC<AboutPageProps> = ({ mdx, updatedAt }) => {
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
          images: [getOgImage('About Me', 'soorria.com')],
        }}
      />
      <div className="prose mx-auto mt-6 md:mt-16 md:prose-lg">
        <Content />
      </div>
    </PostLayout>
  )
}

export default AboutPage

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const { code, updatedAt } = await getFileWithMdx<BaseData & { updatedAt: string }>(
    DataType.misc,
    'about'
  )
  return {
    props: { mdx: code, updatedAt },
  }
}
