import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useData } from '../lib/useData'
import { getYears } from '../lib/api'
import { tr } from '../lib/util'
import SectionHeading from '../components/SectionHeading'
import { Mandala } from '../components/Ornaments'
import SmartImage from '../components/YearImage'
import Seo from '../components/Seo'

export default function Journey() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: years, loading } = useData('years', getYears)
  const sorted = [...(years || [])].sort((a, b) => a.year - b.year)

  return (
    <>
      <Seo title={t('journey.title')} />
      <section className="section bg-ivory">
        <div className="container-x">
          <SectionHeading label={t('journey.label')} title={t('journey.title')} />

          {!loading && sorted.length === 0 && (
            <p className="mt-12 text-center text-ink/60">{t('journey.empty')}</p>
          )}

          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="absolute left-6 top-0 h-full w-px bg-gold/40 sm:left-1/2" aria-hidden="true" />
            <div className="space-y-14">
              {sorted.map((y, i) => (
                <div key={y.id} className={`relative flex flex-col gap-5 sm:flex-row sm:items-center ${i % 2 ? 'sm:flex-row-reverse' : ''}`}>
                  <div className="absolute left-6 top-2 -translate-x-1/2 sm:left-1/2">
                    <Mandala className="h-9 w-9 text-gold" />
                  </div>
                  <div className={`pl-16 sm:w-1/2 sm:pl-0 ${i % 2 ? 'sm:pl-12' : 'sm:pr-12 sm:text-right'}`}>
                    <p className="font-serif text-4xl text-maroon">{y.year}</p>
                    <h3 className="mt-1 text-lg font-medium text-ink/85">{tr(y, 'title', lang)}</h3>
                    {tr(y, 'description', lang) && <p className="mt-2 text-sm leading-relaxed text-ink/65">{tr(y, 'description', lang)}</p>}
                    <Link to="/gallery" className="mt-3 inline-block text-sm font-medium text-saffron-600 underline underline-offset-4">
                      {t('journey.viewGallery')}
                    </Link>
                  </div>
                  <div className="pl-16 sm:w-1/2 sm:pl-0">
                    <div className={`arch-frame max-w-[220px] ${i % 2 ? '' : 'sm:ml-auto'}`}>
                      <div className="arch-inner aspect-[4/3]">
                        <SmartImage src={y.cover_image} alt={String(y.year)} className="h-full w-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
