import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { LANGS } from '../lib/i18n'
import { useSettings } from '../context/SettingsContext'
import { cn } from '../lib/util'

const LINKS = [
  { to: '/', key: 'home' },
  { to: '/about', key: 'about' },
  { to: '/journey', key: 'journey' },
  { to: '/navratri', key: 'navratri' },
  { to: '/programs', key: 'programs' },
  { to: '/gallery', key: 'gallery' },
  { to: '/committee', key: 'committee' },
] as const

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { settings } = useSettings()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open ? 'bg-ivory/95 shadow-soft backdrop-blur-sm' : 'bg-gradient-to-b from-maroon-900/35 to-transparent',
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="text-2xl leading-none">🌺</span>
          <span className={cn('truncate font-serif text-lg font-semibold tracking-tight', scrolled || open ? 'text-maroon' : 'text-ivory')}>
            {settings.organizationName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors',
                  scrolled ? 'text-ink/80 hover:text-maroon' : 'text-ivory/90 hover:text-ivory',
                  isActive && (scrolled ? 'text-maroon' : 'text-ivory'),
                )
              }
            >
              {t(`nav.${l.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className={cn('hidden items-center gap-1 rounded-full border px-1 py-1 text-xs font-medium sm:flex', scrolled ? 'border-maroon/20' : 'border-ivory/40')}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => i18n.changeLanguage(l.code)}
                aria-pressed={i18n.language === l.code}
                className={cn(
                  'rounded-full px-2.5 py-1 transition-colors',
                  i18n.language === l.code
                    ? 'bg-maroon text-ivory'
                    : scrolled
                      ? 'text-ink/70 hover:bg-cream'
                      : 'text-ivory/85 hover:bg-ivory/10',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link to="/navratri" className="btn-saffron hidden !min-h-[40px] !px-4 !py-2 text-sm md:inline-flex">
            🙏 {t('nav.todayCta')}
          </Link>

          <button
            className={cn('rounded-full p-2 lg:hidden', scrolled || open ? 'text-maroon' : 'text-ivory')}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold/30 bg-ivory px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => cn('border-b border-gold/15 py-3.5 text-[16px] font-medium text-ink/85', isActive && 'text-maroon')}
              >
                {t(`nav.${l.key}`)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => i18n.changeLanguage(l.code)}
                aria-pressed={i18n.language === l.code}
                className={cn('chip', i18n.language === l.code && 'chip')}
              >
                {l.label}
              </button>
            ))}
          </div>
          <Link to="/navratri" onClick={() => setOpen(false)} className="btn-saffron mt-4 w-full">
            🙏 {t('nav.todayCta')}
          </Link>
        </div>
      )}
    </header>
  )
}
