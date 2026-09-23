import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import { useData } from '../lib/useData'
import { getYears, getPrograms } from '../lib/api'
import { pickCurrentYear, programDate } from '../lib/festival'
import { tr, fmtDate } from '../lib/util'
import { useSettings } from '../context/SettingsContext'
import SectionHeading from '../components/SectionHeading'
import SmartImage from '../components/YearImage'
import Seo from '../components/Seo'
import { ChevronLeft } from 'lucide-react'

export default function Navratri() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { settings } = useSettings()
  const { data: years } = useData('years', getYears)
  const year = pickCurrentYear(years, settings.currentYear)
  const { data: programs, loading } = useData(year ? `programs-${year.id}` : null, () => getPrograms(year!.id))
  const [openDay, setOpenDay] = useState<string | null>(null)

  const sorted = useMemo(() => [...(programs || [])].sort((a, b) => a.day_number - b.day_number), [programs])
  const selected = sorted.find((p) => p.id === openDay)

  return (
    <>
      <Seo title={t('navratriPage.title')} />
      <section className="section bg-ivory">
        <div className="container-x">
          <SectionHeading label={t('navratriPage.label')} title={t('navratriPage.title')} />

          {!loading && sorted.length === 0 && <p className="mt-12 text-center text-ink/60">{t('navratriPage.empty')}</p>}

          {!selected && sorted.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {sorted.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setOpenDay(p.id)}
                  className="paper group flex flex-col overflow-hidden rounded-md text-left transition-shadow hover:shadow-soft"
                >
                  <div className="aspect-square overflow-hidden bg-cream">
                    <SmartImage src={p.image_url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-saffron-600">{t('navratriPage.day', { n: p.day_number })}</p>
                    <h3 className="mt-1 font-serif text-lg leading-tight text-maroon">{tr(p, 'title', lang)}</h3>
                    {programDate(p, year) && <p className="mt-1 text-xs text-ink/55">{fmtDate(programDate(p, year), lang)}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className="mt-10">
              <button onClick={() => setOpenDay(null)} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-maroon hover:underline">
                <ChevronLeft size={16} /> {t('navratriPage.back')}
              </button>
              <div className="paper grid gap-8 rounded-md p-6 lg:grid-cols-2 lg:p-10">
                <div className="arch-frame">
                  <div className="arch-inner aspect-[4/5]">
                    <SmartImage src={selected.darshan_image_url || selected.image_url} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-saffron-600">{t('navratriPage.day', { n: selected.day_number })}</p>
                  <h2 className="mt-2 font-serif text-2xl text-maroon">{tr(selected, 'title', lang)}</h2>
                  {programDate(selected, year) && <p className="mt-1 text-sm text-ink/60">{fmtDate(programDate(selected, year), lang)}</p>}
                  {selected.location && <p className="text-sm text-ink/60">{selected.location}</p>}
                  {tr(selected, 'description', lang) && <p className="prose-devotional mt-4">{tr(selected, 'description', lang)}</p>}
                  <ul className="mt-6 space-y-4">
                    {(selected.items || []).map((it: any, i: number) => (
                      <li key={i} className="flex items-start gap-4 border-b border-gold/15 pb-4 last:border-0 last:pb-0">
                        <span className="mt-0.5 min-w-[76px] font-serif text-sm font-semibold text-maroon">{it.time}</span>
                        <span className="text-ink/80">{tr(it, 'title', lang) || t(`today.${it.kind || 'other'}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
