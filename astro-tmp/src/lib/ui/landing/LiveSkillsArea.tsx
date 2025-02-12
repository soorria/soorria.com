import usePartySocket from 'partysocket/react'
import { useCallback, useRef, useState, type RefObject, useEffect } from 'react'
import { SKILLS_MAGIC_NUMBERS } from '~/lib/skills/definitions'
import { skillLabelToImage } from '~/lib/skills/images'
import type {
  ClientMessage,
  ServerMessage,
  ServerSkillItem,
  SkillPosition,
} from '~/lib/skills/schema'
import { cx } from '~/lib/utils/styles'
import { RefreshIcon } from '../icons'
import { createTrackFirstEvent } from '~/lib/analytics/utils'

const track = createTrackFirstEvent()

function useLiveSkills({ scale }: { scale: number }) {
  const [state, setState] = useState<{
    ready: boolean
    items: ServerSkillItem[]
    numConnections: number
  }>({
    ready: false,
    items: [],
    numConnections: 9,
  })
  const lastSentDetailsRef = useRef<{
    lastSentAt: number
    timeouts: Record<string, ReturnType<typeof setTimeout>>
  }>({
    lastSentAt: 0,
    timeouts: {},
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
          items: message.items,
          numConnections: message.numConnections,
        })
      } else if (message.type === 'connections-updated') {
        setState((s) => ({
          ...s,
          numConnections: message.numConnections,
        }))
      } else if (message.type === 'items-updated') {
        setState((s) => ({
          ...s,
          items: message.items,
        }))
      }
    },
  })

  const sendMessage = useCallback(
    (message: ClientMessage) => {
      ws.send(JSON.stringify(message))
    },
    [ws],
  )

  const moveItem = useCallback<OnItemPositionChangeHandler>(
    (id, newPosition) => {
      track('Play with skills', { props: {} })

      const unscaledPosition = scalePosition(newPosition, 1 / scale)

      setState((s) => ({
        ...s,
        items: s.items.map((item) => {
          if (item.id !== id) {
            return item
          }
          return {
            ...item,
            position: unscaledPosition,
          }
        }),
      }))

      const now = Date.now()
      const nextSendAt =
        lastSentDetailsRef.current.lastSentAt + SKILLS_MAGIC_NUMBERS.sendMessageTimeoutMs

      if (lastSentDetailsRef.current.timeouts[id]) {
        clearTimeout(lastSentDetailsRef.current.timeouts[id])
      }

      if (now < nextSendAt) {
        lastSentDetailsRef.current.timeouts[id] = setTimeout(() => {
          lastSentDetailsRef.current.lastSentAt = now
          sendMessage({
            type: 'move-item',
            itemId: id,
            newPosition: unscaledPosition,
          })
        }, SKILLS_MAGIC_NUMBERS.sendMessageTimeoutMs)
      } else {
        lastSentDetailsRef.current.lastSentAt = now
        sendMessage({
          type: 'move-item',
          itemId: id,
          newPosition: unscaledPosition,
        })
      }
    },
    [scale, sendMessage],
  )

  const addMore = useCallback(() => {
    sendMessage({
      type: 'add-more',
    })
  }, [sendMessage])

  return {
    ready: state.ready,
    skills: state.items.map((item) => ({ ...item, position: scalePosition(item.position, scale) })),
    numConnections: state.numConnections,
    moveItem,
    addMore,
  }
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
  skill: ServerSkillItem
  imageWidth: number
  position: SkillPosition
  onPositionChange?: OnItemPositionChangeHandler
  containerRef: RefObject<HTMLElement | null>
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

    const abortController = new AbortController()

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

    el.addEventListener('mousedown', handlePointerStart, {
      signal: abortController.signal,
    })
    el.addEventListener('touchstart', handlePointerStart, {
      signal: abortController.signal,
    })

    return () => {
      abortController.abort()
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
          containerRect.width - halfElementWidth,
        ),
        y: clamp(touch.clientY + moving.offset.y - containerRect.y, 0, containerRect.height),
      }

      onPositionChange?.(skill.id, update)
    }

    const abortController = new AbortController()

    window.addEventListener('mouseup', handleMouseUp, { signal: abortController.signal })
    window.addEventListener('touchend', handleMouseUp, { signal: abortController.signal })
    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
      signal: abortController.signal,
    })
    window.addEventListener('touchmove', handleMouseMove, {
      passive: true,
      signal: abortController.signal,
    })

    return () => {
      abortController.abort()
    }
  }, [moving, skill.id, onPositionChange, containerRef])

  return (
    <button
      ref={element}
      className={cx(
        'fade-in-direct group absolute block w-fit ease-linear select-none',
        moving ? 'cursor-grabbing' : 'cursor-grab transition-transform',
      )}
      style={{ transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))` }}
      draggable={false}
    >
      {/* eslint-disable-next-line */}
      <img
        src={skillLabelToImage[skill.label as keyof typeof skillLabelToImage]?.src}
        alt={`${skill.label} logo`}
        className=""
        style={{ width: imageWidth, height: 'auto', maxHeight: imageWidth }}
        draggable={false}
      />
      <span className="pointer-fine:group-hocus-visible:opacity-100 pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs opacity-0 transition-opacity md:-bottom-6 md:text-sm">
        {skill.label}
      </span>
    </button>
  )
}

export function LiveSkillsArea(props: {
  scale: number
  imageWidth: number
  rootRef: RefObject<HTMLElement | null>
}) {
  const liveSkills = useLiveSkills({
    scale: props.scale,
  })
  return (
    <>
      {liveSkills.skills.map((skill) => {
        return (
          <SkillItem
            imageWidth={props.imageWidth}
            position={skill.position}
            skill={skill}
            key={skill.id}
            onPositionChange={liveSkills.moveItem}
            containerRef={props.rootRef}
          />
        )
      })}

      <button
        onClick={() => {
          liveSkills.addMore()
        }}
        className="focus-ring bg-drac-base text-drac-content hocus:text-drac-purple absolute bottom-1 left-0 flex items-center rounded-sm px-2 py-1 opacity-50 transition hover:opacity-100"
      >
        <RefreshIcon className="h-em w-em mr-1 inline-block" /> See more skills
      </button>

      <div className="bg-drac-base absolute right-0 bottom-1 rounded-sm px-1 text-xs opacity-50 transition-opacity hover:opacity-100 md:text-sm">
        {liveSkills.numConnections === 1
          ? 'just you online :('
          : `${liveSkills.numConnections} people online`}
      </div>
    </>
  )
}

function scalePosition(position: SkillPosition, scale: number) {
  return {
    x: Math.round(position.x * scale),
    y: Math.round(position.y * scale),
  }
}
