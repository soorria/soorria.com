import PostLayout from '@/components/PostLayout'
import { getFileWithMdx } from '@/lib/data'
import { hydrate } from '@/lib/mdx-hydrate'
import { BaseData, DataType } from '@/types/data'
import { getOgImage } from '@/utils/og'
import { GetStaticProps } from 'next'
import { MdxRemote } from 'next-mdx-remote/types'
import { NextSeo } from 'next-seo'

interface AboutPageProps {
  mdx: MdxRemote.Source
  updatedAt: string
}

const title = 'About Me'
const url = 'https://mooth.tech/about'
const shortDescription = 'Who I am and what I do'

const AboutPage: React.FC<AboutPageProps> = ({ mdx, updatedAt }) => {
  const content = hydrate(mdx)

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
      <div className="mx-auto mt-6 prose md:mt-16 md:prose-lg">{content}</div>
    </PostLayout>
  )
}

export default AboutPage

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const { mdxSource, updatedAt } = await getFileWithMdx<BaseData & { updatedAt: string }>(
    DataType.misc,
    'about'
  )
  return {
    props: { mdx: mdxSource, updatedAt },
  }
}
