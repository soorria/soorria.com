'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import type { DataType } from '~/types/data'
import type { LooseAutoComplete } from '~/utils/types'

type Theme = LooseAutoComplete<
  | 'light'
  | 'light_high_contrast'
  | 'light_protanopia'
  | 'light_tritanopia'
  | 'dark'
  | 'dark_high_contrast'
  | 'dark_protanopia'
  | 'dark_tritanopia'
  | 'dark_dimmed'
  | 'preferred_color_scheme'
  | 'transparent_dark'
  | 'noborder_light'
  | 'noborder_dark'
  | 'noborder_gray'
  | 'cobalt'
  | 'purple_dark'
  | 'gruvbox'
  | 'gruvbox_dark'
  | 'gruvbox_light'
  | 'catppuccin_latte'
  | 'catppuccin_frappe'
  | 'catppuccin_macchiato'
  | 'catppuccin_mocha'
  | 'fro'
  | `https://${string}`
>

interface GiscusProps {
  dataType: DataType
  slug: string
}
const repo = 'soorria/soorria.com' as const
const repoId = 'MDEwOlJlcG9zaXRvcnkzMjYzNDI3NDc=' as const
const category = 'Announcements' as const
const categoryId = 'DIC_kwDOE3OYW84CvtHS' as const
const theme =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000/giscus.css'
    : 'https://soorria.com/giscus.css'

const GISCUS_SESSION_KEY = 'giscus-session'
const GISCUS_DEFAULT_HOST = 'https://giscus.app'
const ERROR_SUGGESTION = `Please consider reporting this error at https://github.com/giscus/giscus/issues/new.`

const iframeStyles: React.CSSProperties = {
  width: '100%',
  border: 'none',
  minHeight: '150px',
  colorScheme: 'light dark',
}

const loadingStyles: React.CSSProperties = {
  opacity: 0,
}

export default function GiscusClientComponent({ dataType, slug }: GiscusProps) {
  const term = `${dataType}/${slug}`

  const [session, setSession] = useState('')
  const [hasLoaded, setHasLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const signOut = useCallback(() => {
    localStorage.removeItem(GISCUS_SESSION_KEY)
    // Force re-render by updating session
    setSession('')
  }, [])

  const handleMessageEvent = useCallback(
    (event: MessageEvent<GiscusMessage>) => {
      if (event.origin !== GISCUS_DEFAULT_HOST) return

      const { data } = event
      if (!(typeof data === 'object' && data.giscus)) return

      if (iframeRef.current && data.giscus.resizeHeight) {
        iframeRef.current.style.height = `${data.giscus.resizeHeight}px`
      }

      if (data.giscus.signOut) {
        console.info(`[giscus] User has logged out. Session has been cleared.`)
        signOut()
        return
      }

      if (!data.giscus.error) return

      const message: string = data.giscus.error

      if (
        message.includes('Bad credentials') ||
        message.includes('Invalid state value') ||
        message.includes('State has expired')
      ) {
        // Might be because token is expired or other causes
        if (localStorage.getItem(GISCUS_SESSION_KEY) !== null) {
          console.warn(`${formatError(message)} Session has been cleared.`)
          signOut()
          return
        }

        console.error(`${formatError(message)} No session is stored initially. ${ERROR_SUGGESTION}`)
      }

      if (message.includes('Discussion not found')) {
        console.warn(
          `[giscus] ${message}. A new discussion will be created if a comment/reaction is submitted.`
        )
        return
      }

      console.error(`${formatError(message)} ${ERROR_SUGGESTION}`)
    },
    [signOut]
  )

  const sendMessage = useCallback(
    (message: ISetConfigMessage) => {
      if (!iframeRef.current?.contentWindow || !hasLoaded) return
      iframeRef.current.contentWindow.postMessage({ giscus: message }, GISCUS_DEFAULT_HOST)
    },
    [hasLoaded]
  )

  const updateConfig = useCallback(() => {
    const setConfig: ISetConfigMessage = {
      setConfig: {
        term,
      },
    }
    sendMessage(setConfig)
  }, [sendMessage, term])

  const iframeSrc = useMemo(() => {
    const url = getCleanedPageUrl().toString()

    const description = getMetaContent('description', true)
    const backLink = /* getMetaContent('giscus:backlink') || */ getDeployedPageUrl().toString()

    const params: Record<string, string> = {
      origin: url,
      session,
      repo,
      repoId: repoId ?? '',
      category: category ?? '',
      categoryId: categoryId ?? '',
      term,
      strict: '1',
      reactionsEnabled: '0',
      inputPosition: 'top',
      theme,
      description,
      backLink,
    }

    const searchParams = new URLSearchParams(params)

    return `${GISCUS_DEFAULT_HOST}/en/widget?${searchParams.toString()}`
  }, [session, term])

  // Setup session on mount
  useEffect(() => {
    const origin = location.href
    const url = new URL(origin)
    const savedSession = localStorage.getItem(GISCUS_SESSION_KEY)
    const urlSession = url.searchParams.get('giscus') ?? ''
    setSession('')

    if (urlSession) {
      localStorage.setItem(GISCUS_SESSION_KEY, JSON.stringify(urlSession))
      setSession(urlSession)
      url.searchParams.delete('giscus')
      url.hash = ''
      history.replaceState(undefined, document.title, url.toString())
      return
    }

    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession) as string)
      } catch (e) {
        localStorage.removeItem(GISCUS_SESSION_KEY)
        console.warn(
          `${formatError((e as Record<string, string>)?.message || 'Unknown error')} Session has been cleared.`
        )
      }
    }
  }, [])

  // Setup message event listener
  useEffect(() => {
    window.addEventListener('message', handleMessageEvent)
    return () => {
      window.removeEventListener('message', handleMessageEvent)
    }
  }, [handleMessageEvent])

  // Handle iframe load event
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      iframe.classList.remove('loading')
      setHasLoaded(true)
      // Make sure to update the config in case the iframe is loaded lazily.
      updateConfig()
    }

    iframe.addEventListener('load', handleLoad)
    return () => {
      iframe.removeEventListener('load', handleLoad)
    }
  }, [updateConfig])

  // Update config when props change (after initial load)
  useEffect(() => {
    if (hasLoaded) {
      updateConfig()
    }
  }, [hasLoaded, updateConfig])

  return (
    <iframe
      id="comments"
      ref={iframeRef}
      title="Comments"
      scrolling="no"
      className="loading"
      src={iframeSrc}
      loading="lazy"
      allow="clipboard-write"
      style={{
        ...iframeStyles,
        ...(hasLoaded ? undefined : loadingStyles),
      }}
    />
  )
}

interface ISetConfigMessage {
  setConfig: {
    theme?: Theme
    repo?: `${string}/${string}`
    repoId?: string
    category?: string
    categoryId?: string
    term?: string
    description?: string
    backLink?: string
    number?: number
    strict?: boolean
    reactionsEnabled?: boolean
    inputPosition?: 'top' | 'bottom'
    lang?: string
  }
}

interface GiscusMessage {
  giscus?: Partial<{
    resizeHeight: number
    signOut: boolean
    error: string
  }>
}

function formatError(message: string) {
  return `[giscus] An error occurred. Error message: "${message}".`
}

function getCleanedPageUrl() {
  const url = new URL(location.href)

  url.searchParams.delete('giscus')
  url.hash = ''

  return url
}

function getDeployedPageUrl() {
  const url = getCleanedPageUrl()

  if (process.env.NODE_ENV !== 'production') {
    url.host = 'soorria.com'
    url.protocol = 'https'
  }

  return url
}

function getMetaContent(property: string, og = false) {
  const ogSelector = og ? `meta[property='og:${property}'],` : ''
  const element = document.querySelector<HTMLMetaElement>(ogSelector + `meta[name='${property}']`)

  return element ? element.content : ''
}
