import type { PropsWithChildren } from 'react'

export const PostHeading: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <h1
      className="text-drac-pink text-safe-pretty mt-0 mb-20 text-center text-5xl leading-tight! [--heading-padding:1rem] sm:mt-8 sm:text-6xl md:text-7xl lg:mb-16 lg:text-8xl lg:[--heading-padding:8rem]"
      style={{
        overflowWrap: 'break-word',
        '--width': 'calc(100vw - var(--heading-padding))',
        width: 'var(--width)',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: 'calc(var(--width) / -2)',
        marginRight: 'calc(var(--width) / -2)',
        textAlign: 'center',
      }}
    >
      <span className="inline-block max-w-(--breakpoint-xl)">
        {typeof children === 'string'
          ? children
              .split(' ')
              .map((word) =>
                word
                  .replace(/[a-z][A-Z]/g, (m) => `${m[0]} ${m[1]}`)
                  .split(' ')
                  .flatMap((chunk, i) => (i === 0 ? [chunk] : [<wbr key={i} />, chunk])),
              )
              .map((word, i) => {
                if (i === 0) return word
                return [' ', word]
              })
          : children}
      </span>
    </h1>
  )
}
