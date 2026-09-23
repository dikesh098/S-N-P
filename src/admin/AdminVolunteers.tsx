import { useEffect, useState } from 'react'
import { listAll, updateField, deleteRow } from './adminApi'
import { AdminHeader, AdminCard, EmptyState } from './ui'
import { CheckCircle2, Circle, Trash2, Phone, Mail } from 'lucide-react'
import type { Row } from '../lib/util'
import { fmtDate } from '../lib/util'

export default function AdminVolunteers() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  async function load() { setLoading(true); try { setRows(await listAll('volunteers', 'created_at', false)) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  async function toggleContacted(r: Row) {
    await updateField('volunteers', r.id, 'is_contacted', !r.is_contacted)
    load()
  }
  async function onDelete(id: string) {
    if (!confirm('Delete this registration?')) return
    await deleteRow('volunteers', id)
    load()
  }

  return (
    <div>
      <AdminHeader title="Volunteers" />
      <p className="mb-5 text-sm text-ink/55">{rows.length} registration{rows.length === 1 ? '' : 's'} · this list is private and never shown on the public website.</p>
      {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No volunteer registrations yet." /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <AdminCard key={r.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-lg text-maroon">{r.name}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/60">
                    <span className="flex items-center gap-1"><Phone size={13} /> {r.mobile}</span>
                    {r.email && <span className="flex items-center gap-1"><Mail size={13} /> {r.email}</span>}
                  </div>
                  {(r.area || r.activity) && <p className="mt-1.5 text-sm text-ink/70">{[r.area, r.activity].filter(Boolean).join(' · ')}</p>}
                  {r.available_dates && <p className="mt-1 text-sm text-ink/55">Available: {r.available_dates}</p>}
                  {r.message && <p className="mt-2 rounded-md bg-cream p-2.5 text-sm italic text-ink/70">"{r.message}"</p>}
                  <p className="mt-2 text-xs text-ink/40">{fmtDate(r.created_at)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button onClick={() => toggleContacted(r)} title={r.is_contacted ? 'Mark not contacted' : 'Mark contacted'} className="rounded-md p-2 text-ink/50 hover:bg-cream hover:text-maroon">
                    {r.is_contacted ? <CheckCircle2 size={18} className="text-green-600" /> : <Circle size={18} />}
                  </button>
                  <button onClick={() => onDelete(r.id)} title="Delete" className="rounded-md p-2 text-ink/50 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  )
}
