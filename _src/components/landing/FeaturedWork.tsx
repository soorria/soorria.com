import type { WorkFrontMatter } from '~/types/work'
import WorkItem from '../WorkItem'
import LandingSection from './LandingSection'

interface FeaturedWorkProps {
  work: WorkFrontMatter[]
}

const FeaturedWork: React.FC<FeaturedWorkProps> = ({ work }) => {
  return (
    <LandingSection id="work" title="Work Experience">
      <div className="flex flex-col space-y-8">
        {work.map(({ slug, ...rest }) => (
          <WorkItem key={slug} {...rest} />
        ))}
      </div>
    </LandingSection>
  )
}

export default FeaturedWork
