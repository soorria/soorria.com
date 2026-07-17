import { useEffect, useRef, type ComponentType } from 'react'
import h from 'solid-js/h'
import { createComponent, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { render } from 'solid-js/web'

import { BubblingDemo } from '~data/blog/event-delegation/components'
import { createExample as createPreviousMemoExample } from '~data/snippets/create-previous-memo/components'
import ReactDemo from '~/components/mdx/ReactDemo.client'

const reactDemos = {
  'event-delegation': BubblingDemo,
} satisfies Record<string, ComponentType>

const solidDemos = {
  'create-previous-memo': createPreviousMemoExample,
}

type MdxDemoIslandProps =
  | { kind: 'react'; id: keyof typeof reactDemos }
  | { kind: 'solid'; id: keyof typeof solidDemos }

export const MdxDemoIsland = (props: MdxDemoIslandProps) => {
  if (props.kind === 'solid') {
    return <AstroSolidDemo create={solidDemos[props.id]} />
  }

  const Component = reactDemos[props.id]
  return <ReactDemo content={<Component />} init="always" />
}

const AstroSolidDemo = ({ create }: { create: (typeof solidDemos)[keyof typeof solidDemos] }) => {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return

    const demo = create({ createEffect, createSignal, onMount, onCleanup, h })
    return render(() => createComponent(demo.component, {}), root.current!)
  }, [create])

  return <div ref={root} />
}
