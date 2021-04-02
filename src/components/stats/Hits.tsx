import { Hit } from '@/types/hits'
import Link from 'next/link'
import useSWR from 'swr'
import { ExternalIcon } from '../icons'
import Logo from '../logo'

const Hits: React.FC = () => {
  const { data } = useSWR<{ hits: Record<string, Hit[]> }>('/api/stats/hits')

  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-3xl font-bold capitalize font-display">Hits</h2>
      </div>
      {data ? (
        Object.entries(data.hits).map(([category, cathits]) => (
          <div key={category} className="my-6">
            <h3 className="mb-6 text-2xl font-bold capitalize font-display">{category}</h3>
            <div className="flex flex-col space-y-4">
              {cathits.map(({ slug, hits }) => (
                <div key={slug} className="flex items-center p-4 space-x-3 rounded bg-drac-curr">
                  <div className="text-lg font-bold text-drac-pink font-display">{slug}</div>
                  <div className="flex-1" />
                  <div>{hits} hits</div>
                  <a href={`/${category}/${slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalIcon className="block w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center mx-auto mb-6 space-x-6 text-lg">
          <div className="animate-spin">
            <Logo size="sm" />
          </div>
          <div>Loading ...</div>
        </div>
      )}
    </div>
  )
}

export default Hits
