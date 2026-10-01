import { useLayoutEffect } from 'react'

/** Match the document background (overscroll, safe areas) and form-control scheme to the current site. */
export function useBodyTheme(background: string, scheme: 'light' | 'dark' = 'light') {
  useLayoutEffect(() => {
    const { body, documentElement } = document
    const previous = { bg: body.style.background, scheme: documentElement.style.colorScheme }
    body.style.background = background
    documentElement.style.colorScheme = scheme
    return () => {
      body.style.background = previous.bg
      documentElement.style.colorScheme = previous.scheme
    }
  }, [background, scheme])
}
