import type { GetServerSideProps } from 'next'
import { createOGMarkup } from '~/lib/og'

const OGCategoryImagePage: React.FC = () => {
  return null
}

export default OGCategoryImagePage

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  res.end(createOGMarkup(params!.title as string, params!.subtitle as string))

  return { props: {} }
}
