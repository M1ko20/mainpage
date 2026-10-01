// Serves dist/ the way Netlify does: exact file, then <path>/index.html,
// otherwise dist/404.html with a 404 status, with compressed text responses.
// There is deliberately no SPA fallback, so tests catch any route that would
// break on a hard refresh.

import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createBrotliCompress, createGzip } from 'node:zlib'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const port = Number(process.env.PORT || 4173)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}

const isFile = async (path) => {
  try {
    return (await stat(path)).isFile()
  } catch {
    return false
  }
}

const compressible = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.xml'])

/** Brotli / gzip text responses, as Netlify does, so local performance checks are realistic. */
function send(req, res, status, file) {
  const ext = extname(file)
  const headers = { 'Content-Type': types[ext] ?? 'application/octet-stream', Vary: 'Accept-Encoding' }
  const accept = String(req.headers['accept-encoding'] ?? '')
  let stream = createReadStream(file)
  if (compressible.has(ext) && /\bbr\b/.test(accept)) {
    headers['Content-Encoding'] = 'br'
    stream = stream.pipe(createBrotliCompress())
  } else if (compressible.has(ext) && /\bgzip\b/.test(accept)) {
    headers['Content-Encoding'] = 'gzip'
    stream = stream.pipe(createGzip())
  }
  res.writeHead(status, headers)
  stream.pipe(res)
}

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  const candidates = [join(dist, safe), join(dist, safe, 'index.html')]
  for (const file of candidates) {
    if (file.startsWith(dist) && (await isFile(file))) {
      send(req, res, 200, file)
      return
    }
  }
  send(req, res, 404, join(dist, '404.html'))
}).listen(port, () => console.log(`dist served Netlify-style at http://localhost:${port}`))
