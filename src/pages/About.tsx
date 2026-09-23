import { useTranslation } from 'react-i18next'
import { Heart, Sparkles, Landmark, Palette, HandHeart, Users } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { MandalaDivider } from '../components/Ornaments'
import Seo from '../components/Seo'
import { useSettings } from '../context/SettingsContext'

const VALUES = [
  { key: 'faith', Icon: Sparkles },
  { key: 'unity', Icon: Users },
  { key: 'tradition', Icon: Landmark },
  { key: 'culture', Icon: Palette },
  { key: 'service', Icon: HandHeart },
  { key: 'togetherness', Icon: Heart },
] as const

export default function About() {
  const { t } = useTranslation()
  const { settings } = useSettings()

  return (
    <>
      <Seo title={t('about.title')} />
      <section className="section bg-ivory">
        <div className="container-x max-w-3xl">
          <SectionHeading label={t('about.label')} title={t('about.title')} />
          <p className="prose-devotional mx-auto mt-8 text-center">
            {settings.organizationName} {t('about.purposeBody')}
          </p>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-saffron-600">{t('about.purposeLabel')}</p>
          <h2 className="mt-2 font-serif text-3xl text-maroon">{t('about.purposeTitle')}</h2>
          <p className="prose-devotional mx-auto mt-6">{t('about.purposeBody')}</p>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container-x">
          <p className="text-center text-sm font-medium uppercase tracking-[0.18em] text-saffron-600">{t('about.valuesLabel')}</p>
          <h2 className="mt-2 text-center font-serif text-3xl text-maroon">{t('about.valuesTitle')}</h2>
          <MandalaDivider className="mx-auto mt-6 max-w-xs" />

          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {VALUES.map(({ key, Icon }) => (
              <div key={key} className="paper flex flex-col items-center gap-3 rounded-md px-4 py-7 text-center">
                <Icon className="text-gold" size={28} strokeWidth={1.5} />
                <span className="font-serif text-lg text-maroon">{t(`about.values.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
