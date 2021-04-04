import WorkItem from '../WorkItem'
import LandingSection from './LandingSection'

const Education: React.FC = () => {
  return (
    <LandingSection title="Education">
      <WorkItem
        title="Bachelor of Science: Computer Science"
        company="University of New South Wales"
        location="Sydney, NSW"
        from="Feb 2018"
        to="Dec2021"
      />
    </LandingSection>
  )
}

export default Education
