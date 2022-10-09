import { Children } from 'react'
import Collapse, { CollapseProps } from '../Collapse'

const MDXCollapse: React.FC<CollapseProps> = ({ children, ...props }) => {
  return (
    <Collapse {...props}>
      {Children.map(children, (child, i) => (
        <div key={i} className="collapse-child">
          {child}
        </div>
      ))}
    </Collapse>
  )
}

export default MDXCollapse
