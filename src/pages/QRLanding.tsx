import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Sun, Images, Megaphone, CalendarDays } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { Diya } from '../components/Ornaments'
import Seo from '../components/Seo'

const LINKS = [
  { to: '/navratri', Icon: Sun, key: 'today.viewProgram' },
  { to: '/navratri', Icon: CalendarDays, key: 'navratriPage.title' },
  { to: '/gallery', Icon: Images, key: 'gallery.title' },
  { to: '/', Icon: Megaphone, key: 'announcements.title' },
] as const

/** A minimal, fast page designed to be opened from a printed QR code at the pandal. */
export default function QRLanding() {
  const { t } = useTranslation()
  const { settings } = useSettings()

  return (
    <>
      <Seo title={t('qr.title')} />
      <section className="flex min-h-[80vh] flex-col items-center justify-center bg-cream px-6 py-16 text-center">
        <Diya className="h-14 w-14" />
        <p className="mt-4 font-deva text-xl text-maroon-700">{t('hero.greeting')}</p>
        <h1 className="mt-1 font-serif text-3xl text-maroon">{settings.organizationName}</h1>
        <p className="mt-2 text-ink/60">{t('qr.subtitle')}</p>

        <div className="mt-10 grid w-full max-w-sm gap-3">
          {LINKS.map(({ to, Icon, key }) => (
            <Link key={key} to={to} className="paper flex items-center gap-4 rounded-md px-5 py-4 text-left transition-shadow hover:shadow-soft">
              <Icon className="shrink-0 text-gold" size={22} />
              <span className="font-medium text-maroon-700">{t(key)}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
