import { ComponentType } from 'react'
import ReactDemo, { ReactDemoProps } from './ReactDemo.client'

const ReactDemoServer = ({
  component: Component,
  init = 'mount',
}: {
  init?: ReactDemoProps['init']
  component: ComponentType
}) => {
  return <ReactDemo content={<Component />} init={init} />
}

export default ReactDemoServer
