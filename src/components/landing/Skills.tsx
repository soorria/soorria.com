import CustomLink from '../CustomLink'
import LandingSection from './LandingSection'

const SKILLS = [
  'Next.js & React.js',
  'Express.js',
  'SQL / PostgreSQL',
  'MongoDB',
  'TypeScript',
  'HTML5 & CSS3',
  'Python Flask',
  'Jest & Cypress',
]

const Skills: React.FC = () => {
  return (
    <LandingSection id="skills" title="What I've Learned">
      <p className="mb-8 text-lg">
        Here are some of the technicals skills I&apos;ve developed in and outside of my degree.
      </p>
      <ul className="grid grid-cols-2 gap-8 mb-8 sm:grid-cols-3 md:grid-cols-4">
        {SKILLS.map(skill => (
          <li key={skill} className="flex items-center space-x-2 group">
            <span className="w-2 h-2 transition transform border-2 rounded-full border-drac-fg group-hover:scale-150 group-hover:border-drac-pink" />
            <span>{skill}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-center">
        Want to see a pointless list of languages I&apos;ve used? Check out my{' '}
        <CustomLink href="/snippets/hello-world" className="font-mono">
          hello-world
        </CustomLink>{' '}
        snippet.
      </p>
    </LandingSection>
  )
}

export default Skills
