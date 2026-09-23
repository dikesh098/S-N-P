export type Row = Record<string, any>
export type Lang = 'en' | 'hi' | 'mr'

/** Pick the translated column (title_hi / title_mr) and fall back to English. */
export function tr(row: Row | null | undefined, field: string, lang: string): string {
  if (!row) return ''
  if (lang === 'hi' || lang === 'mr') {
    const v = row[`${field}_${lang}`]
    if (v && String(v).trim()) return String(v)
  }
  return row[field] ? String(row[field]) : ''
}

const LOCALES: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' }

export function fmtDate(d?: string | null, lang = 'en', opts?: Intl.DateTimeFormatOptions): string {
  if (!d) return ''
  const date = new Date(d.length <= 10 ? `${d}T00:00:00` : d)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString(LOCALES[lang] || 'en-IN', opts ?? { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Local calendar date as YYYY-MM-DD (no timezone surprises). */
export function todayStr(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setDate(d.getDate() + n)
  return todayStr(d)
}

export function daysBetween(a: string, b: string): number {
  const A = new Date(`${a}T00:00:00`).getTime()
  const B = new Date(`${b}T00:00:00`).getTime()
  return Math.round((B - A) / 86400000)
}

export function youtubeId(url: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  return m ? m[1] : null
}

export const isPlaceholder = (v?: string | null) => !v || /^\[.*\]$/.test(v.trim())

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function waLink(num?: string, text?: string) {
  const digits = (num || '').replace(/\D/g, '')
  if (!digits) return ''
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
