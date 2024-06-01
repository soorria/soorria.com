'use client'

import {
  useCallback,
  useReducer,
  useState,
  useEffect,
  useRef,
  type RefObject,
  useLayoutEffect,
} from 'react'
import { getRandomSkillIndexes, SKILLS, type SkillDefinition } from '~/lib/skills/definitions'
import cx from '~/utils/cx'
import CustomLink from '../CustomLink'
import { RefreshIcon } from '../icons'
import LandingSection from './LandingSection'

const titles = ["What I've Learned", 'Technical Skills', 'Tools I Use']

export type UseSkillsInput = {
  defaultIndexes?: number[]
  defaultShowAll?: boolean
}

export type UseSkillsResult = {
  skills: typeof SKILLS
  shuffle: (n?: number) => void
  showAll: boolean
  toggleShowAll: (next?: boolean) => void
}

const useSkills = ({ defaultIndexes, defaultShowAll = false }: UseSkillsInput): UseSkillsResult => {
  const [indexes, setIndexes] = useState(() => {
    if (defaultIndexes) return defaultIndexes
    return getRandomSkillIndexes()
  })
  const shuffle = useCallback(
    (n?: number) => {
      setIndexes(getRandomSkillIndexes(n ?? indexes.length))
    },
    [indexes.length]
  )

  const [showAll, toggleShowAll] = useReducer<(v: boolean, next?: boolean) => boolean, boolean>(
    (v, next) => (typeof next === 'undefined' ? !v : next),
    defaultShowAll,
    () => defaultShowAll
  )

  const skills = showAll ? SKILLS : indexes.map(i => SKILLS[i]!)

  return { skills, shuffle, toggleShowAll, showAll }
}

const classes = {
  buttonCommon:
    'rounded bg-drac-base-light px-2 py-1 text-drac-content transition-colors hocus:text-drac-purple focus-ring',
}

const MAGIC_NUMBERS = {
  rootWidthPx: 832,
  imageWidthPx: 86,
  numColumns: 4,
  gapPx: 48,
  aspectRatio: 16 / 9,
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

type Position = { x: number; y: number }
type OnItemPositionChangeHandler = (id: string, updatedPosition: Position) => void

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
  position: Position
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
        'group absolute block w-fit',
        moving ? 'cursor-grabbing' : 'cursor-grab transition-transform'
      )}
      style={{ transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))` }}
      draggable={false}
    >
      {/* eslint-disable-next-line */}
      <img
        src={skill.img?.src}
        alt={`${skill.label} logo`}
        className=""
        style={{ width: imageWidth, height: 'auto', maxHeight: imageWidth }}
        draggable={false}
      />
      <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs opacity-0 transition-opacity group-hover:opacity-100 md:-bottom-6 md:text-sm">
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

const getId = () => {
  return crypto.randomUUID?.() ?? Math.random().toString()
}

function SkillsArea(props: { skills: (SkillDefinition & { id: string })[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const width = useDebouncedValue(useElementWidth(rootRef))
  const ready = width !== 0
  const height = width / MAGIC_NUMBERS.aspectRatio

  const scale = width / MAGIC_NUMBERS.rootWidthPx
  const unscaledImageWidth = MAGIC_NUMBERS.imageWidthPx
  const imageWidth = unscaledImageWidth * scale

  const skills = props.skills

  const [savedPositions, setSavedPositions] = useState<Record<string, Position>>({})

  const positions = skills.map((skill, i) => {
    const saved = savedPositions[skill.id]
    if (saved) {
      const { x, y } = saved
      return { x: x * scale, y: y * scale }
    }

    const rowNumber = Math.floor(i / MAGIC_NUMBERS.numColumns)
    const colNumber = i - rowNumber * MAGIC_NUMBERS.numColumns

    const columnWidth = width / MAGIC_NUMBERS.numColumns
    const centerOfColumn = (colNumber + 0.5) * columnWidth

    const rowHeight = height / 2
    const centerOfRow = (rowNumber + 0.5) * rowHeight

    return {
      x: centerOfColumn,
      y: centerOfRow,
    }
  })

  const handleItemPositionChange: OnItemPositionChangeHandler = useCallback(
    (id, newPosition) => {
      setSavedPositions(savedPositions => ({
        ...savedPositions,
        [id]: {
          x: newPosition.x / scale,
          y: newPosition.y / scale,
        },
      }))
    },
    [scale]
  )

  return (
    <div ref={rootRef} className="relative mb-8 aspect-video overflow-visible">
      {ready &&
        skills.map((skill, i) => {
          return (
            <SkillItem
              imageWidth={imageWidth}
              position={positions[i]!}
              skill={skill}
              key={skill.label}
              onPositionChange={handleItemPositionChange}
              containerRef={rootRef}
            />
          )
        })}

      <div
        className={cx(
          'pointer-events-none absolute inset-0 grid items-center justify-around justify-items-center opacity-0 transition-opacity',
          !ready && 'pointer-events-auto opacity-100'
        )}
        style={{
          gridTemplateColumns: `repeat(4, ${(
            (MAGIC_NUMBERS.imageWidthPx / MAGIC_NUMBERS.rootWidthPx) *
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
                src={skill.img?.src}
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
    </div>
  )
}

const Skills: React.FC<{ random?: number; skillIndexes?: number[] }> = ({
  random = 0,
  skillIndexes,
}) => {
  const { shuffle, toggleShowAll, showAll, skills } = useSkills({ defaultIndexes: skillIndexes })
  const title = titles[random % titles.length]

  return (
    <LandingSection id="skills" title={title}>
      <p className="mb-8 text-lg">
        Here are some of the technical skills I&apos;ve learned during my degree, work, and just out
        of curiosity.
      </p>
      <div className="space-y-4 text-center text-sm">
        <SkillsArea skills={skills.map(s => ({ ...s, id: s.label.toLowerCase() }))} />

        <div className="flex items-center justify-center space-x-1">
          <button onClick={() => toggleShowAll()} className={classes.buttonCommon}>
            {showAll ? 'Show a random set of my skills' : "Show all the tech I've learned"}
          </button>
          <span>&nbsp;/&nbsp;</span>
          <button
            onClick={() => {
              if (showAll) toggleShowAll(false)
              shuffle()
            }}
            className={cx('flex items-center', classes.buttonCommon)}
          >
            <RefreshIcon className="mr-1 inline-block h-em w-em" /> Randomise skills
          </button>
        </div>
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
