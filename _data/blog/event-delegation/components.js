import { useRef } from 'react'

export const BubblingDemo = () => {
  const handleClick = event => {
    const delay =
      parseInt(event.currentTarget.dataset.layer) -
      parseInt(event.target.dataset.layer)

    const el = event.currentTarget

    const timeoutMult = 200

    setTimeout(() => {
      el.classList.add('clicked')
      setTimeout(() => {
        el.classList.remove('clicked')
      }, timeoutMult)
    }, delay * timeoutMult)
    console.log(delay)
  }
  return (
    <>
      <section
        data-layer={3}
        data-el="section"
        style={{ background: 'mediumaquamarine' }}
        onClick={handleClick}
      >
        <div
          data-layer={2}
          data-el="div"
          style={{ background: 'lightcoral', minWidth: '75%' }}
          onClick={handleClick}
        >
          <p
            data-layer={1}
            data-el="p"
            style={{
              background: 'lightblue',
              margin: 0,
              minWidth: '50%',
            }}
            onClick={handleClick}
          >
            <button
              data-layer={0}
              data-el="button"
              style={{
                background: 'lightgreen',
                color: 'var(--base)',
              }}
              onClick={handleClick}
            >
              Click me!
            </button>
          </p>
        </div>
      </section>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        [data-layer] {
          display: grid;
          place-items: center;
          padding: 1rem;
          position: relative;
          border-radius: 0.25rem;
          overflow: hidden;
        }
        [data-layer].clicked:before {
          content: 'clicked!';
          position: absolute;
          background: var(--base);
          padding: 0 0.25rem;
          top: 0;
          left: 0;
          width: max-content;
          color: var(--content);
          font-size: 11px;
        }
        [data-el]:after {
          content: '<' attr(data-el) '>';
          position: absolute;
          color: var(--base);
          bottom: 0;
          right: 0;
          font-size: 10px;
          padding: 0 0.125rem;
        }
      `,
        }}
      />
    </>
  )
}
