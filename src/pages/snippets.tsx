import { GetStaticProps } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import { SnippetFrontMatter } from '@/types/snippet'
import { getAllFilesFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'

interface SnippetsPageProps {
  snippets: SnippetFrontMatter[]
}

const SnippetsPage: React.FC<SnippetsPageProps> = ({ snippets }) => {
  return (
    <Container>
      <h1 className="mt-8 text-5xl font-bold text-center font-display text-drac-pink">Snippets</h1>
      <p className="mt-6 text-center">Little bits of code that I find useful.</p>
      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
        {snippets.map(({ slug, title, short_description }) => (
          <Link href={`/snippets/${slug}`} passHref key={slug}>
            <a className="relative flex flex-col p-4 space-y-2 transition-shadow rounded bg-drac-curr hover:shadow-2xl">
              <div className="text-xl font-bold text-drac-pink">{title}</div>
              <div className="">{short_description}</div>
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
