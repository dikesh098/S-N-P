import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { useSettings } from '../context/SettingsContext'
import { isPlaceholder } from '../lib/util'
import SectionHeading from '../components/SectionHeading'
import { FloralDivider } from '../components/Ornaments'
import Seo from '../components/Seo'

export default function Contribute() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const upiReady = !isPlaceholder(settings.upiId)
  const upiLink = upiReady ? `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.organizationName)}&cu=INR` : ''

  return (
    <>
      <Seo title={t('contribute.title')} />
      <section className="section bg-ivory">
        <div className="container-x max-w-xl text-center">
          <SectionHeading label={t('contribute.label')} title={t('contribute.title')} />
          <p className="prose-devotional mx-auto mt-6">{t('contribute.intro')}</p>
          <FloralDivider className="mx-auto mt-8 max-w-xs" />

          <div className="paper mx-auto mt-10 rounded-md p-8 sm:p-10">
            {upiReady ? (
              <>
                <div className="mx-auto flex w-fit items-center justify-center rounded-md border border-gold/40 bg-white p-4">
                  <QRCodeSVG value={upiLink} size={180} fgColor="#6B1625" bgColor="#ffffff" />
                </div>
                <p className="label mt-6">{t('contribute.upi')}</p>
                <p className="select-all break-all font-serif text-xl text-maroon">{settings.upiId}</p>
              </>
            ) : (
              <p className="text-ink/60">[UPI details will be published here by the organizing committee]</p>
            )}

            {!isPlaceholder(settings.bankDetails ?? '') && (
              <div className="mt-8 border-t border-gold/20 pt-6 text-left">
                <p className="label">{t('contribute.bank')}</p>
                <p className="whitespace-pre-line text-sm text-ink/75">{settings.bankDetails}</p>
              </div>
            )}
          </div>

          <p className="prose-devotional mx-auto mt-8 text-sm text-ink/60">{t('contribute.instructions')}</p>
          <p className="mx-auto mt-4 max-w-sm text-xs text-ink/45">{t('contribute.noPayments')}</p>
        </div>
      </section>
    </>
  )
}
