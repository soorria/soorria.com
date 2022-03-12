import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Project, ProjectFrontMatter } from '@/types/project'
import PostLayout from '@/components/PostLayout'
import { getAllFilesFrontMatter, getFileWithMdx } from '@/lib/data'
import { DataType } from '@/types/data'
import { NextSeo } from 'next-seo'
import { getOgImage } from '@/utils/og'
import { useMdxComponent } from '@/lib/mdx'

interface ProjectPageProps {
  project: ProjectFrontMatter
  mdx: string
}

const PostPage: React.FC<ProjectPageProps> = ({ project, mdx }) => {
  const url = `https://mooth.tech/posts/${project.slug}`
  const title = `${project.title} | Blog`
  const Content = useMdxComponent(mdx)

  return (
    <PostLayout title={project.title}>
      <NextSeo
        title={title}
        description={project.shortDescription}
        canonical={url}
        openGraph={{
          url,
          title,
          description: project.shortDescription,
          type: 'article',
          images: [getOgImage(DataType.blog, project.title)],
        }}
      />
      <div className="prose mx-auto mt-6 md:prose-lg md:mt-16">
        {mdx ? <Content /> : <h2>Unfortunately, I&apos;m not done with this page yet ☹</h2>}
      </div>
    </PostLayout>
  )
}

export default PostPage

export const getStaticProps: GetStaticProps<ProjectPageProps, { slug: string }> = async ({
  params,
}) => {
  // For some reason, this function gets called with '<no source>' as the slug
  // even in production.
  if (!params?.slug || params.slug === '<no source>') {
    return { notFound: true }
  }

  const { slug } = params
  const { code, ...snippet } = await getFileWithMdx<Project>(DataType.projects, slug)

  return {
    props: { project: snippet, mdx: code },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snippets = await getAllFilesFrontMatter<ProjectFrontMatter>(DataType.projects)

  return {
    paths: snippets.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}
