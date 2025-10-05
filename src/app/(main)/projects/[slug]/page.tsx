import type { Project } from '~/types/project'
import PostLayout from '~/components/posts/PostLayout'
import { getFileForMdx } from '~/lib/data'
import { getOgImageForData } from '~/utils/og'
import { PUBLIC_URL } from '~/constants'
import { notFound } from 'next/navigation'
import ProseWrapper from '~/components/posts/ProseWrapper'
import MdxRenderer from '~/components/mdx/MdxRenderer'
import { ignoreError } from '~/utils/misc'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-static'

export const generateStaticParams = async () => []

export const generateMetadata = async (props: ProjectPageProps) => {
  const project = await ignoreError(getFileForMdx<Project>('projects', (await props.params).slug))
  if (!project) return {}

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
      creator: '@soorriously',
      description: project.shortDescription,
      title,
      site: '@soorriously',
      images: [getOgImageForData('projects', project.title)],
    },
  }
}

const ProjectPage = async (props: ProjectPageProps) => {
  const data = await ignoreError(getFileForMdx<Project>('projects', (await props.params).slug))

  if (!data?.code) {
    return notFound()
  }

  const { code, ...project } = data

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
