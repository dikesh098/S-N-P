import { useEffect, useState } from 'react'
import { listAll, insertRow, updateRow, deleteRow, updateField } from './adminApi'
import { clearCache } from '../lib/useData'
import { AdminHeader, AdminCard, RowActions, Modal, Field, EmptyState } from './ui'
import ImageUpload from './ImageUpload'
import type { Row } from '../lib/util'

const empty = { title: '', title_hi: '', title_mr: '', category: '', description: '', description_hi: '', description_mr: '', activity_date: '', image_url: '', published: true }

export default function AdminActivities() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(empty)
  const [error, setError] = useState<string | null>(null)

  async function load() { setLoading(true); try { setRows(await listAll('community_activities', 'activity_date', false)) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setForm(empty); setError(null); setModalOpen(true) }
  function openEdit(r: Row) { setEditing(r); setForm({ ...empty, ...r }); setError(null); setModalOpen(true) }

  async function onSave() {
    try {
      const payload = { ...form, activity_date: form.activity_date || null }
      if (editing) await updateRow('community_activities', editing.id, payload)
      else await insertRow('community_activities', payload)
      clearCache('activities'); setModalOpen(false); load()
    } catch (e: any) { setError(e.message) }
  }
  async function onDelete(id: string) {
    if (!confirm('Delete this activity?')) return
    await deleteRow('community_activities', id); clearCache('activities'); load()
  }

  return (
    <div>
      <AdminHeader title="Community Activities" onAdd={openNew} addLabel="Add Activity" />
      {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No activities added yet." /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <AdminCard key={r.id} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                {r.image_url && <img src={r.image_url} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" />}
                <div className="min-w-0">
                  <p className="font-serif text-lg text-maroon">{r.title}</p>
                  <p className="text-sm text-ink/55">{r.activity_date || 'No date'} {r.category ? `· ${r.category}` : ''}</p>
                </div>
              </div>
              <RowActions published={r.published} onTogglePublish={() => { updateField('community_activities', r.id, 'published', !r.published).then(load); clearCache('activities') }} onEdit={() => openEdit(r)} onDelete={() => onDelete(r.id)} />
            </AdminCard>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Activity' : 'Add Activity'} onClose={() => setModalOpen(false)} wide>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Title (English)"><input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Title (Hindi)"><input className="field" value={form.title_hi} onChange={(e) => setForm({ ...form, title_hi: e.target.value })} /></Field>
              <Field label="Title (Marathi)"><input className="field" value={form.title_mr} onChange={(e) => setForm({ ...form, title_mr: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category"><input className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
              <Field label="Date"><input type="date" className="field" value={form.activity_date || ''} onChange={(e) => setForm({ ...form, activity_date: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Description (English)"><textarea rows={2} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
              <Field label="Description (Hindi)"><textarea rows={2} className="field" value={form.description_hi} onChange={(e) => setForm({ ...form, description_hi: e.target.value })} /></Field>
              <Field label="Description (Marathi)"><textarea rows={2} className="field" value={form.description_mr} onChange={(e) => setForm({ ...form, description_mr: e.target.value })} /></Field>
            </div>
            <ImageUpload label="Image" folder="activities" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
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
