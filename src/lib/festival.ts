import { addDays, daysBetween, todayStr, type Row } from './util'

export function pickCurrentYear(years: Row[] | undefined, currentYearSetting?: string): Row | undefined {
  if (!years || !years.length) return undefined
  return (
    years.find((y) => y.is_current) ||
    years.find((y) => String(y.year) === String(currentYearSetting)) ||
    [...years].sort((a, b) => b.year - a.year)[0]
  )
}

/** Date of a program: its own date, or start_date + (day_number - 1). */
export function programDate(p: Row, year?: Row): string | null {
  if (p.program_date) return p.program_date
  if (year?.start_date && p.day_number) return addDays(year.start_date, p.day_number - 1)
  return null
}

export type Phase = 'unknown' | 'before' | 'live' | 'after'

export function festivalPhase(year?: Row, now = new Date()): { phase: Phase; start?: Date; dayNumber?: number } {
  if (!year?.start_date) return { phase: 'unknown' }
  const start = new Date(`${year.start_date}T00:00:00`)
  const endStr = year.end_date || addDays(year.start_date, 9)
  const end = new Date(`${endStr}T23:59:59`)
  if (now < start) return { phase: 'before', start }
  if (now > end) return { phase: 'after', start }
  return { phase: 'live', start, dayNumber: daysBetween(year.start_date, todayStr(now)) + 1 }
}

/** Today's program, or the next upcoming one (so the card is never empty during the festival run-up). */
export function programForToday(programs: Row[] | undefined, year?: Row, now = new Date()) {
  if (!programs || !programs.length) return { program: undefined as Row | undefined, mode: null as null | 'today' | 'next' }
  const today = todayStr(now)
  const dated = programs
    .map((p) => ({ p, d: programDate(p, year) }))
    .filter((x): x is { p: Row; d: string } => !!x.d)
    .sort((a, b) => a.d.localeCompare(b.d))
  const exact = dated.find((x) => x.d === today)
  if (exact) return { program: exact.p, mode: 'today' as const }
  const next = dated.find((x) => x.d > today)
  if (next) return { program: next.p, mode: 'next' as const }
  return { program: undefined, mode: null }
}

export const DAY_KINDS = ['aarti', 'cultural', 'prasad', 'other'] as const
