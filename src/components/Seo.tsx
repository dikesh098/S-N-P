import { useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'

/** Lightweight SEO: sets document title + meta description/OG tags without a heavy library. */
export default function Seo({ title, description }: { title?: string; description?: string }) {
  const { settings } = useSettings()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${settings.organizationName}` : settings.organizationName
    document.title = fullTitle

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const desc = description || `${settings.festivalName} — ${settings.organizationName}, ${settings.colonyName}, ${settings.city}.`
    setMeta('description', desc)
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', desc, 'property')
    setMeta('og:type', 'website', 'property')
  }, [title, description, settings])

  return null
}
