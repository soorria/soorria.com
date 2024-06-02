'use client'

import {
  useCallback,
  useState,
  useEffect,
  useRef,
  type RefObject,
  useLayoutEffect,
  type ReactNode,
} from 'react'
import { SKILLS, type SkillDefinition, SKILLS_MAGIC_NUMBERS } from '~/lib/skills/definitions'
import cx from '~/utils/cx'
import CustomLink from '../CustomLink'
import { RefreshIcon } from '../icons'
import LandingSection from './LandingSection'
import { skillLabelToImage } from '~/lib/skills/images'
import usePartySocket from 'partysocket/react'
import type { ClientMessage, ServerMessage, SkillPosition } from '~/lib/skills/schems'

const titles = ["What I've Learned", 'Technical Skills', 'Tools I Use']

export type UseSkillsInput = {
  scale: number
}

export type UseSkillsResult = {
  skills: typeof SKILLS
  shuffle: (n?: number) => void
  showAll: boolean
  toggleShowAll: (next?: boolean) => void
}

type SkillDefinitionWithId = SkillDefinition & { id: string; position: SkillPosition }

function useLiveSkills({ scale }: UseSkillsInput) {
  const [state, setState] = useState<{
    ready: boolean
    items: SkillDefinitionWithId[]
    numConnections: number
  }>({
    ready: false,
    items: [],
    numConnections: 9,
  })

  const ws = usePartySocket({
    host: 'https://soorria-website.soorria.partykit.dev',
    // host: 'http://192.168.1.113:1999',
    room: 'the-one-room',
    onMessage(event) {
      const message = JSON.parse(event.data as string) as ServerMessage
      if (message.type === 'init') {
        setState({
          ready: true,
          items: (message.items as SkillDefinitionWithId[]).map(s => ({
            ...s,
            position: scalePosition(s.position, scale),
          })),
          numConnections: message.numConnections,
        })
      } else if (message.type === 'connections-updated') {
        setState(s => ({
          ...s,
          numConnections: message.numConnections,
        }))
      } else if (message.type === 'items-updated') {
        setState(s => ({
          ...s,
          items: (message.items as SkillDefinitionWithId[]).map(s => ({
            ...s,
            position: scalePosition(s.position, scale),
          })),
        }))
      }
    },
  })

  const sendMessage = useCallback(
    (message: ClientMessage) => {
      ws.send(JSON.stringify(message))
    },
    [ws]
  )

  const moveItem: OnItemPositionChangeHandler = useCallback(
    (id, newPosition) => {
      setState(s => ({
        ...s,
        items: s.items.map(item => {
          if (item.id !== id) {
            return item
          }
          return {
            ...item,
            position: newPosition,
          }
        }),
      }))

      sendMessage({
        type: 'move-item',
        itemId: id,
        newPosition: scalePosition(newPosition, 1 / scale),
      })
    },
    [scale, sendMessage]
  )

  const addMore = useCallback(() => {
    sendMessage({
      type: 'add-more',
    })
  }, [sendMessage])

  return {
    ready: state.ready,
    skills: state.items,
    numConnections: state.numConnections,
    moveItem,
    addMore,
  }
}

const classes = {
  buttonCommon:
    'rounded bg-drac-base-light px-2 py-1 text-drac-content transition-colors hocus:text-drac-purple focus-ring',
}

function useElementWidth(element: RefObject<HTMLElement>) {
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (!element.current) return
    const handleResize = () => {
      setWidth(element.current?.clientWidth ?? 0)
    }
    const observer = new ResizeObserver(handleResize)
    observer.observe(element.current)
    handleResize()

    return () => observer.disconnect()
  }, [element])

  return width
}

type OnItemPositionChangeHandler = (id: string, updatedPosition: SkillPosition) => void

function clamp(value: number, min: number, max: number) {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}
function getOffset(rect: DOMRect, pointer: { clientX: number; clientY: number }) {
  return {
    x: rect.x + rect.width / 2 - pointer.clientX,
    y: rect.y + rect.height / 2 - pointer.clientY,
  }
}

function SkillItem({
  skill,
  imageWidth,
  position,
  onPositionChange,
  containerRef,
}: {
  skill: SkillDefinition & { id: string }
  imageWidth: number
  position: SkillPosition
  onPositionChange?: OnItemPositionChangeHandler
  containerRef: RefObject<HTMLElement>
}) {
  const element = useRef<HTMLButtonElement>(null)
  const [moving, setMoving] = useState<{
    offset: {
      x: number
      y: number
    }
  } | null>(null)

  useEffect(() => {
    const el = element.current
    if (!el) {
      return
    }

    function handlePointerStart(e: MouseEvent | TouchEvent) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect?.()
      if (!rect) {
        return
      }
      let touch: MouseEvent | Touch

      if (e.type === 'mousedown') {
        touch = e as MouseEvent
      } else {
        const touchEvent = e as TouchEvent
        if (touchEvent.touches?.length !== 1) {
          return
        }

        if (touchEvent.cancelable) {
          e.preventDefault()
        } else {
          return
        }

        touch = touchEvent.touches[0]!
      }

      const offset = getOffset(rect, touch)

      setMoving({
        offset,
      })
    }

    el.addEventListener('mousedown', handlePointerStart)
    el.addEventListener('touchstart', handlePointerStart)

    return () => {
      el.removeEventListener('mousedown', handlePointerStart)
      el.removeEventListener('touchstart', handlePointerStart)
    }
  }, [])

  useEffect(() => {
    if (!moving) return

    function handleMouseUp() {
      setMoving(null)
    }
    function handleMouseMove(e: MouseEvent | TouchEvent) {
      const containerRect = containerRef.current?.getBoundingClientRect()
      const elementRect = element.current?.getBoundingClientRect()
      if (!containerRect || !moving || !elementRect) {
        return
      }

      const touch = e.type === 'mousemove' ? (e as MouseEvent) : (e as TouchEvent).touches?.[0]
      if (!touch) {
        return
      }

      const halfElementWidth = elementRect.width / 2

      /**
       *     offset = element - mouse
       * => element = mouse   + offset
       */

      const update = {
        x: clamp(
          touch.clientX + moving.offset.x - containerRect.x,
          halfElementWidth,
          containerRect.width - halfElementWidth
        ),
        y: clamp(touch.clientY + moving.offset.y - containerRect.y, 0, containerRect.height),
      }

      onPositionChange?.(skill.id, update)
    }

    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchend', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleMouseMove)
    }
  }, [moving, skill.id, onPositionChange, containerRef])

  return (
    <button
      ref={element}
      key={skill.label}
      className={cx(
        'fade-in-direct group absolute block w-fit',
        moving ? 'cursor-grabbing' : 'cursor-grab transition-transform'
      )}
      style={{ transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))` }}
      draggable={false}
    >
      {/* eslint-disable-next-line */}
      <img
        src={skillLabelToImage[skill.label]?.src}
        alt={`${skill.label} logo`}
        className=""
        style={{ width: imageWidth, height: 'auto', maxHeight: imageWidth }}
        draggable={false}
      />
      <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs opacity-0 transition-opacity group-hocus-visible:opacity-100 md:-bottom-6 md:text-sm">
        {skill.label}
      </span>
    </button>
  )
}

function useDebouncedValue<T>(target: T, delayMs = 250): T {
  const [state, setState] = useState(target)

  useEffect(() => {
    const timeout = setTimeout(() => setState(target))
    return () => clearTimeout(timeout)
  }, [target, delayMs])

  return state
}

function scalePosition(position: SkillPosition, scale: number) {
  return {
    x: Math.round(position.x * scale),
    y: Math.round(position.y * scale),
  }
}

function SkillsArea(props: { staticFallback?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const width = useDebouncedValue(useElementWidth(rootRef))

  const scale = width / SKILLS_MAGIC_NUMBERS.rootWidthPx
  const unscaledImageWidth = SKILLS_MAGIC_NUMBERS.imageWidthPx
  const imageWidth = unscaledImageWidth * scale

  const liveSkills = useLiveSkills({ scale })
  const ready = width !== 0 && liveSkills.ready

  return (
    <>
      <div ref={rootRef} className="relative mb-8 aspect-video overflow-visible">
        {ready &&
          liveSkills.skills.map(skill => {
            return (
              <SkillItem
                imageWidth={imageWidth}
                position={skill.position}
                skill={skill}
                key={skill.id}
                onPositionChange={liveSkills.moveItem}
                containerRef={rootRef}
              />
            )
          })}

        <div
          className={cx(
            'pointer-events-none opacity-0 transition-opacity',
            !ready && 'pointer-events-auto opacity-100'
          )}
        >
          {props.staticFallback}
        </div>

        {ready && (
          <div className="absolute bottom-0 right-0 rounded bg-drac-base px-1 text-xs opacity-50 transition-opacity hover:opacity-100 md:text-sm">
            {liveSkills.numConnections} {liveSkills.numConnections === 1 ? 'person' : 'people'}{' '}
            online
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-1">
        <button
          onClick={() => {
            liveSkills.addMore()
          }}
          className={cx('flex items-center', classes.buttonCommon)}
        >
          <RefreshIcon className="mr-1 inline-block h-em w-em" /> See more skills
        </button>
      </div>
    </>
  )
}

function StaticSkillsArea({ skillIndexes }: { skillIndexes: number[] }) {
  const skills = skillIndexes?.map(index => SKILLS[index]!)

  return (
    <div
      className={cx('absolute inset-0 grid items-center justify-around justify-items-center')}
      style={{
        gridTemplateColumns: `repeat(4, ${(
          (SKILLS_MAGIC_NUMBERS.imageWidthPx / SKILLS_MAGIC_NUMBERS.rootWidthPx) *
          100
        ).toString()}%)`,
      }}
    >
      {skills.map(skill => {
        return (
          <div
            key={skill.label}
            className="relative grid w-full place-items-center"
            draggable={false}
          >
            {/* eslint-disable-next-line */}
            <img
              src={skillLabelToImage[skill.label]?.src}
              alt={`${skill.label} logo`}
              className="block aspect-square h-auto w-full object-contain"
              draggable={false}
            />
            <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs md:-bottom-6 md:text-sm">
              {skill.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const Skills: React.FC<{ random?: number; skillIndexes: number[] }> = ({
  random = 0,
  skillIndexes,
}) => {
  const title = titles[random % titles.length]

  return (
    <LandingSection id="skills" title={title}>
      <p className="mb-8 text-lg">
        Here are some of the technical skills I&apos;ve learned during my degree, work, and just out
        of curiosity.
      </p>
      <div className="space-y-4 text-center text-sm">
        <SkillsArea staticFallback={<StaticSkillsArea skillIndexes={skillIndexes} />} />

        <p>
          Want to see a pointlessly long list of languages I&apos;ve used?
          <br />
          Check out my{' '}
          <CustomLink href="/snippets/hello-world" className="font-mono">
            hello-world
          </CustomLink>{' '}
          snippet.
        </p>
      </div>
    </LandingSection>
  )
}

export default Skills
