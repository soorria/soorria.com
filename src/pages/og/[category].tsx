import { createOGMarkup } from '@/lib/og'
import { GetServerSideProps } from 'next'

const OGCategoryImagePage: React.FC = () => {
  return null
}

export default OGCategoryImagePage

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.end(createOGMarkup(typeof params?.category === 'string' ? params.category : 'Empty Category'))

  return { props: {} }
}
