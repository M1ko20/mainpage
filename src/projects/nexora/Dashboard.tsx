import { m, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/** Deterministic pseudo-noise so the "live" data is stable per tick. */
const noise = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

const POINTS = 48
const series = (tick: number) =>
  Array.from({ length: POINTS }, (_, i) => {
    const t = tick + i
    return 0.45 + Math.sin(t / 5) * 0.16 + Math.sin(t / 2.3) * 0.06 + (noise(t) - 0.5) * 0.12
  })

const toPath = (values: number[], w: number, h: number) =>
  values.map((v, i) => `${i === 0 ? 'M' : 'L'}${((i / (values.length - 1)) * w).toFixed(1)},${(h - v * h).toFixed(1)}`).join(' ')

const logs = [
  ['200', 'POST /v1/chat/completions', 'llama-70b', '41ms'],
  ['200', 'POST /v1/embeddings', 'bge-large', '9ms'],
  ['200', 'POST /v1/chat/completions', 'mixtral-8x22b', '57ms'],
  ['200', 'POST /v1/images', 'sdxl-turbo', '312ms'],
  ['200', 'POST /v1/chat/completions', 'llama-8b', '18ms'],
  ['429', 'POST /v1/chat/completions', 'tenant:acme', 'rate'],
  ['200', 'POST /v1/audio/transcribe', 'whisper-v3', '144ms'],
]

const regions = ['fra-1', 'iad-2', 'sin-1', 'gru-1', 'syd-1', 'nrt-2']

/** A product UI that feels alive: ticking metrics, a streaming chart, GPUs lighting up. */
export function Dashboard() {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!visible || reduce) return
    const id = window.setInterval(() => setTick((t) => t + 1), 1100)
    return () => window.clearInterval(id)
  }, [visible, reduce])

  const values = series(tick)
  const line = toPath(values, 600, 160)
  const area = `${line} L600,160 L0,160 Z`
  const rps = Math.round(18400 + noise(tick) * 2400)
  const p50 = (36 + noise(tick + 3) * 6).toFixed(0)
  const util = Math.round(78 + noise(tick + 7) * 14)
  const visibleLogs = Array.from({ length: 5 }, (_, i) => logs[(tick + i) % logs.length])

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl bg-[#0A0C14]/95 text-left ring-1 ring-white/10" aria-hidden="true">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-jbmono text-[11px] text-white/55">console.nexora.ai / production / llama-70b</span>
        <span className="ml-auto flex items-center gap-2 font-jbmono text-[11px] text-emerald-300/90">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative size-2 rounded-full bg-emerald-400" />
          </span>
          live
        </span>
      </div>

      <div className="grid md:grid-cols-[180px_1fr]">
        <div className="hidden border-r border-white/[0.07] p-4 md:block">
          <p className="font-jbmono text-[10px] uppercase tracking-[0.18em] text-white/55">Deployments</p>
          <ul className="mt-3 space-y-1 font-jbmono text-[12px]">
            {['llama-70b', 'mixtral-8x22b', 'bge-large', 'whisper-v3', 'sdxl-turbo'].map((d, i) => (
              <li key={d} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? 'bg-white/[0.06] text-white' : 'text-white/45'}`}>
                <span className={`size-1.5 rounded-full ${i === 3 ? 'bg-amber-300' : 'bg-emerald-400'}`} />
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-jbmono text-[10px] uppercase tracking-[0.18em] text-white/55">Regions</p>
          <ul className="mt-3 grid grid-cols-2 gap-1 font-jbmono text-[11px] text-white/50">
            {regions.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 p-4 md:p-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              ['Requests / s', rps.toLocaleString('en-US'), '+12.4%'],
              ['p50 latency', `${p50} ms`, '−8.1%'],
              ['GPU utilisation', `${util}%`, '24 × H100'],
            ].map(([k, v, d]) => (
              <div key={k} className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06]">
                <p className="truncate font-jbmono text-[10px] uppercase tracking-[0.14em] text-white/55">{k}</p>
                <p className="mt-1.5 font-grotesk text-[clamp(1rem,2.2vw,1.6rem)] font-medium tabular-nums text-white">{v}</p>
                <p className="mt-0.5 truncate font-jbmono text-[10px] text-emerald-300/80">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/[0.06]">
            <div className="flex items-center justify-between font-jbmono text-[10px] uppercase tracking-[0.14em] text-white/55">
              <span>Throughput — tokens / s</span>
              <span>last 60s</span>
            </div>
            <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="mt-2 h-28 w-full md:h-36">
              <defs>
                <linearGradient id="nx-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="nx-line" x1="0" x2="1">
                  <stop offset="0%" stopColor="#7C5CFF" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              {[40, 80, 120].map((y) => (
                <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="white" strokeOpacity="0.05" />
              ))}
              <path d={area} fill="url(#nx-area)" className="transition-[d] duration-1000 ease-linear" />
              <path d={line} fill="none" stroke="url(#nx-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" className="transition-[d] duration-1000 ease-linear" />
            </svg>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.3fr]">
            <div className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/[0.06]">
              <p className="font-jbmono text-[10px] uppercase tracking-[0.14em] text-white/55">GPU pool — fra-1</p>
              <div className="mt-3 grid grid-cols-12 gap-1">
                {Array.from({ length: 48 }, (_, i) => {
                  const level = noise(i * 7 + tick * 3)
                  return (
                    <span
                      key={i}
                      className="aspect-square rounded-[3px] transition-colors duration-700"
                      style={{ background: level > 0.72 ? '#22D3EE' : level > 0.35 ? '#7C5CFF' : 'rgba(255,255,255,.07)', opacity: level > 0.35 ? 0.35 + level * 0.6 : 1 }}
                    />
                  )
                })}
              </div>
            </div>
            <div className="hidden rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/[0.06] sm:block">
              <p className="font-jbmono text-[10px] uppercase tracking-[0.14em] text-white/55">Requests</p>
              <ul className="mt-2 space-y-1.5 font-jbmono text-[11px]">
                {visibleLogs.map((l, i) => (
                  <m.li key={`${tick}-${i}`} className="flex gap-3 whitespace-nowrap text-white/60" initial={i === 0 ? { opacity: 0, x: -6 } : false} animate={{ opacity: 1, x: 0 }}>
                    <span className={l[0] === '200' ? 'text-emerald-300/90' : 'text-amber-300/90'}>{l[0]}</span>
                    <span className="truncate">{l[1]}</span>
                    <span className="ml-auto text-white/55">{l[3]}</span>
                  </m.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
