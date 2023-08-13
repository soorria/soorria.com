'use client'

import { useEffect, useRef } from 'react'
import cx from '~/utils/cx'
import { createNonRepeatRandomItem, random } from '~/utils/random'
import { useHydrated } from '~/utils/use-hydrated'

type MagicSprinklesProps = { fade?: boolean; isInHero?: boolean }
export const MagicSprinkles = (props: MagicSprinklesProps) => {
  const hydrated = useHydrated()

  if (!hydrated) return null

  return <Canvas {...props} />
}
export default MagicSprinkles

const masks = {
  ltr: 'linear-gradient(to left, transparent, black 10%, black 90%, transparent)',
  ttb: 'linear-gradient(to bottom, transparent, black 10%, black 75%, transparent)',
}

const Canvas = (props: MagicSprinklesProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const container = containerRef.current

    if (!ctx || !canvas || !container) return

    return draw(ctx, canvas, container)
  }, [])

  return (
    <div
      className={cx(
        'fade-in-direct absolute inset-0 -z-10 overflow-hidden bg-drac-base',
        props.isInHero && '-bottom-16'
      )}
      aria-hidden
    >
      <div
        ref={containerRef}
        className="absolute inset-0 -inset-x-8"
        style={
          props.fade
            ? {
                WebkitMaskImage: masks.ttb,
                maskImage: masks.ttb,
              }
            : undefined
        }
      >
        <canvas
          className={cx('h-full w-full', props.isInHero && 'opacity-50')}
          width="1920"
          height="1080"
          ref={canvasRef}
          style={
            props.fade
              ? {
                  WebkitMaskImage: masks.ltr,
                  maskImage: masks.ltr,
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}

const draw = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  container: HTMLDivElement
): (() => void) | void => {
  const { devicePixelRatio: ratio = 1 } = window
  const query = Object.fromEntries(new URLSearchParams(window.location.search))

  const style = getComputedStyle(canvas)
  const colors = {
    pink: style.getPropertyValue('--pink'),
    purple: style.getPropertyValue('--purple'),
    red: style.getPropertyValue('--red'),
    green: style.getPropertyValue('--green'),
    cyan: style.getPropertyValue('--cyan'),
    base: style.getPropertyValue('--base'),
  }
  const availablePatternColors = [colors.pink, colors.purple, colors.green, colors.cyan]

  let width = 0
  let height = 0
  let frame: number | null
  let stopped = false

  const CELL_WIDTH = 30
  const CELL_SCALE = Math.round(CELL_WIDTH / 30)
  const STROKE_WIDTH = 2
  const CELL_HALF_WIDTH = CELL_WIDTH / 2
  const RESET_DELAY_MS = 500 // 1000
  const RESET_DURATION_MS = 1000
  const INACTIVE_DELAY = 1000
  const PI = Math.PI
  const TAU = PI * 2

  const BASE_GRID_SIZE = 10

  /**
   * Position in canvas
   */
  let mouse = { x: -1000, y: -1000 }

  type Point = [x: number, y: number]
  type Line = [Point, ...Point[]]
  type Pattern = [Line, ...Line[]]

  const debugPattern: Pattern = [
    [
      [0, -7],
      [0, 2],
    ],
    [
      [-2, -3],
      [0, -7],
      [2, -3],
    ],
    [
      [0, 6],
      [0, 8],
    ],
  ]

  const availablePatterns: Pattern[] = query.debugPattern
    ? [debugPattern]
    : [
        //

        [
          [
            [-4, -9],
            [-3, 8],
          ],
          [
            [3, -7],
            [2, 6],
          ],
        ],

        [
          [
            [-3, -8],
            [-3, 8],
          ],
          [
            [3, -8],
            [3, 8],
          ],
        ],

        [
          [
            [-2, -9],
            [-3, 8],
          ],
          [
            [3, -7],
            [4, 6],
          ],
        ],

        [
          [
            [-3, -9],
            [-4, -3],
            [-4, 0],
            [-3, 6],
          ],
          [
            [4, -9],
            [3, -3],
            [2, 0],
            [2, 3],
            [3, 6],
          ],
        ],

        //
      ]

  const getRandomXOffset = createNonRepeatRandomItem([-4, -2, 2, 4])
  const getRandomYOffset = createNonRepeatRandomItem([-4, -2, 2, 4])
  const getRandomColor = createNonRepeatRandomItem(availablePatternColors)
  const getRandomPattern = createNonRepeatRandomItem(availablePatterns)

  const baseGridPattern = Array.from({ length: BASE_GRID_SIZE }, (_, _row) =>
    Array.from({ length: BASE_GRID_SIZE }, (_, _column) => {
      return {
        pattern: getRandomPattern(),
        color: getRandomColor(),
        defaultAngle: query.debugNoRandomAngle ? 0 : Math.random() * TAU,
        lastAngle: 0,
        lastAngleTime: 0,
        xOffset: getRandomXOffset(),
        yOffset: getRandomYOffset(),
      }
    })
  )

  let grid = baseGridPattern

  const handleResize = () => {
    const rect = container.getBoundingClientRect()
    if (rect.width === width && rect.height === height) return

    width = rect.width
    height = rect.height

    canvas.width = width * ratio
    canvas.height = height * ratio

    const rows = Math.ceil(height / CELL_WIDTH)
    const columns = Math.ceil(width / CELL_WIDTH)

    grid = Array.from({ length: rows }, (_, rowIdx) =>
      Array.from({ length: columns }, (_, colIdx) => {
        const row = baseGridPattern[rowIdx % baseGridPattern.length]!
        return structuredClone(row![colIdx % row.length]!)
      })
    )

    // grid = [[grid[0]![0]!]]
  }
  handleResize()
  window.addEventListener('resize', handleResize)

  let mouseInactiveTimeout: ReturnType<typeof setTimeout> | null = null
  const queueInactive = () => {
    mouseInactiveTimeout = setTimeout(handleMouseInactive, INACTIVE_DELAY)
  }
  const handleMouseInactive = () => {
    // mouse = {
    //   x: random(0, width),
    //   y: random(0, height),
    // }

    queueInactive()
  }
  queueInactive()

  const handlePointerMove = (_e: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect()
    const isTouch = _e.type === 'touchmove'

    if (mouseInactiveTimeout) {
      clearTimeout(mouseInactiveTimeout)
    }
    mouseInactiveTimeout = setTimeout(handleMouseInactive, INACTIVE_DELAY)

    if (isTouch) {
      const e = _e as TouchEvent
      if (e.touches.length !== 1) return
      const touch = e.touches[0]!
      mouse = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    } else {
      const e = _e as MouseEvent

      mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }
  window.addEventListener('mousemove', handlePointerMove)
  window.addEventListener('touchmove', handlePointerMove)

  const handleTouchUpDown = (e: TouchEvent) => {
    if (e.type === 'touchstart') {
      if (e.touches.length !== 1) return
      const touch = e.touches[0]!
      const isOnLink = !!(touch.target as HTMLElement).closest('a')
      if (isOnLink) return

      const containerRect = container.getBoundingClientRect()
      const isOverContainer =
        touch.clientX >= containerRect.left &&
        touch.clientX <= containerRect.right &&
        touch.clientY >= containerRect.top &&
        touch.clientY <= containerRect.bottom

      if (!isOverContainer) return
      e.preventDefault()
    } else if (e.type === 'touchend') {
      mouse = { x: -Infinity, y: -Infinity }
    }
  }
  window.addEventListener('touchstart', handleTouchUpDown, { passive: false })
  window.addEventListener('touchend', handleTouchUpDown)

  const draw = () => {
    if (stopped) return
    ctx.save()
    ctx.scale(ratio, ratio)

    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = 'var(--pink)'

    const now = Date.now()

    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
      const row = grid[rowIdx]!
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const cell = row[colIdx]!

        const cellX = colIdx * CELL_WIDTH + CELL_HALF_WIDTH + cell.xOffset
        const cellY = rowIdx * CELL_WIDTH + CELL_HALF_WIDTH + cell.yOffset

        const dx = mouse.x - cellX
        const dy = mouse.y - cellY

        const inRange = dx ** 2 + dy ** 2 <= (CELL_WIDTH * 2.5) ** 2

        ctx.save()
        ctx.translate(cellX, cellY)
        // if (mouseDown && inRange) {
        //   ctx.scale(1.5, 1.5)
        // }
        ctx.lineCap = 'round'
        ctx.lineWidth = STROKE_WIDTH

        const color =
          cell.lastAngle !== cell.defaultAngle ? cell.color : addOpacity(cell.color, 0.5)

        ctx.strokeStyle = color

        // ctx.fillStyle = colors.purple
        // ctx.fillRect(
        //   -CELL_HALF_WIDTH + CELL_SCALE,
        //   -CELL_HALF_WIDTH + CELL_SCALE,
        //   CELL_WIDTH - CELL_SCALE * 2,
        //   CELL_WIDTH - CELL_SCALE * 2
        // )
        // ctx.fillStyle = colors.base
        // ctx.fillRect(
        //   -CELL_HALF_WIDTH + CELL_SCALE * 1.5,
        //   -CELL_HALF_WIDTH + CELL_SCALE * 1.5,
        //   CELL_WIDTH - CELL_SCALE * 3,
        //   CELL_WIDTH - CELL_SCALE * 3
        // )

        let angle: number = cell.defaultAngle

        // ctx.beginPath()
        // ctx.moveTo(0, 0)
        // ctx.lineTo(0, dy)
        // ctx.stroke()
        // ctx.beginPath()
        // ctx.moveTo(0, 0)
        // ctx.lineTo(dx, 0)
        // ctx.stroke()

        if (inRange) {
          let targetAngle = Math.atan2(dy, dx) + PI * 0.5
          const diff = targetAngle - cell.defaultAngle
          if (diff > PI) {
            targetAngle -= TAU
          } else if (diff < -PI) {
            targetAngle += TAU
          }
          cell.lastAngle = targetAngle
          if (targetAngle !== cell.defaultAngle) {
            cell.lastAngleTime = now
          }
          angle = targetAngle
        } else if (cell.lastAngle !== cell.defaultAngle) {
          const timeSinceLastAngle = now - cell.lastAngleTime

          if (timeSinceLastAngle < RESET_DELAY_MS) {
            angle = cell.lastAngle
          } else {
            angle =
              cell.lastAngle +
              (cell.defaultAngle - cell.lastAngle) *
                easeInOutCubic((timeSinceLastAngle - RESET_DELAY_MS) / RESET_DURATION_MS)
            const diff = Math.abs(angle - cell.defaultAngle)
            if (
              diff < 0.001 ||
              (cell.lastAngle < cell.defaultAngle && angle > cell.defaultAngle) ||
              (cell.lastAngle > cell.defaultAngle && angle < cell.defaultAngle)
            ) {
              angle = cell.defaultAngle
              cell.lastAngle = cell.defaultAngle
            }
          }
        }

        ctx.rotate(angle)
        for (const line of cell.pattern) {
          ctx.beginPath()
          const [point, ...rest] = line
          ctx.moveTo(point[0] * CELL_SCALE, point[1] * CELL_SCALE)

          for (const p of rest) {
            ctx.lineTo(p[0] * CELL_SCALE, p[1] * CELL_SCALE)
          }
          ctx.stroke()
        }

        ctx.restore()
      }
    }

    ctx.restore()

    // new Promise(resolve => setTimeout(resolve, 1000 / 10)).then(() => {
    //   frame = requestAnimationFrame(draw)
    // })
    frame = requestAnimationFrame(draw)
  }

  draw()

  return () => {
    if (frame) {
      cancelAnimationFrame(frame)
    }
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handlePointerMove)
    window.removeEventListener('touchmove', handlePointerMove)

    window.removeEventListener('touchstart', handleTouchUpDown)
    window.removeEventListener('touchend', handleTouchUpDown)
    stopped = true
  }
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

function addOpacity(color: string, opacity: number): string {
  if (color.startsWith('#')) {
    return `${color}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')}`
  }
  return color
}