import { useEffect, useState } from 'react'
import { listAll, updateField, deleteRow } from './adminApi'
import { AdminHeader, AdminCard, EmptyState } from './ui'
import { Mail, MailOpen, Trash2, Phone } from 'lucide-react'
import type { Row } from '../lib/util'
import { fmtDate } from '../lib/util'

export default function AdminMessages() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  async function load() { setLoading(true); try { setRows(await listAll('contact_messages', 'created_at', false)) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  async function toggleRead(r: Row) {
    await updateField('contact_messages', r.id, 'is_read', !r.is_read)
    load()
  }
  async function onDelete(id: string) {
    if (!confirm('Delete this message?')) return
    await deleteRow('contact_messages', id)
    load()
  }

  return (
    <div>
      <AdminHeader title="Contact Messages" />
      <p className="mb-5 text-sm text-ink/55">{rows.filter((r) => !r.is_read).length} unread of {rows.length}.</p>
      {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No messages yet." /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <AdminCard key={r.id} className={r.is_read ? 'opacity-70' : ''}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-lg text-maroon">{r.name}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/60">
                    {r.mobile && <span className="flex items-center gap-1"><Phone size={13} /> {r.mobile}</span>}
                    {r.email && <span>{r.email}</span>}
                  </div>
                  <p className="mt-2 rounded-md bg-cream p-2.5 text-sm text-ink/75">{r.message}</p>
                  <p className="mt-2 text-xs text-ink/40">{fmtDate(r.created_at)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button onClick={() => toggleRead(r)} title={r.is_read ? 'Mark unread' : 'Mark read'} className="rounded-md p-2 text-ink/50 hover:bg-cream hover:text-maroon">
                    {r.is_read ? <MailOpen size={17} /> : <Mail size={17} className="text-saffron-600" />}
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
