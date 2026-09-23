import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Instagram, Facebook, Youtube, MessageCircle, Mail, Phone, MapPin } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { Mandala } from './Ornaments'
import { isPlaceholder, waLink } from '../lib/util'

const LINKS = [
  { to: '/about', key: 'nav.about' },
  { to: '/journey', key: 'nav.journey' },
  { to: '/navratri', key: 'nav.navratri' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/volunteer', key: 'volunteer.cta' },
  { to: '/contribute', key: 'contribute.title' },
] as const

export default function Footer() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const year = new Date().getFullYear()

  const socials = [
    { href: settings.instagram, Icon: Instagram, label: 'Instagram' },
    { href: settings.facebook, Icon: Facebook, label: 'Facebook' },
    { href: settings.youtube, Icon: Youtube, label: 'YouTube' },
    { href: settings.whatsapp ? waLink(settings.whatsapp) : '', Icon: MessageCircle, label: 'WhatsApp' },
  ].filter((s) => s.href && !isPlaceholder(s.href))

  return (
    <footer className="relative overflow-hidden bg-maroon-900 text-ivory/90">
      <Mandala className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-gold/10" />
      <Mandala className="pointer-events-none absolute -bottom-32 -left-24 h-[380px] w-[380px] text-gold/10" />

      <div className="container-x relative py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌺</span>
              <span className="font-serif text-lg font-semibold text-ivory">{settings.organizationName}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/65">{t('footer.statement')}</p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                     className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold-300 transition-colors hover:bg-gold/15">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-serif text-base text-gold-300">{t('footer.quickLinks')}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-ivory">{t(l.key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base text-gold-300">{t('footer.contact')}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
              {!isPlaceholder(settings.venue) && (
                <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold-300" /><span>{settings.venue}</span></li>
              )}
              {!isPlaceholder(settings.phone) && (
                <li className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-gold-300" /><a href={`tel:${settings.phone}`} className="hover:text-ivory">{settings.phone}</a></li>
              )}
              {!isPlaceholder(settings.email) && (
                <li className="flex items-center gap-2"><Mail size={16} className="shrink-0 text-gold-300" /><a href={`mailto:${settings.email}`} className="hover:text-ivory">{settings.email}</a></li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base text-gold-300">{t('nav.todayCta')}</h3>
            <p className="mt-4 text-sm text-ivory/70">{settings.festivalName}</p>
            <Link to="/qr" className="btn-outline !border-gold/40 !text-gold-300 hover:!bg-gold/15 hover:!text-ivory mt-4 !min-h-[40px] !px-4 !py-2 text-sm">
              {t('qr.title')}
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-gold/15 pt-6 text-center text-xs text-ivory/50 sm:flex-row sm:justify-between sm:text-left">
          <p>© {year} {settings.organizationName}. {t('footer.rights')}</p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  )
}
