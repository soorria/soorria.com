import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

interface OGCategoryImagePageProps {
  noBoilerPlate: true
}

const OGCategoryImagePage: React.FC<OGCategoryImagePageProps> = () => {
  const router = useRouter()
  return (
    <div className="relative w-[1200px] h-[630px] overflow-hidden">
      <div className="absolute inset-0 transform -translate-y-1/2">
        <img alt="" src="/logo.svg" />
      </div>
      <div className="relative flex items-center justify-center h-full text-center font-display">
        <div className="flex flex-col justify-center py-16 w-[600px] bg-drac-bg bg-opacity-70 text-drac-fg rounded-3xl item-center">
          <p className="mb-4 text-6xl font-bold capitalize">{router.query.category}</p>
          <p className="text-3xl">mooth.tech</p>
        </div>
      </div>
    </div>
  )
}

export default OGCategoryImagePage

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: { noBoilerPlate: true } }
}
