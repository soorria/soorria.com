'use client'

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import cx from '~/utils/cx'
import { CODE_BLOCK_CLASSNAMES, LANGUAGE_NAME_MAP } from './utils'

// Standalone copy button that doesn't use hooks (for portal rendering)
const CopyButton = ({ pre }: { pre: HTMLPreElement }) => {
  const handleCopy = async () => {
    const button = document.activeElement as HTMLButtonElement
    const code = pre.querySelector('code')
    const text = code?.innerText || pre.innerText

    try {
      await navigator.clipboard.writeText(text)
      button.querySelector('.copy-text')?.classList.add('hidden')
      button.querySelector('.copied-text')?.classList.remove('hidden')

      setTimeout(() => {
        button.querySelector('.copy-text')?.classList.remove('hidden')
        button.querySelector('.copied-text')?.classList.add('hidden')
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      type="button"
      className={CODE_BLOCK_CLASSNAMES.button}
      onClick={handleCopy}
    >
      <span className="copy-text">copy</span>
      <span className="copied-text hidden">copied</span>
    </button>
  )
}

export const CodeBlockEnhancer: React.FC = () => {
  const enhancedRef = useRef(false)

  useEffect(() => {
    if (enhancedRef.current) return
    enhancedRef.current = true

    // Find all code blocks that haven't been enhanced
    const codeBlocks = document.querySelectorAll('pre[data-language]:not(.enhanced)')

    codeBlocks.forEach((pre) => {
      const preEl = pre as HTMLPreElement
      preEl.classList.add('enhanced')

      // Get language from data attribute
      const language = preEl.dataset.language
      const displayLanguage = (language && LANGUAGE_NAME_MAP[language]) || language || ''

      // Create wrapper
      const wrapper = document.createElement('div')
      wrapper.className = cx('code-block', CODE_BLOCK_CLASSNAMES.root)

      // Create header
      const header = document.createElement('div')
      header.className = CODE_BLOCK_CLASSNAMES.header

      // Language label
      const langLabel = document.createElement('div')
      langLabel.className = CODE_BLOCK_CLASSNAMES.languageTitle
      langLabel.textContent = displayLanguage
      header.appendChild(langLabel)

      // Spacer
      const spacer = document.createElement('div')
      spacer.className = 'flex-1'
      header.appendChild(spacer)

      // Copy button container
      const buttonContainer = document.createElement('div')
      buttonContainer.className = 'copy-button-container'
      header.appendChild(buttonContainer)

      // Insert wrapper around pre
      preEl.parentNode?.insertBefore(wrapper, preEl)
      wrapper.appendChild(header)
      wrapper.appendChild(preEl)

      // Add copy button styling class to pre
      preEl.classList.add(CODE_BLOCK_CLASSNAMES.pre)

      // Render React copy button into container
      const root = createRoot(buttonContainer)
      root.render(<CopyButton pre={preEl} />)
    })
  }, [])

  return null
}
