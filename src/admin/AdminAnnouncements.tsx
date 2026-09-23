import { useEffect, useState } from 'react'
import { listAll, insertRow, updateRow, deleteRow, updateField } from './adminApi'
import { clearCache } from '../lib/useData'
import { AdminHeader, AdminCard, RowActions, Modal, Field, EmptyState } from './ui'
import type { Row } from '../lib/util'

const empty = { title: '', title_hi: '', title_mr: '', description: '', description_hi: '', description_mr: '', announcement_date: new Date().toISOString().slice(0, 10), event_time: '', location: '', priority: 'normal', published: true }

export default function AdminAnnouncements() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(empty)
  const [error, setError] = useState<string | null>(null)

  async function load() { setLoading(true); try { setRows(await listAll('announcements', 'announcement_date', false)) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setForm(empty); setError(null); setModalOpen(true) }
  function openEdit(r: Row) { setEditing(r); setForm({ ...empty, ...r }); setError(null); setModalOpen(true) }

  async function onSave() {
    try {
      if (editing) await updateRow('announcements', editing.id, form)
      else await insertRow('announcements', form)
      clearCache('announcements'); setModalOpen(false); load()
    } catch (e: any) { setError(e.message) }
  }
  async function onDelete(id: string) {
    if (!confirm('Delete this announcement?')) return
    await deleteRow('announcements', id); clearCache('announcements'); load()
  }

  return (
    <div>
      <AdminHeader title="Announcements" onAdd={openNew} addLabel="Add Announcement" />
      {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No announcements yet." /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <AdminCard key={r.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-serif text-lg text-maroon">{r.title} {r.priority !== 'normal' && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">{r.priority}</span>}</p>
                <p className="truncate text-sm text-ink/55">{r.announcement_date} {r.event_time ? `· ${r.event_time}` : ''} {r.location ? `· ${r.location}` : ''}</p>
              </div>
              <RowActions published={r.published} onTogglePublish={() => { updateField('announcements', r.id, 'published', !r.published).then(load); clearCache('announcements') }} onEdit={() => openEdit(r)} onDelete={() => onDelete(r.id)} />
            </AdminCard>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Announcement' : 'Add Announcement'} onClose={() => setModalOpen(false)} wide>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Title (English)"><input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Title (Hindi)"><input className="field" value={form.title_hi} onChange={(e) => setForm({ ...form, title_hi: e.target.value })} /></Field>
              <Field label="Title (Marathi)"><input className="field" value={form.title_mr} onChange={(e) => setForm({ ...form, title_mr: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Date"><input type="date" className="field" value={form.announcement_date} onChange={(e) => setForm({ ...form, announcement_date: e.target.value })} /></Field>
              <Field label="Time"><input placeholder="7:30 PM" className="field" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} /></Field>
              <Field label="Priority">
                <select className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
                </select>
              </Field>
            </div>
            <Field label="Location"><input className="field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Description (English)"><textarea rows={2} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
              <Field label="Description (Hindi)"><textarea rows={2} className="field" value={form.description_hi} onChange={(e) => setForm({ ...form, description_hi: e.target.value })} /></Field>
              <Field label="Description (Marathi)"><textarea rows={2} className="field" value={form.description_mr} onChange={(e) => setForm({ ...form, description_mr: e.target.value })} /></Field>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalOpen(false)} className="btn-outline !min-h-[38px] !px-4 !py-2 text-sm">Cancel</button>
              <button onClick={onSave} className="btn-primary !min-h-[38px] !px-4 !py-2 text-sm">Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
