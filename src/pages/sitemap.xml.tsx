import type { GetServerSideProps } from 'next'
import { generateSitemap } from '@/lib/sitemap'

interface SitemapProps {}

const Sitemap: React.FC<SitemapProps> = () => {
  return <div className="mt-36 text-center text-5xl">If you see this something went wrong. ☹</div>
}

export default Sitemap

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = await generateSitemap()

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return { props: {} }
}
