import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSettings } from '../context/SettingsContext'
import { isPlaceholder, waLink } from '../lib/util'

export default function WhatsAppFab() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  if (isPlaceholder(settings.whatsapp)) return null
  return (
    <a
      href={waLink(settings.whatsapp, `${t('hero.greeting')} — `)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('common.whatsapp')}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:scale-105"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  )
}
