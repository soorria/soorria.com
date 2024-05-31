import Container from '~/components/Container'
import Skills from '~/components/landing/Skills'
import { getRandomSkillIndexes } from '~/lib/skills/definitions'

export default function SkillsDevPage() {
  return (
    <Container>
      <Skills skillIndexes={getRandomSkillIndexes()} />
    </Container>
  )
}
