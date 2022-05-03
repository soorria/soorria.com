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
        Works when JavaScript is disabled, so you know I&apos;m not fingerprinting your browser. (I
        will eat your files though 🙂)
      </li>
      <li>
        Has more themes than you&apos;ll ever need for an app like this! (29 &amp; random themes)
      </li>
    </UtilsProjectCard>
  )
}

export default SizesCard
