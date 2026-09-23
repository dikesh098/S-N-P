import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mandala } from '../components/Ornaments'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <section className="section relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-ivory text-center">
      <Mandala className="pointer-events-none absolute h-[420px] w-[420px] text-gold/10" />
      <div className="container-x relative">
        <p className="text-5xl">🪔</p>
        <h1 className="mt-4 font-serif text-3xl text-maroon">{t('common.notFoundTitle')}</h1>
        <p className="mt-3 text-ink/70">{t('common.notFoundBody')}</p>
        <Link to="/" className="btn-primary mt-7">{t('common.backHome')}</Link>
      </div>
    </section>
  )
}
