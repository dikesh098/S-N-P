import { useEffect, useMemo, useState } from 'react'

/** Reusable decorative pieces — pure SVG/CSS, no image downloads, no paid assets. */

function petals(n: number, r1: number, r2: number, w: number) {
  return Array.from({ length: n }, (_, i) => (
    <path
      key={`${n}-${i}`}
      transform={`rotate(${(i * 360) / n} 200 200)`}
      d={`M200 ${200 - r1} C ${200 + w} ${200 - (r1 + r2) / 2}, ${200 + w} ${200 - r2 + 22}, 200 ${200 - r2} C ${200 - w} ${200 - r2 + 22}, ${200 - w} ${200 - (r1 + r2) / 2}, 200 ${200 - r1} Z`}
    />
  ))
}

export function Mandala({ className = '', spin = false }: { className?: string; spin?: boolean }) {
  return (
    <svg viewBox="0 0 400 400" className={`${spin ? 'animate-spinSlow' : ''} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true" focusable="false">
      <circle cx="200" cy="200" r="196" strokeDasharray="1 8" strokeLinecap="round" strokeWidth="2.4" />
      <circle cx="200" cy="200" r="186" />
      <circle cx="200" cy="200" r="120" />
      {petals(24, 122, 184, 15)}
      {petals(12, 70, 128, 20)}
      {petals(8, 22, 76, 16)}
      <circle cx="200" cy="200" r="16" />
      <circle cx="200" cy="200" r="5" fill="currentColor" />
    </svg>
  )
}

export function Lotus({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" focusable="false">
      {[-62, -31, 0, 31, 62].map((a) => (
        <path key={a} transform={`rotate(${a} 24 30)`} d="M24 30 C 16 22, 17 10, 24 2 C 31 10, 32 22, 24 30 Z" fill={a === 0 ? 'currentColor' : 'none'} fillOpacity={a === 0 ? 0.18 : 0} />
      ))}
      <path d="M8 30 H40" />
    </svg>
  )
}

/** ──── ✦ ──── */
export function FloralDivider({ className = 'text-gold' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-current opacity-60 sm:w-24" style={{ maskImage: 'linear-gradient(90deg,transparent,#000)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000)' }} />
      <Lotus className="h-5 w-8" />
      <span className="h-px w-16 bg-current opacity-60 sm:w-24" style={{ maskImage: 'linear-gradient(270deg,transparent,#000)', WebkitMaskImage: 'linear-gradient(270deg,transparent,#000)' }} />
    </div>
  )
}

export function MandalaDivider({ className = 'text-gold' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-40" />
      <Mandala className="h-10 w-10 opacity-80" />
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
  )
}

export function GoldenLine({ className = '' }: { className?: string }) {
  return <div className={`h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent ${className}`} aria-hidden="true" />
}

export function TempleBorder({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return <div className={`temple-border ${dark ? 'temple-border-dark' : ''} ${className}`} aria-hidden="true" />
}

/** A small diya whose flame moves gently. */
export function Diya({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="26" r="20" fill="#E3C77E" className="animate-glow" opacity="0.4" />
      <g className="animate-flame" style={{ transformOrigin: '32px 36px', transformBox: 'fill-box' as any }}>
        <path d="M32 6 C41 19 39 30 32 36 C25 30 23 19 32 6 Z" fill="#E67E22" />
        <path d="M32 17 C36 24 35 30 32 33 C29 30 28 24 32 17 Z" fill="#F4E6C4" />
      </g>
      <path d="M6 38 H58 C56 52 46 60 32 60 C18 60 8 52 6 38 Z" fill="#C89B3C" />
      <path d="M6 38 H58" stroke="#8A6414" strokeWidth="1.5" />
      <path d="M14 44 C24 50 40 50 50 44" stroke="#F4E6C4" strokeWidth="1.2" fill="none" opacity="0.7" />
    </svg>
  )
}

export function SectionOrnament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-gold ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-current opacity-50" />
      <Diya className="h-9 w-9" />
      <span className="h-px w-16 bg-current opacity-50" />
    </div>
  )
}

/** A handful of drifting marigold petals. Few on phones, none for reduced-motion. */
export function PetalFall({ count }: { count?: number }) {
  const [n, setN] = useState(count ?? 0)
  useEffect(() => {
    if (count !== undefined) return
    const lowPower = (navigator.hardwareConcurrency ?? 4) <= 2
    setN(lowPower ? 0 : window.innerWidth < 640 ? 5 : 9)
  }, [count])
  const items = useMemo(() => {
    const colors = ['#E67E22', '#C89B3C', '#F0A04B', '#C96A14']
    return Array.from({ length: 12 }, (_, i) => ({
      left: `${(i * 83 + 11) % 100}%`,
      s: `${9 + ((i * 5) % 8)}px`,
      dur: `${15 + ((i * 3) % 9)}s`,
      delay: `${-((i * 4.3) % 16)}s`,
      dx: `${((i % 2 ? 1 : -1) * (20 + ((i * 11) % 50)))}px`,
      c: colors[i % colors.length],
    }))
  }, [])
  if (!n) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.slice(0, n).map((p, i) => (
        <span key={i} className="petal" style={{ left: p.left, ['--s' as any]: p.s, ['--dur' as any]: p.dur, ['--delay' as any]: p.delay, ['--dx' as any]: p.dx, ['--c' as any]: p.c, opacity: 0 }} />
      ))}
    </div>
  )
}
