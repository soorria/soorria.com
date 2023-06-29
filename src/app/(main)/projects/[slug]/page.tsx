import type { Project } from '~/types/project'
import PostLayout from '~/components/posts/PostLayout'
import { getFileForMdx } from '~/lib/data'
import { getOgImageForData } from '~/utils/og'
import { PUBLIC_URL } from '~/constants'
import { notFound } from 'next/navigation'
import ProseWrapper from '~/components/posts/ProseWrapper'
import MdxRenderer from '~/components/mdx/MdxRenderer'

type ProjectPageProps = {
  params: { slug: string }
}

export const generateStaticParams = async () => []

export const generateMetadata = async (props: ProjectPageProps) => {
  const project = await getFileForMdx<Project>('projects', props.params.slug)

  const url = `${PUBLIC_URL}/projects/${project.slug}`
  const title = `${project.title} | Projects`

  return {
    title,
    description: project.shortDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title,
      description: project.shortDescription,
      type: 'article',
      section: 'projects',
      authors: ['Soorria Saruva'],
      images: [getOgImageForData('projects', project.title)],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@soorria',
      description: project.shortDescription,
      title,
      site: '@soorria',
      images: [getOgImageForData('projects', project.title)],
    },
  }
}

const ProjectPage = async (props: ProjectPageProps) => {
  const { code: code, ...project } = await getFileForMdx<Project>('projects', props.params.slug)

  if (!code) {
    return notFound()
  }

  return (
    <PostLayout title={project.title}>
      <ProseWrapper>
        {code ? (
          <MdxRenderer code={code} type="projects" slug={project.slug} />
        ) : (
          <h2>Unfortunately, I&apos;m not done with this page yet ☹</h2>
        )}
      </ProseWrapper>
    </PostLayout>
  )
}

export default ProjectPage
