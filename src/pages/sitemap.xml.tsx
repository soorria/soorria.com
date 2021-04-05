import { generateSitemap } from '@/lib/sitemap'
import { GetServerSideProps } from 'next'

interface SitemapProps {}

const Sitemap: React.FC<SitemapProps> = () => {
  return <div className="text-5xl text-center mt-36">If you see this something went wrong. ☹</div>
}

export default Sitemap

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = await generateSitemap()

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return { props: {} }
}
