import cx from '~/utils/cx'
import { JSXElement, ParentComponent } from 'solid-js'

const classes = {
  secondary:
    'hidden sm:block absolute inset-0 select-none contrast-more:sm:hidden pointer-events-none',
  main: 'relative cursor-text inset-0 bg-gradient-to-tr from-drac-pink to-drac-purple bg-clip-text text-transparent sm:text-drac-content contrast-more:sm:text-drac-pink contrast-more:scale-110',
}

const Hero: ParentComponent<{
  subtitle?: JSXElement | null
  title: JSXElement
}> = props => {
  return (
    <div
      id="hero"
      class="circuit-bg overflow-x-hidden pb-12 nmp-4 nmpt-36 nmpx-4 md:nmpx-8 lg:nmpx-20 xl:nmpx-32 2xl:nmpx-40"
    >
      <div class="mx-auto my-4 cursor-default py-16 text-center font-display text-6xl font-bold leading-tight outline-none sm:my-8 sm:text-[4rem] md:text-[5rem] lg:text-8xl">
        <div class="relative">
          <p
            aria-hidden
            role="presentation"
            class={cx(
              `-translate-x-4 -translate-y-4 text-drac-pink sm:-translate-x-8 sm:-translate-y-8`,
              classes.secondary
            )}
          >
            {props.title}
          </p>
          <h1 class={classes.main}>{props.title}</h1>
          <p
            aria-hidden
            role="presentation"
            class={cx(
              `translate-x-4 translate-y-4 text-drac-purple sm:translate-x-8 sm:translate-y-8`,
              classes.secondary
            )}
          >
            {props.title}
          </p>
        </div>
      </div>
      {props.subtitle ? (
        <h2 class="mb-8 text-2xl sm:my-8 sm:text-2xl md:text-3xl" id="hero-subtitle">
          {props.subtitle}
        </h2>
      ) : null}
      {props.children}
    </div>
  )
}

export default Hero
