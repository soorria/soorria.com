import { GetStaticProps } from 'next'
import Link from 'next/link'
import Container from 'src/components/Container'
import { Snippet } from 'src/types/snippet'
import gqlFetch from 'src/utils/gqlFetch'

interface SnippetsPageProps {
  snippets: Omit<Snippet, 'mdSource'>[]
}

const SnippetsPage: React.FC<SnippetsPageProps> = ({ snippets }) => {
  return (
    <Container>
      <h1 className="mt-8 text-5xl font-bold text-center font-display text-drac-pink">Snippets</h1>
      <p className="mt-6 text-center">Little bits of code that I find useful.</p>
      <div className="flex flex-col items-center mt-4 space-y-4">
        {snippets.map(({ slug, title }) => (
          <Link href={`/snippets/${slug}`} passHref key={slug}>
            <a className="relative flex w-full max-w-lg p-4 transition-shadow rounded bg-drac-curr hover:shadow-2xl">
              <span className="text-drac-pink">{title}</span>
            </a>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export default SnippetsPage

export const getStaticProps: GetStaticProps = async () => {
  const data = await gqlFetch<{ snippets: SnippetsPageProps['snippets'] }>(
    'http://snippetsapi.mooth.tech/api/v1/graphql',
    `query {
      snippets {
        slug
        title
        short_description
        types
      }
    }`,
    {}
  )

  const snippets = data.snippets

  return {
    props: { snippets },
  }
}
