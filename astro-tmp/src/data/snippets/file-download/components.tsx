'use client'

import type { CSSProperties } from 'react'

const download = (content: string | Blob, fileName: string, type: string) => {
  const blob =
    typeof content === 'string' ? new Blob([content], { type }) : content
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = fileName
  a.rel = 'noopener'
  a.dispatchEvent(new MouseEvent('click'))
}

const styles = {
  button: {
    padding: '0.5rem 1rem',
    background: 'var(--pink)',
    color: 'var(--bg)',
    textAlign: 'center',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
} satisfies Record<string, CSSProperties>

export const Example = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
      }}
    >
      <button
        style={styles.button}
        onClick={() =>
          download(
            document.documentElement.outerHTML,
            'file-download-js.html',
            'text/html'
          )
        }
      >
        Download Page HTML (JS)
      </button>
      <a
        style={styles.button}
        href="/api/og?category=File%20Downloads"
        rel="noopener"
        download="file-download-no-js.png"
      >
        Download An Image (No JS)
      </a>
    </div>
  )
}
