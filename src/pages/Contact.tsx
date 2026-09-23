import { useTranslation } from 'react-i18next'
import { useState, type FormEvent } from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'
import { submitContact } from '../lib/api'
import { useSettings } from '../context/SettingsContext'
import { isPlaceholder } from '../lib/util'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'

const initial = { name: '', mobile: '', email: '', message: '' }

export default function Contact() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return
    setStatus('sending')
    try {
      await submitContact(form)
      setStatus('ok')
      setForm(initial)
    } catch {
      setStatus('err')
    }
  }

  const mapQuery = !isPlaceholder(settings.venue) ? encodeURIComponent(`${settings.venue}, ${settings.city}, ${settings.state}`) : null

  return (
    <>
      <Seo title={t('contact.title')} />
      <section className="section bg-ivory">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading label={t('contact.label')} title={t('contact.title')} align="left" />
            <ul className="mt-8 space-y-5">
              {!isPlaceholder(settings.venue) && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 shrink-0 text-gold" size={20} />
                  <div>
                    <p className="text-sm font-medium text-maroon-700">{t('contact.venue')}</p>
                    <p className="text-ink/75">{settings.venue}, {settings.colonyName}, {settings.city}</p>
                    {mapQuery && (
                      <a href={`https://www.openstreetmap.org/search?query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-saffron-600 underline underline-offset-4">
                        {t('contact.map')}
                      </a>
                    )}
                  </div>
                </li>
              )}
              {!isPlaceholder(settings.phone) && (
                <li className="flex items-center gap-3">
                  <Phone className="shrink-0 text-gold" size={20} />
                  <a href={`tel:${settings.phone}`} className="text-ink/75 hover:text-maroon">{settings.phone}</a>
                </li>
              )}
              {!isPlaceholder(settings.email) && (
                <li className="flex items-center gap-3">
                  <Mail className="shrink-0 text-gold" size={20} />
                  <a href={`mailto:${settings.email}`} className="text-ink/75 hover:text-maroon">{settings.email}</a>
                </li>
              )}
            </ul>
          </div>

          <form onSubmit={onSubmit} className="paper space-y-5 rounded-md p-7 sm:p-9">
            <div>
              <label className="label" htmlFor="c-name">{t('contact.form.name')} *</label>
              <input id="c-name" required className="field" value={form.name} onChange={set('name')} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="c-mobile">{t('contact.form.mobile')}</label>
                <input id="c-mobile" type="tel" className="field" value={form.mobile} onChange={set('mobile')} />
              </div>
              <div>
                <label className="label" htmlFor="c-email">{t('contact.form.email')}</label>
                <input id="c-email" type="email" className="field" value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="c-message">{t('contact.form.message')} *</label>
              <textarea id="c-message" required rows={5} className="field" value={form.message} onChange={set('message')} />
            </div>
            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
              {status === 'sending' ? t('contact.form.submitting') : t('contact.form.submit')}
            </button>
            <div aria-live="polite">
              {status === 'ok' && <p className="text-center text-sm font-medium text-green-700">{t('contact.form.success')}</p>}
              {status === 'err' && <p className="text-center text-sm font-medium text-red-700">{t('contact.form.error')}</p>}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
