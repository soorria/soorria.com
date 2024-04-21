import { Children } from 'react'
import Collapse, { type CollapseProps } from '../Collapse'

const MDXCollapse: React.FC<CollapseProps> = ({ children, ...props }) => {
  return (
    <Collapse {...props}>
      {Children.map(children, (child, i) => (
        <div key={i} className="collapse-child [&>.code-block]:!-mx-0">
          {child}
        </div>
      ))}
    </Collapse>
  )
}

export default MDXCollapse
