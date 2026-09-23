import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useData } from '../lib/useData'
import { getYears, getPrograms, getAnnouncements, getGallery } from '../lib/api'
import { useSettings } from '../context/SettingsContext'
import { pickCurrentYear, festivalPhase, programForToday } from '../lib/festival'
import { tr, fmtDate } from '../lib/util'
import { Mandala, PetalFall, SectionOrnament, Diya } from '../components/Ornaments'
import SectionHeading from '../components/SectionHeading'
import SmartImage from '../components/YearImage'
import Countdown from '../components/Countdown'
import Seo from '../components/Seo'

export default function Home() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { settings } = useSettings()

  const { data: years } = useData('years', getYears)
  const year = pickCurrentYear(years, settings.currentYear)
  const { data: programs } = useData(year ? `programs-${year.id}` : null, () => getPrograms(year!.id))
  const { data: announcements } = useData('announcements-home', () => getAnnouncements(3))
  const { data: gallery } = useData('gallery-featured', () => getGallery({ featured: true, pageSize: 6 }))

  const { phase, start, dayNumber } = useMemo(() => festivalPhase(year), [year])
  const { program: todayProgram, mode } = useMemo(() => programForToday(programs, year), [programs, year])

  const heroImage = year?.cover_image

  return (
    <>
      <Seo title={settings.festivalName} description={t('about.purposeBody')} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-maroon-900">
        <div className="absolute inset-0">
          {heroImage && (
            <img src={heroImage} alt="" className="h-full w-full object-cover object-[center_25%] opacity-70" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/55 via-maroon-900/60 to-maroon-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        </div>
        <Mandala className="pointer-events-none absolute left-1/2 top-1/2 h-[130vh] w-[130vh] -translate-x-1/2 -translate-y-1/2 text-gold/[0.07]" spin />
        <PetalFall />

        <div className="container-x relative z-10 py-28 text-center text-ivory">
          <p className="animate-rise font-deva text-2xl text-gold-300 sm:text-3xl">{t('hero.greeting')}</p>
          <h1 className="animate-rise mt-3 text-balance font-serif text-4xl font-semibold leading-[1.1] sm:text-6xl" style={{ animationDelay: '90ms' }}>
            {settings.festivalName}
          </h1>
          <p className="animate-rise mx-auto mt-5 max-w-md text-[15px] uppercase tracking-[0.2em] text-ivory/75 sm:text-base" style={{ animationDelay: '160ms' }}>
            {t('hero.tagline')}
          </p>

          {year && (
            <div className="animate-rise mt-10" style={{ animationDelay: '230ms' }}>
              {phase === 'before' && start && (
                <>
                  <p className="mb-4 text-sm uppercase tracking-widest text-gold-300">{t('countdown.title')}</p>
                  <Countdown target={start} />
                </>
              )}
              {phase === 'live' && (
                <p className="arch-frame inline-block !border-gold-300 px-6 py-3 font-serif text-lg text-maroon">
                  {t('countdown.live', { day: dayNumber })}
                </p>
              )}
              {phase === 'after' && <p className="text-ivory/70">{t('countdown.over')}</p>}
            </div>
          )}

          <div className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '300ms' }}>
            <Link to="/navratri" className="btn-saffron">{t('hero.explore')}</Link>
            <Link to="/navratri" className="btn-gold border-ivory/40 text-ivory hover:bg-ivory/10">{t('hero.today')}</Link>
            <Link to="/journey" className="hidden text-sm font-medium text-ivory/70 underline decoration-gold/50 underline-offset-4 hover:text-ivory sm:inline-block">
              {t('hero.journey')}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- TODAY'S DARSHAN ---------------- */}
      <section className="section bg-ivory">
        <div className="container-x">
          <SectionHeading label={t('today.label')} title={year ? t('today.day', { n: todayProgram?.day_number ?? 1 }) : t('today.label')} />

          <div className="mt-12 grid items-center gap-8 lg:grid-cols-5 lg:gap-14">
            <div className="lg:col-span-2">
              <div className="arch-frame mx-auto max-w-sm">
                <div className="arch-inner aspect-[4/5]">
                  <SmartImage src={todayProgram?.darshan_image_url || todayProgram?.image_url} alt={t('today.label')} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>

            <div className="paper arch relative overflow-hidden p-7 lg:col-span-3 lg:p-10">
              <Diya className="absolute right-6 top-6 h-8 w-8 opacity-70" />
              {todayProgram ? (
                <>
                  <p className="text-sm font-medium uppercase tracking-widest text-saffron-600">
                    {mode === 'today' ? t('today.day', { n: todayProgram.day_number }) : t('today.upNext', { n: todayProgram.day_number })}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-maroon">{tr(todayProgram, 'title', lang) || tr(year, 'title', lang)}</h3>
                  {todayProgram.location && <p className="mt-1 text-sm text-ink/60">{todayProgram.location}</p>}
                  <ul className="mt-6 space-y-4">
                    {(todayProgram.items || []).map((it: any, i: number) => (
                      <li key={i} className="flex items-start gap-4 border-b border-gold/15 pb-4 last:border-0 last:pb-0">
                        <span className="mt-0.5 min-w-[76px] font-serif text-sm font-semibold text-maroon">{it.time}</span>
                        <span className="text-ink/80">{tr(it, 'title', lang) || t(`today.${it.kind || 'other'}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/navratri" className="btn-primary mt-7">{t('today.viewProgram')}</Link>
                </>
              ) : (
                <p className="prose-devotional">{t('today.noProgram')}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT teaser ---------------- */}
      <section className="section relative bg-cream">
        <TempleTop />
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading label={t('about.label')} title={t('about.title')} align="left" />
            <p className="prose-devotional mt-6">{t('about.purposeBody')}</p>
            <Link to="/about" className="btn-outline mt-7">{t('common.readMore')}</Link>
          </div>
          <SectionOrnament className="hidden lg:flex" />
        </div>
      </section>

      {/* ---------------- JOURNEY preview ---------------- */}
      {years && years.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-x">
            <SectionHeading label={t('journey.label')} title={t('journey.title')} />
            <div className="mt-12 flex gap-5 overflow-x-auto scrollbar-none pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
              {years.slice(0, 6).map((y) => (
                <Link key={y.id} to="/journey" className="group w-[150px] shrink-0 sm:w-auto">
                  <div className="arch-frame">
                    <div className="arch-inner aspect-[3/4]">
                      <SmartImage src={y.cover_image} alt={String(y.year)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  </div>
                  <p className="mt-3 text-center font-serif text-lg text-maroon">{y.year}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/journey" className="btn-outline">{t('journey.viewGallery')}</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Announcements ---------------- */}
      {announcements && announcements.length > 0 && (
        <section className="section bg-maroon-900 relative overflow-hidden">
          <Mandala className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 text-gold/10" />
          <div className="container-x relative">
            <SectionHeading label={t('announcements.label')} title={t('announcements.title')} dark />
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {announcements.map((a) => (
                <div key={a.id} className="paper !border-gold/30 !bg-ivory/95 p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-saffron-600">🪔 {tr(a, 'title', lang)}</p>
                  <p className="mt-2 font-serif text-lg text-maroon">{fmtDate(a.announcement_date, lang)}{a.event_time ? ` · ${a.event_time}` : ''}</p>
                  {a.location && <p className="mt-1 text-sm text-ink/60">{a.location}</p>}
                  {tr(a, 'description', lang) && <p className="mt-3 text-sm leading-relaxed text-ink/75">{tr(a, 'description', lang)}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Gallery teaser ---------------- */}
      {gallery && gallery.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-x">
            <SectionHeading label={t('gallery.label')} title={t('gallery.title')} />
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {gallery.map((g) => (
                <Link key={g.id} to="/gallery" className="group overflow-hidden rounded-md">
                  <div className="aspect-square overflow-hidden bg-cream">
                    <SmartImage src={g.thumb_url || g.image_url} alt={g.caption || ''} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/gallery" className="btn-outline">{t('gallery.title')}</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Volunteer CTA ---------------- */}
      <section className="section relative overflow-hidden bg-cream text-center">
        <div className="container-x relative">
          <SectionHeading label={t('volunteer.label')} title={t('volunteer.title')} />
          <p className="prose-devotional mx-auto mt-5 text-center">{t('volunteer.intro')}</p>
          <Link to="/volunteer" className="btn-primary mt-7">🙏 {t('volunteer.cta')}</Link>
        </div>
      </section>
    </>
  )
}

function TempleTop() {
  return <div className="temple-border-dark temple-border absolute inset-x-0 top-0" />
}
