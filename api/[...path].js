/**
 * Vercel serverless proxy — forwards every /api/* request from the
 * frontend to the real backend, injecting the ngrok header so the
 * browser-warning interstitial is bypassed.
 *
 * In production set VITE_API_BASE in Vercel's Environment Variables panel.
 */

export const config = { runtime: 'nodejs20.x' }

export default async function handler(req, res) {
  const backendBase = (process.env.VITE_API_BASE || '').replace(/\/$/, '')

  if (!backendBase) {
    res.status(503).json({ error: 'VITE_API_BASE environment variable is not set.' })
    return
  }

  // req.url is the full path, e.g. /api/about/page-content?foo=bar
  // Forward it as-is to the backend.
  const targetUrl = `${backendBase}${req.url}`

  // Build forwarded headers — pass Authorization through, inject ngrok bypass
  const forwardHeaders = {
    'Content-Type': req.headers['content-type'] || 'application/json',
    'Accept':        req.headers['accept']        || 'application/json',
    'ngrok-skip-browser-warning': 'true',
  }
  if (req.headers['authorization']) {
    forwardHeaders['Authorization'] = req.headers['authorization']
  }

  const fetchOptions = { method: req.method, headers: forwardHeaders }

  // Attach body for mutating methods
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method.toUpperCase())) {
    // Vercel parses the body automatically for common content-types
    if (req.body !== undefined) {
      forwardHeaders['Content-Type'] = 'application/json'
      fetchOptions.body = JSON.stringify(req.body)
    }
  }

  let response
  try {
    response = await fetch(targetUrl, fetchOptions)
  } catch (err) {
    res.status(502).json({ error: 'Backend unreachable.', detail: err.message })
    return
  }

  // Relay status + body
  res.status(response.status)

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const json = await response.json()
    res.json(json)
  } else {
    const text = await response.text()
    res.setHeader('Content-Type', contentType || 'text/plain')
    res.send(text)
  }
}
