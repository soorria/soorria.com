import type { ProjectCardComponent } from '../ProjectCard'
import bgImg from './sizes.png'
import UtilsProjectCard from '../_utils/UtilsProjectCard'

const SizesCard: ProjectCardComponent = ({ project }) => {
  return (
    <UtilsProjectCard fullWidth project={project} bgImage={bgImg}>
      <li>
        Measure the size of your files when compressed with algorithms used across the web!
        (deflate, gzip, brotli)
      </li>
      <li>
        Works when JavaScript is disabled, so you can rest assured Google and Facebook aren&apos;t
        tracking you
      </li>
      <li>Use the api endpoint if you&apos;re disgusted by UIs or a terminal maximalist</li>
    </UtilsProjectCard>
  )
}

export default SizesCard
