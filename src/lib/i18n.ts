import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import hi from '../locales/hi.json'
import mr from '../locales/mr.json'

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi }, mr: { translation: mr } },
  lng: saved === 'hi' || saved === 'mr' || saved === 'en' ? saved : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (l) => {
  try {
    localStorage.setItem('lang', l)
  } catch {
    /* ignore */
  }
  document.documentElement.lang = l
})
document.documentElement.lang = i18n.language

export default i18n
export const LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हिंदी', name: 'हिन्दी' },
  { code: 'mr', label: 'मराठी', name: 'मराठी' },
] as const

/** Flatten nested JSON to "a.b.c" -> value (used by the admin Translations page). */
export function flatten(obj: any, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') Object.assign(out, flatten(v, key))
    else out[key] = String(v)
  }
  return out
}
export const baseStrings = { en, hi, mr }
