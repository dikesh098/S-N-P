import { useTranslation } from 'react-i18next'
import { useState, type FormEvent } from 'react'
import { submitVolunteer } from '../lib/api'
import SectionHeading from '../components/SectionHeading'
import { FloralDivider } from '../components/Ornaments'
import Seo from '../components/Seo'

const initial = { name: '', mobile: '', email: '', area: '', activity: '', available_dates: '', message: '' }

export default function Volunteer() {
  const { t } = useTranslation()
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.mobile.trim()) return
    setStatus('sending')
    try {
      await submitVolunteer(form)
      setStatus('ok')
      setForm(initial)
    } catch {
      setStatus('err')
    }
  }

  return (
    <>
      <Seo title={t('volunteer.title')} />
      <section className="section bg-cream">
        <div className="container-x max-w-2xl">
          <SectionHeading label={t('volunteer.label')} title={t('volunteer.title')} />
          <p className="prose-devotional mx-auto mt-6 text-center">{t('volunteer.intro')}</p>
          <FloralDivider className="mx-auto mt-8 max-w-xs" />

          <form onSubmit={onSubmit} className="paper mt-10 space-y-5 rounded-md p-7 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="v-name">{t('volunteer.form.name')} *</label>
                <input id="v-name" required className="field" value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className="label" htmlFor="v-mobile">{t('volunteer.form.mobile')} *</label>
                <input id="v-mobile" required type="tel" className="field" value={form.mobile} onChange={set('mobile')} />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="v-email">{t('volunteer.form.email')}</label>
                <input id="v-email" type="email" className="field" value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="label" htmlFor="v-area">{t('volunteer.form.area')}</label>
                <input id="v-area" className="field" value={form.area} onChange={set('area')} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="v-activity">{t('volunteer.form.activity')}</label>
              <input id="v-activity" className="field" value={form.activity} onChange={set('activity')} />
            </div>
            <div>
              <label className="label" htmlFor="v-dates">{t('volunteer.form.dates')}</label>
              <input id="v-dates" className="field" value={form.available_dates} onChange={set('available_dates')} />
            </div>
            <div>
              <label className="label" htmlFor="v-message">{t('volunteer.form.message')}</label>
              <textarea id="v-message" rows={4} className="field" value={form.message} onChange={set('message')} />
            </div>

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
              {status === 'sending' ? t('volunteer.form.submitting') : t('volunteer.form.submit')}
            </button>

            <div aria-live="polite">
              {status === 'ok' && <p className="text-center text-sm font-medium text-green-700">{t('volunteer.form.success')}</p>}
              {status === 'err' && <p className="text-center text-sm font-medium text-red-700">{t('volunteer.form.error')}</p>}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
