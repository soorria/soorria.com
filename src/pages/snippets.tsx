import { GetStaticProps } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import { SnippetFrontMatter } from '@/types/snippet'
import { getAllFilesFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import { ClockIconSolid } from '@/components/icons'

interface SnippetsPageProps {
  snippets: SnippetFrontMatter[]
}

const SnippetsPage: React.FC<SnippetsPageProps> = ({ snippets }) => {
  return (
    <Container>
      <h1 className="mt-8 text-5xl font-bold text-center font-display text-drac-pink">Snippets</h1>
      <p className="mt-6 mb-12 text-center">Little bits of code that I find useful.</p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {snippets.map(({ slug, title, short_description, created_at }) => (
          <Link href={`/snippets/${slug}`} passHref key={slug}>
            <a className="relative flex flex-col px-4 py-4 space-y-3 transition-shadow rounded sm:py-6 sm:px-8 bg-drac-curr hover:shadow-2xl">
              <div className="text-xl font-bold text-drac-pink font-display">{title}</div>
              <div className="">{short_description}</div>
              <div className="flex items-center space-x-2 text-sm">
                <ClockIconSolid className="inline-block w-4 h-4" />
                <span>{new Date(created_at).toLocaleDateString()}</span>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export default SnippetsPage

export const getStaticProps: GetStaticProps = async () => {
  const snippets = (
    await getAllFilesFrontMatter<SnippetFrontMatter>(DataType.snippets)
  ).sort((a, b) => (b.created_at > a.created_at ? 1 : b.created_at < a.created_at ? -1 : 0))

  return {
    props: { snippets },
  }
}
