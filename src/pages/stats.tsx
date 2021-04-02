import MainLayout from '@/components/MainLayout'
import { PostHeading } from '@/components/PostLayout'
import Hits from '@/components/stats/Hits'
import { GetServerSideProps } from 'next'

interface StatsProps {
  isPreview: boolean
}

const Stats: React.FC = () => {
  return (
    <div className="max-w-md mx-auto">
      <Hits />
    </div>
  )
}

const StatsPage: React.FC<StatsProps> = () => {
  return (
    <MainLayout>
      <PostHeading>Stats</PostHeading>
      <Stats />
    </MainLayout>
  )
}

export default StatsPage

export const getServerSideProps: GetServerSideProps = async context => {
  return { props: { isPreview: !!context.preview } }
}
