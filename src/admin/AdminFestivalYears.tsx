import { useEffect, useState } from 'react'
import { listAll, insertRow, updateRow, deleteRow, updateField } from './adminApi'
import { clearCache } from '../lib/useData'
import { AdminHeader, AdminCard, RowActions, Modal, Field, EmptyState } from './ui'
import ImageUpload from './ImageUpload'
import type { Row } from '../lib/util'

const empty = { year: new Date().getFullYear(), title: '', title_hi: '', title_mr: '', description: '', description_hi: '', description_mr: '', cover_image: '', start_date: '', end_date: '', is_current: false, published: true }

export default function AdminFestivalYears() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(empty)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try { setRows(await listAll('festival_years', 'year', false)) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setForm(empty); setError(null); setModalOpen(true) }
  function openEdit(r: Row) { setEditing(r); setForm({ ...empty, ...r }); setError(null); setModalOpen(true) }
  function close() { setModalOpen(false) }

  async function onSave() {
    try {
      const payload = { ...form, year: Number(form.year) }
      if (editing) await updateRow('festival_years', editing.id, payload)
      else await insertRow('festival_years', payload)
      if (payload.is_current) {
        // keep only one "current" year
        await Promise.all(rows.filter((r) => r.is_current && r.id !== editing?.id).map((r) => updateField('festival_years', r.id, 'is_current', false)))
      }
      clearCache('years'); clearCache('programs'); clearCache('events')
      setModalOpen(false)
      load()
    } catch (e: any) { setError(e.message) }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this festival year and all of its content?')) return
    await deleteRow('festival_years', id)
    clearCache('years')
    load()
  }

  return (
    <div>
      <AdminHeader title="Festival Years" onAdd={openNew} addLabel="Add Year" />
      {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No festival years yet." /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <AdminCard key={r.id} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                {r.cover_image && <img src={r.cover_image} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" />}
                <div className="min-w-0">
                  <p className="font-serif text-lg text-maroon">{r.year} {r.is_current && <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium text-maroon-700">Current</span>}</p>
                  <p className="truncate text-sm text-ink/55">{r.title}</p>
                </div>
              </div>
              <RowActions published={r.published} onTogglePublish={() => { updateField('festival_years', r.id, 'published', !r.published).then(load); clearCache('years') }} onEdit={() => openEdit(r)} onDelete={() => onDelete(r.id)} />
            </AdminCard>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Festival Year' : 'Add Festival Year'} onClose={close} wide>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Year"><input type="number" className="field" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></Field>
              <Field label="Mark as current year">
                <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_current} onChange={(e) => setForm({ ...form, is_current: e.target.checked })} /> This is the active festival year</label>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Title (English)"><input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Title (Hindi)"><input className="field" value={form.title_hi} onChange={(e) => setForm({ ...form, title_hi: e.target.value })} /></Field>
              <Field label="Title (Marathi)"><input className="field" value={form.title_mr} onChange={(e) => setForm({ ...form, title_mr: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Description (English)"><textarea rows={3} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
              <Field label="Description (Hindi)"><textarea rows={3} className="field" value={form.description_hi} onChange={(e) => setForm({ ...form, description_hi: e.target.value })} /></Field>
              <Field label="Description (Marathi)"><textarea rows={3} className="field" value={form.description_mr} onChange={(e) => setForm({ ...form, description_mr: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start Date"><input type="date" className="field" value={form.start_date || ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></Field>
              <Field label="End Date"><input type="date" className="field" value={form.end_date || ''} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></Field>
            </div>
            <ImageUpload label="Cover Image" folder="years" value={form.cover_image} onChange={(url) => setForm({ ...form, cover_image: url })} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={close} className="btn-outline !min-h-[38px] !px-4 !py-2 text-sm">Cancel</button>
              <button onClick={onSave} className="btn-primary !min-h-[38px] !px-4 !py-2 text-sm">Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
