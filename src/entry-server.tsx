import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import { App } from './App'

/** Renders a route to HTML at build time. `prerender` waits for lazy routes to resolve. */
export async function render(url: string): Promise<string> {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '')
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter basename={basename} location={basename + url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return new Response(prelude).text()
}
