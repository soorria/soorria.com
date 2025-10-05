'use client'
import usePartySocket from 'partysocket/react'
import { useCallback, useRef, useState, type RefObject, useEffect } from 'react'
import { SKILLS_MAGIC_NUMBERS } from '~/lib/skills/definitions'
import { skillLabelToImage } from '~/lib/skills/images'
import type {
  ClientMessage,
  ServerMessage,
  ServerSkillItem,
  SkillPosition,
} from '~/lib/skills/schems'
import cx from '~/utils/cx'
import { RefreshIcon } from '../icons'
import { useTrackFirstEvent } from '~/lib/analytics'

function useLiveSkills({ scale }: { scale: number }) {
  const track = useTrackFirstEvent()

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
        setState(s => ({
          ...s,
          numConnections: message.numConnections,
        }))
      } else if (message.type === 'items-updated') {
        setState(s => ({
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
    [ws]
  )

  const moveItem = useCallback<OnItemPositionChangeHandler>(
    (id, newPosition) => {
      track('Play with skills')

      const unscaledPosition = scalePosition(newPosition, 1 / scale)

      setState(s => ({
        ...s,
        items: s.items.map(item => {
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
    [scale, sendMessage, track]
  )

  const addMore = useCallback(() => {
    sendMessage({
      type: 'add-more',
    })
  }, [sendMessage])

  return {
    ready: state.ready,
    skills: state.items.map(item => ({ ...item, position: scalePosition(item.position, scale) })),
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
      className={cx(
        'fade-in-direct group absolute block w-fit select-none ease-linear',
        moving ? 'cursor-grabbing' : 'cursor-grab transition-transform'
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
      <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs opacity-0 transition-opacity group-hocus-visible:opacity-100 md:-bottom-6 md:text-sm">
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
      {liveSkills.skills.map(skill => {
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
        className="focus-ring absolute bottom-1 left-0 flex items-center rounded-sm bg-drac-base px-2 py-1 text-drac-content opacity-50 transition hover:opacity-100 hocus:text-drac-purple"
      >
        <RefreshIcon className="mr-1 inline-block h-em w-em" /> See more skills
      </button>

      <div className="absolute bottom-1 right-0 rounded-sm bg-drac-base px-1 text-xs opacity-50 transition-opacity hover:opacity-100 md:text-sm">
        {liveSkills.numConnections === 1
          ? 'just you online :('
          : `${liveSkills.numConnections} people online`}
      </div>

      {process.env.NODE_ENV === 'development' && (
        <details>
          <summary>All skills</summary>

          <div
            className="grid gap-8"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${props.imageWidth * 1.2}px, 1fr))`,
            }}
          >
            {Object.entries(skillLabelToImage).map(([label, image]) => {
              return (
                <button
                  key={label}
                  className={cx(
                    'fade-in-direct relative group block w-fit select-none ease-linear'
                  )}
                  draggable={false}
                >
                  {/* eslint-disable-next-line */}
                  <img
                    src={image.src}
                    alt=""
                    className=""
                    style={{ width: props.imageWidth, height: 'auto', maxHeight: props.imageWidth }}
                    draggable={false}
                  />
                  <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs opacity-0 transition-opacity group-hocus-visible:opacity-100 md:-bottom-6 md:text-sm">
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </details>
      )}
    </>
  )
}

function scalePosition(position: SkillPosition, scale: number) {
  return {
    x: Math.round(position.x * scale),
    y: Math.round(position.y * scale),
  }
}
