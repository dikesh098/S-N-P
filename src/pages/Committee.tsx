import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { useData } from '../lib/useData'
import { getCommittee } from '../lib/api'
import { tr } from '../lib/util'
import SectionHeading from '../components/SectionHeading'
import SmartImage from '../components/YearImage'
import Seo from '../components/Seo'

const GROUPS = ['office', 'organizing', 'cultural', 'volunteer', 'women', 'youth'] as const

export default function Committee() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: members, loading } = useData('committee', getCommittee)

  const byGroup = useMemo(() => {
    const map: Record<string, typeof members> = {}
    GROUPS.forEach((g) => (map[g] = []))
    ;(members || []).forEach((m) => {
      const g = GROUPS.includes(m.group_key) ? m.group_key : 'organizing'
      map[g] = [...(map[g] || []), m]
    })
    return map
  }, [members])

  const hasAny = (members || []).length > 0

  return (
    <>
      <Seo title={t('committee.title')} />
      <section className="section bg-ivory">
        <div className="container-x">
          <SectionHeading label={t('committee.label')} title={t('committee.title')} />

          {!loading && !hasAny && <p className="mt-12 text-center text-ink/60">{t('committee.empty')}</p>}

          <div className="mt-14 space-y-16">
            {GROUPS.map((g) => {
              const list = byGroup[g] || []
              if (!list.length) return null
              return (
                <div key={g}>
                  <h3 className="text-center font-serif text-2xl text-maroon">{t(`committee.groups.${g}`)}</h3>
                  <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {list.map((m) => (
                      <div key={m.id} className="text-center">
                        <div className="arch-frame mx-auto max-w-[160px]">
                          <div className="arch-inner aspect-[4/5]">
                            <SmartImage src={m.photo_url} alt={tr(m, 'name', lang)} className="h-full w-full object-cover" />
                          </div>
                        </div>
                        <p className="mt-3 font-serif text-lg text-maroon">{tr(m, 'name', lang)}</p>
                        <p className="text-sm text-saffron-600">{tr(m, 'role', lang)}</p>
                        {tr(m, 'description', lang) && <p className="mt-1 text-xs italic text-ink/55">{tr(m, 'description', lang)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
