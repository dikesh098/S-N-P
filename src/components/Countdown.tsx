import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Parts { d: number; h: number; m: number; s: number }

function diff(target: Date): Parts {
  const ms = Math.max(0, target.getTime() - Date.now())
  const s = Math.floor(ms / 1000)
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

export default function Countdown({ target }: { target: Date }) {
  const { t } = useTranslation()
  const [parts, setParts] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setParts(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const cells = [
    { v: parts.d, l: t('countdown.days') },
    { v: parts.h, l: t('countdown.hours') },
    { v: parts.m, l: t('countdown.minutes') },
    { v: parts.s, l: t('countdown.seconds') },
  ]

  return (
    <div className="flex justify-center gap-2.5 sm:gap-4" role="timer" aria-live="off">
      {cells.map((c) => (
        <div key={c.l} className="arch-frame w-[70px] sm:w-[92px]">
          <div className="arch-inner flex flex-col items-center justify-center py-4 sm:py-5">
            <span className="font-serif text-2xl font-semibold text-maroon tabular-nums sm:text-4xl">{String(c.v).padStart(2, '0')}</span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-maroon-700/70 sm:text-xs">{c.l}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
