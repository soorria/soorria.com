import { VoidComponent } from 'solid-js'

const styles = [
  '.no-js-block{display:block !important}',
  '.no-js-text{color:#f8f8f2 !important}',
  '.no-js-hidden{display:none}',
].join('')

const NoJsStyles: VoidComponent = () => {
  return (
    <noscript>
      <style>{styles}</style>
    </noscript>
  )
}

export default NoJsStyles
