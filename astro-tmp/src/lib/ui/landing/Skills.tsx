import { SKILLS, SKILLS_MAGIC_NUMBERS } from '~/lib/skills/definitions'
import { cx } from '~/lib/utils/styles'
import CustomLink from '../custom-link'
import LandingSection from './LandingSection'
import { skillLabelToImage } from '~/lib/skills/images'
import { SkillsArea } from './SkillsArea'

const titles = ["What I've Learned", 'Technical Skills', 'Tools I Use']

function StaticSkillsArea({ skillIndexes }: { skillIndexes: number[] }) {
  const skills = skillIndexes?.map((index) => SKILLS[index]!)

  return (
    <div
      className={cx('absolute inset-0 grid items-center justify-around justify-items-center')}
      style={{
        gridTemplateColumns: `repeat(4, ${(
          (SKILLS_MAGIC_NUMBERS.imageWidthPx / SKILLS_MAGIC_NUMBERS.rootWidthPx) *
          100
        ).toString()}%)`,
      }}
    >
      {skills.map((skill) => {
        return (
          <div
            key={skill.label}
            className="relative grid w-full place-items-center"
            draggable={false}
          >
            {/* eslint-disable-next-line */}
            <img
              src={skillLabelToImage[skill.label]?.src}
              alt={`${skill.label} logo`}
              className="block aspect-square h-auto w-full object-contain"
              draggable={false}
            />
            <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs md:-bottom-6 md:text-sm">
              {skill.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const Skills: React.FC<{ random?: number; skillIndexes: number[] }> = ({
  random = 0,
  skillIndexes,
}) => {
  const title = titles[random % titles.length]

  return (
    <LandingSection id="skills" title={title}>
      <div className="space-y-4 text-sm">
        <SkillsArea staticFallback={<StaticSkillsArea skillIndexes={skillIndexes} />} />

        <p className="text-center">
          Want to see a pointlessly long list of languages I&apos;ve used?
          <br />
          Check out my{' '}
          <CustomLink href="/snippets/hello-world" className="font-mono">
            hello-world
          </CustomLink>{' '}
          snippet.
        </p>
      </div>
    </LandingSection>
  )
}

export default Skills
