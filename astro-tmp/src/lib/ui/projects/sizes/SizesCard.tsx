import type { ProjectCardComponent } from '../ProjectCard'
import bgImg from './sizes.png'
import UtilsProjectCard from '../_utils/UtilsProjectCard'

const SizesCard: ProjectCardComponent = ({ project }) => {
  return (
    <UtilsProjectCard
      fullWidth
      project={project}
      bgImage={bgImg}
      bgAlt="flowchart showing simulated usage of the sizes utility with text, html and png files compressed with gzip coming resulting in a size of 2830 bytes"
    >
      <li>
        Measure the size of your files when compressed with algorithms used across the web!
        (deflate, gzip, brotli)
      </li>
      <li>
        Works when JavaScript is disabled, so you can rest assured Google and Facebook aren&apos;t
        tracking you
      </li>
      <li>Use the API endpoint if you&apos;re disgusted by UIs or a terminal maximalist</li>
    </UtilsProjectCard>
  )
}

export default SizesCard
