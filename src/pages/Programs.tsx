import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import { useData } from '../lib/useData'
import { getYears, getEvents } from '../lib/api'
import { pickCurrentYear } from '../lib/festival'
import { tr, fmtDate } from '../lib/util'
import { useSettings } from '../context/SettingsContext'
import SectionHeading from '../components/SectionHeading'
import SmartImage from '../components/YearImage'
import Seo from '../components/Seo'
import { cn } from '../lib/util'

const CATS = ['all', 'garba', 'dandiya', 'bhajan', 'dance', 'singing', 'children', 'competition', 'community'] as const

export default function Programs() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { settings } = useSettings()
  const { data: years } = useData('years', getYears)
  const year = pickCurrentYear(years, settings.currentYear)
  const { data: events, loading } = useData(year ? `events-${year.id}` : null, () => getEvents(year?.id))
  const [cat, setCat] = useState<typeof CATS[number]>('all')

  const filtered = useMemo(() => (cat === 'all' ? events : (events || []).filter((e) => e.category === cat)), [events, cat])

  return (
    <>
      <Seo title={t('programsPage.title')} />
      <section className="section bg-ivory">
        <div className="container-x">
          <SectionHeading label={t('programsPage.label')} title={t('programsPage.title')} />

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className="chip">
                {t(`programsPage.categories.${c}`)}
              </button>
            ))}
          </div>

          {!loading && (!filtered || filtered.length === 0) && (
            <p className="mt-12 text-center text-ink/60">{t('programsPage.empty')}</p>
          )}

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(filtered || []).map((e) => (
              <article key={e.id} className="paper flex flex-col overflow-hidden rounded-md">
                <div className="aspect-[16/10] overflow-hidden bg-cream">
                  <SmartImage src={e.image_url} alt={tr(e, 'title', lang)} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className={cn('text-xs font-medium uppercase tracking-wider text-saffron-600')}>{t(`programsPage.categories.${e.category}`, { defaultValue: e.category })}</p>
                  <h3 className="mt-1 font-serif text-xl text-maroon">{tr(e, 'title', lang)}</h3>
                  <p className="mt-1 text-sm text-ink/55">
                    {fmtDate(e.event_date, lang)}{e.event_time ? ` · ${e.event_time}` : ''}{e.location ? ` · ${e.location}` : ''}
                  </p>
                  {tr(e, 'description', lang) && <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{tr(e, 'description', lang)}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
