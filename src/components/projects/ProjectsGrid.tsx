import { PropsWithChildren } from 'react'

const ProjectsGrid = ({ children, initialStep }: PropsWithChildren<{ initialStep?: string }>) => {
  return (
    <div
      className="slide-in grid grid-flow-row-dense grid-cols-1 gap-12 sm:grid-cols-2"
      style={{
        '--initial-step': initialStep ?? '1',
      }}
    >
      {children}
    </div>
  )
}

export default ProjectsGrid
