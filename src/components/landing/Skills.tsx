import { createAutoAnimate } from '@formkit/auto-animate/solid'
import { For, ParentComponent, VoidComponent } from 'solid-js'

import { useSkills } from '~/lib/skills'
import cx from '~/utils/cx'

import CustomLink from '../CustomLink'
import { RefreshIcon } from '../icons'
import LandingSection from './LandingSection'

const titles = ["What I've learned", 'Technical skills', 'Tools I use']

const SkillListItem: ParentComponent = props => {
  return (
    <li class="group flex items-start space-x-2">
      <span class="mt-[0.5em] h-2 w-2 transform rounded-full border-2 border-drac-content transition group-hover:border-drac-pink" />
      <span>{props.children}</span>
    </li>
  )
}

const classes = {
  buttonCommon:
    'rounded bg-drac-base-light px-2 py-1 text-drac-content transition-colors hocus:text-drac-purple focus-ring',
}

const Skills: VoidComponent<{ random?: number; skillIndexes: number[] }> = props => {
  const { skills, shuffle, toggleShowAll, showAll } = useSkills({
    defaultIndexes: props.skillIndexes,
  })
  const title = titles[(props.random ?? 0) % titles.length]
  const [list] = createAutoAnimate()

  return (
    <LandingSection id="skills" title={title}>
      <p class="mb-8 text-lg">
        Here are some of the technicals skills during my degree, work, and just out of curiosity.
      </p>
      <ul ref={list} class="mb-8 grid grid-cols-2 items-start gap-x-6 gap-y-8 md:grid-cols-4">
        <For each={skills()}>{skill => <SkillListItem>{skill}</SkillListItem>}</For>
        {showAll() ? <SkillListItem>Adding random &ldquo;features&rdquo;</SkillListItem> : null}
      </ul>
      <div class="space-y-4 text-center text-sm">
        <div class="flex items-center justify-center space-x-1">
          <button onClick={() => toggleShowAll()} class={classes.buttonCommon}>
            {showAll() ? 'Show random' : 'Show all'}
          </button>
          <span>&nbsp;/&nbsp;</span>
          <button
            onClick={() => {
              if (showAll()) toggleShowAll(false)
              shuffle()
            }}
            class={cx('flex items-center', classes.buttonCommon)}
          >
            <RefreshIcon class="mr-1 inline-block h-em w-em" /> Randomise
          </button>
        </div>
        <p>
          Want to see a pointlessly long list of languages I&apos;ve used?
          <br />
          Check out my{' '}
          <CustomLink href="/snippets/hello-world" class="font-mono">
            hello-world
          </CustomLink>{' '}
          snippet.
        </p>
      </div>
    </LandingSection>
  )
}

export default Skills
