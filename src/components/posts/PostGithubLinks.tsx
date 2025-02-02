import type { DataType } from '~/types/data'
import { sourceUrl, historyUrl } from '~/utils/repo'

interface PostGithubLinksProps {
  dataType: DataType
  slug: string
}

const PostGithubLinks: React.FC<PostGithubLinksProps> = ({ dataType, slug }) => {
  return (
    <div>
      Found a mistake, or want to suggest an improvement? Source on GitHub{' '}
      <a
        href={sourceUrl(dataType, slug)}
        className="focus-ring -mx-1 rounded-sm px-1"
        rel="noopenner noreferrer"
        target="_blank"
      >
        here
      </a>
      <br />
      and see edit history{' '}
      <a
        href={historyUrl(dataType, slug)}
        className="focus-ring -mx-1 rounded-sm px-1"
        rel="noopenner noreferrer"
        target="_blank"
      >
        here
      </a>
    </div>
  )
}

export default PostGithubLinks
