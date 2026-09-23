import { useTranslation } from 'react-i18next'
import { Heart, HeartHandshake, Landmark, Users2 } from 'lucide-react'
import { useData } from '../lib/useData'
import { getActivities } from '../lib/api'
import { tr, fmtDate } from '../lib/util'
import SectionHeading from '../components/SectionHeading'
import SmartImage from '../components/YearImage'
import Seo from '../components/Seo'

const PILLARS = [
  { key: 'community', Icon: Users2 },
  { key: 'devotion', Icon: Heart },
  { key: 'tradition', Icon: Landmark },
  { key: 'togetherness', Icon: HeartHandshake },
] as const

export default function Community() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: activities, loading } = useData('activities', getActivities)

  return (
    <>
      <Seo title={t('community.title')} />
      <section className="section bg-ivory">
        <div className="container-x">
          <SectionHeading label={t('community.label')} title={t('community.title')} />
          <p className="prose-devotional mx-auto mt-6 max-w-2xl text-center">{t('community.intro')}</p>

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {PILLARS.map(({ key, Icon }) => (
              <div key={key} className="flex flex-col items-center gap-2 text-center">
                <Icon className="text-gold" size={26} strokeWidth={1.5} />
                <span className="text-sm font-medium text-maroon-700">{t(`community.pillars.${key}`)}</span>
              </div>
            ))}
          </div>

          {!loading && (!activities || activities.length === 0) && (
            <p className="mt-14 text-center text-ink/60">{t('community.empty')}</p>
          )}

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(activities || []).map((a) => (
              <article key={a.id} className="paper overflow-hidden rounded-md">
                <div className="aspect-[16/10] overflow-hidden bg-cream">
                  <SmartImage src={a.image_url} alt={tr(a, 'title', lang)} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg text-maroon">{tr(a, 'title', lang)}</h3>
                  {a.activity_date && <p className="mt-1 text-xs text-ink/50">{fmtDate(a.activity_date, lang)}</p>}
                  {tr(a, 'description', lang) && <p className="mt-3 text-sm leading-relaxed text-ink/70">{tr(a, 'description', lang)}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
