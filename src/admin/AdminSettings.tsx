import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSettings } from '../context/SettingsContext'
import { AdminHeader, AdminCard, Field } from './ui'
import ImageUpload from './ImageUpload'
import { Save, Loader2 } from 'lucide-react'

const FIELDS: Array<{ key: string; label: string; type?: 'text' | 'textarea' | 'image' }> = [
  { key: 'organizationName', label: 'Organization Name' },
  { key: 'festivalName', label: 'Festival Name' },
  { key: 'colonyName', label: 'Colony Name' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'currentYear', label: 'Current Year' },
  { key: 'venue', label: 'Venue' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'upiId', label: 'UPI ID' },
  { key: 'bankDetails', label: 'Bank Details (shown on Contribute page)', type: 'textarea' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'youtube', label: 'YouTube URL' },
  { key: 'whatsapp', label: 'WhatsApp Number (with country code, digits only)' },
  { key: 'logo', label: 'Logo', type: 'image' },
  { key: 'heroImage', label: 'Default Hero Image', type: 'image' },
]

export default function AdminSettings() {
  const { settings, refresh } = useSettings()
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => setForm(settings), [settings])

  async function onSave() {
    if (!supabase) return
    setSaving(true)
    setSaved(false)
    const rows = Object.entries(form).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('website_settings').upsert(rows, { onConflict: 'key' })
    setSaving(false)
    if (!error) {
      setSaved(true)
      refresh()
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div>
      <AdminHeader title="Website Settings" />
      <AdminCard>
        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.map((f) =>
            f.type === 'image' ? (
              <ImageUpload key={f.key} label={f.label} folder="settings" value={form[f.key]} onChange={(url) => setForm((s) => ({ ...s, [f.key]: url }))} />
            ) : (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <Field label={f.label}>
                  {f.type === 'textarea' ? (
                    <textarea rows={3} className="field" value={form[f.key] || ''} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} />
                  ) : (
                    <input className="field" value={form[f.key] || ''} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} />
                  )}
                </Field>
              </div>
            ),
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={onSave} disabled={saving} className="btn-primary !min-h-[40px] !px-5 !py-2 text-sm">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Settings
          </button>
          {saved && <span className="text-sm font-medium text-green-700">Saved</span>}
        </div>
      </AdminCard>

      <AdminCard className="mt-6">
        <h2 className="font-serif text-lg text-maroon">Translations</h2>
        <p className="mt-2 text-sm text-ink/65">
          Interface labels (buttons, menus, section titles) live in <code>src/locales/en.json</code>, <code>hi.json</code> and{' '}
          <code>mr.json</code> in the project code. Content you add here in the dashboard — festival years, programs, events,
          announcements, committee members and activities — has its own English / Hindi / Marathi fields directly on each
          form, so no code changes are needed for day-to-day content.
        </p>
      </AdminCard>
    </div>
  )
}
