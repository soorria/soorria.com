import type { GetServerSideProps } from 'next'

interface SitemapProps {}

const Sitemap: React.FC<SitemapProps> = () => {
  return <div className="mt-36 text-center text-5xl">If you see this something went wrong. ☹</div>
}

export default Sitemap

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
    redirect: {
      destination: '/#contact',
      permanent: true,
    },
  }
}
