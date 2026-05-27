import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    pannellum: {
      viewer: (el: HTMLElement, config: object) => PannellumViewer
    }
  }
}

interface PannellumViewer {
  destroy(): void
  loadScene(id: string): void
  getScene(): string
  on(event: string, cb: (...args: unknown[]) => void): void
}

interface Hotspot {
  pitch: number
  yaw: number
  targetScene: string
  text: string
}

export interface PanoScene {
  id: string
  label: string
  icon: string
  image: string
  preview?: string
  pitch?: number
  yaw?: number
  hotspots?: Hotspot[]
}

interface PanoViewerProps {
  scenes: PanoScene[]
  initialScene?: string
  autoRotate?: number
}

const PANNELLUM_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'
const PANNELLUM_JS  = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'

function loadAsset(tag: 'script' | 'link', attrs: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const selector = tag === 'script'
      ? `script[src="${attrs.src}"]`
      : `link[href="${attrs.href}"]`
    if (document.querySelector(selector)) { resolve(); return }
    const el = document.createElement(tag) as HTMLScriptElement & HTMLLinkElement
    if (tag === 'link') { el.rel = 'stylesheet'; el.href = attrs.href }
    else { el.src = attrs.src }
    el.onload  = () => resolve()
    el.onerror = reject
    document.head.appendChild(el)
  })
}

/** Arrow SVG injected into every navigation hotspot */
const ARROW_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2.5" width="18" height="18">
  <path d="M5 12h14M12 5l7 7-7 7"/>
</svg>`

export function PanoViewer({ scenes, initialScene, autoRotate = 2 }: PanoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef    = useRef<PannellumViewer | null>(null)
  const [ready, setReady]       = useState(false)
  const [activeId, setActiveId] = useState(initialScene ?? scenes[0]?.id)
  const [loading, setLoading]   = useState(true)

  /* ── Load Pannellum from CDN ── */
  useEffect(() => {
    let cancelled = false
    async function init() {
      await loadAsset('link',   { href: PANNELLUM_CSS })
      await loadAsset('script', { src:  PANNELLUM_JS  })
      if (!cancelled) setReady(true)
    }
    init()
    return () => { cancelled = true }
  }, [])

  /* ── Initialise viewer once Pannellum is ready ── */
  useEffect(() => {
    if (!ready || !containerRef.current || !scenes.length) return

    const firstId = initialScene ?? scenes[0].id

    /**
     * Build hotspot configs for a scene.
     * We use type:'info' + createTooltipFunc to get full control
     * over the DOM so we can show a gold icon + always-visible label.
     * clickHandlerFunc calls loadScene() via the viewerRef closure.
     */
    const buildHotspots = (s: PanoScene) =>
      (s.hotspots ?? []).map((h) => ({
        pitch: h.pitch,
        yaw:   h.yaw,
        type:  'info',
        text:  h.text,
        cssClass: 'pano-nav-hs',

        createTooltipFunc: (div: HTMLElement) => {
          div.innerHTML = ''

          // Pulsing ring
          const ring = document.createElement('div')
          ring.className = 'pano-hs-ring'
          div.appendChild(ring)

          // Gold circle with arrow icon
          const circle = document.createElement('div')
          circle.className = 'pano-hs-circle'
          circle.innerHTML = ARROW_SVG
          div.appendChild(circle)

          // Always-visible destination label
          const label = document.createElement('span')
          label.className = 'pano-hs-label'
          label.textContent = h.text.replace(/^→\s*/, '')
          div.appendChild(label)
        },

        clickHandlerFunc: () => {
          if (viewerRef.current) {
            setLoading(true)
            viewerRef.current.loadScene(h.targetScene)
          }
        },
      }))

    /* ── Scene map ── */
    const scenesConfig: Record<string, object> = {}
    scenes.forEach((s) => {
      scenesConfig[s.id] = {
        title:    s.label,
        panorama: s.image,
        preview:  s.preview,
        pitch:    s.pitch ?? 0,
        yaw:      s.yaw   ?? 0,
        hotSpots: buildHotspots(s),
      }
    })

    const viewer = window.pannellum.viewer(containerRef.current!, {
      default: {
        firstScene:                  firstId,
        sceneFadeDuration:           1000,
        autoRotate,
        autoRotateInactivityDelay:   3000,
        compass:                     true,
        showControls:                true,
        showFullscreenCtrl:          true,
        showZoomCtrl:                true,
        keyboardZoom:                true,
        mouseZoom:                   true,
        draggable:                   true,
      },
      scenes: scenesConfig,
    })

    viewerRef.current = viewer

    viewer.on('load', () => {
      setLoading(false)
      setActiveId(viewer.getScene())
    })
    viewer.on('scenechange', (id) => {
      setActiveId(id as string)
      setLoading(false)
    })

    return () => {
      viewer.destroy()
      viewerRef.current = null
    }
  }, [ready, scenes, initialScene, autoRotate])

  const goToScene = (id: string) => {
    if (viewerRef.current && id !== activeId) {
      setLoading(true)
      viewerRef.current.loadScene(id)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl">
      {/* ── Panorama viewport ── */}
      <div className="relative flex-1 overflow-hidden">
        <div ref={containerRef} className="h-full w-full" />

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-gold" />
            <p className="text-sm font-medium text-white/60">Loading panorama…</p>
          </div>
        )}

        {/* Current scene badge */}
        {!loading && (
          <div className="pointer-events-none absolute bottom-14 left-4 z-10 flex items-center gap-2 rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur-md">
            <span className="text-base">{scenes.find((s) => s.id === activeId)?.icon}</span>
            <span className="text-sm font-semibold text-white">
              {scenes.find((s) => s.id === activeId)?.label}
            </span>
          </div>
        )}

        {/* Hint bar */}
        {!loading && (
          <div className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white/60 backdrop-blur-sm">
            Drag to look around · Scroll to zoom · Click gold markers to teleport
          </div>
        )}
      </div>

      {/* ── Scene strip ── */}
      <div className="flex shrink-0 gap-2 overflow-x-auto bg-black/80 px-4 py-3">
        {scenes.map((s) => (
          <button
            key={s.id}
            onClick={() => goToScene(s.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              s.id === activeId
                ? 'bg-gold text-black shadow-[0_0_16px_rgba(232,184,75,0.5)]'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
