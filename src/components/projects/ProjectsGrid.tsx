const ProjectsGrid: React.FC = ({ children }) => {
  return (
    <div className="grid grid-flow-row-dense grid-cols-1 gap-12 sm:grid-cols-2">{children}</div>
  )
}

export default ProjectsGrid
