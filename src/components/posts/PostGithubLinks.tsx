import type { DataType } from '@/types/data'
import { editUrl, historyUrl } from '@/utils/repo'

interface PostGithubLinksProps {
  dataType: DataType
  slug: string
}

const PostGithubLinks: React.FC<PostGithubLinksProps> = ({ dataType, slug }) => {
  return (
    <div>
      Found a mistake, or want to suggest an improvement? Edit on GitHub{' '}
      <a
        href={editUrl(dataType, slug)}
        className="focus-ring -mx-1 rounded px-1"
        rel="noopenner noreferrer"
        target="_blank"
      >
        here
      </a>
      <br />
      and see edit history{' '}
      <a
        href={historyUrl(dataType, slug)}
        className="focus-ring -mx-1 rounded px-1"
        rel="noopenner noreferrer"
        target="_blank"
      >
        here
      </a>
    </div>
  )
}

export default PostGithubLinks
