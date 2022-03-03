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

const titles = ["What I've Learned", 'Technical Skills', 'Tools I Use']

const Skills: React.FC<{ random?: number }> = ({ random = 0 }) => {
  return (
    <LandingSection id="skills" title={titles[random % titles.length]}>
      <p className="mb-8 text-lg">
        Here are some of the technicals skills I&apos;ve developed in and outside of my degree.
      </p>
      <ul className="mb-8 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
        {SKILLS.map(skill => (
          <li key={skill} className="group flex items-center space-x-2">
            <span className="h-2 w-2 transform rounded-full border-2 border-drac-fg transition group-hover:border-drac-pink" />
            <span>{skill}</span>
          </li>
        ))}
      </ul>
      <p className="text-center text-sm">
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
