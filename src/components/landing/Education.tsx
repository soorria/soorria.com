import WorkItem from '../WorkItem'
import LandingSection from './LandingSection'

const shortDescriptionLines = `
Top 3 (95) in COMP6080 – Web Front-End Programming  
96 (HD) in COMP2521 – Data Structures and Algorithms
87 (HD) in COMP2521 – Computer Systems Fundamentals
Relevant course-work: Database Programming, Networks Programming, Operating Systems, Object-Oriented Programming
`
  .trim()
  .split('\n')

const Education: React.FC = () => {
  return (
    <LandingSection id="education" title="Education">
      <WorkItem
        shortDescription={
          <ul className="pl-6">
            {shortDescriptionLines.map((line, i) => (
              <li className="list-disc" key={i}>
                {line}
              </li>
            ))}
          </ul>
        }
        title="Bachelor of Actuarial Studies / Bachelor of Computer Science"
        company="University of New South Wales"
        location="Sydney, NSW"
        from="Feb 2019"
        to="Dec 2022"
      />
    </LandingSection>
  )
}

export default Education
