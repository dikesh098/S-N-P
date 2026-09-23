import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getSettings, DEFAULT_SETTINGS } from '../lib/api'

interface Ctx {
  settings: Record<string, string>
  loading: boolean
  refresh: () => void
}

const SettingsCtx = createContext<Ctx>({ settings: DEFAULT_SETTINGS, loading: true, refresh: () => {} })

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getSettings()
      .then(setSettings)
      .catch(() => setSettings(DEFAULT_SETTINGS))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const value = useMemo(() => ({ settings, loading, refresh: load }), [settings, loading])
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>
}

export const useSettings = () => useContext(SettingsCtx)
