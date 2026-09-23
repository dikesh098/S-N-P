import { useEffect, useState } from 'react'
import { listAll, insertRow, updateRow, deleteRow, updateField } from './adminApi'
import { clearCache } from '../lib/useData'
import { youtubeId } from '../lib/util'
import { AdminHeader, AdminCard, RowActions, Modal, Field, EmptyState } from './ui'
import type { Row } from '../lib/util'

const CURRENT_YEAR = new Date().getFullYear()
const empty = { youtube_url: '', title: '', title_hi: '', title_mr: '', description: '', description_hi: '', description_mr: '', year: CURRENT_YEAR, category: '', published: true }

export default function AdminVideos() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(empty)
  const [error, setError] = useState<string | null>(null)

  async function load() { setLoading(true); try { setRows(await listAll('videos', 'created_at', false)) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setForm(empty); setError(null); setModalOpen(true) }
  function openEdit(r: Row) { setEditing(r); setForm({ ...empty, ...r }); setError(null); setModalOpen(true) }

  async function onSave() {
    if (!youtubeId(form.youtube_url)) { setError('Please enter a valid YouTube URL'); return }
    try {
      const payload = { ...form, year: Number(form.year) }
      if (editing) await updateRow('videos', editing.id, payload)
      else await insertRow('videos', payload)
      clearCache('videos'); setModalOpen(false); load()
    } catch (e: any) { setError(e.message) }
  }
  async function onDelete(id: string) {
    if (!confirm('Delete this video?')) return
    await deleteRow('videos', id); clearCache('videos'); load()
  }

  return (
    <div>
      <AdminHeader title="Videos" onAdd={openNew} addLabel="Add Video" />
      {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No videos added yet." /> : (
        <div className="space-y-3">
          {rows.map((r) => {
            const id = youtubeId(r.youtube_url)
            return (
              <AdminCard key={r.id} className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  {id && <img src={`https://i.ytimg.com/vi/${id}/default.jpg`} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover" />}
                  <div className="min-w-0">
                    <p className="truncate font-serif text-lg text-maroon">{r.title}</p>
                    <p className="text-sm text-ink/55">{r.year} {r.category ? `· ${r.category}` : ''}</p>
                  </div>
                </div>
                <RowActions published={r.published} onTogglePublish={() => { updateField('videos', r.id, 'published', !r.published).then(load); clearCache('videos') }} onEdit={() => openEdit(r)} onDelete={() => onDelete(r.id)} />
              </AdminCard>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Video' : 'Add Video'} onClose={() => setModalOpen(false)} wide>
          <div className="space-y-4">
            <Field label="YouTube URL"><input placeholder="https://youtube.com/watch?v=…" className="field" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Title (English)"><input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Title (Hindi)"><input className="field" value={form.title_hi} onChange={(e) => setForm({ ...form, title_hi: e.target.value })} /></Field>
              <Field label="Title (Marathi)"><input className="field" value={form.title_mr} onChange={(e) => setForm({ ...form, title_mr: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Year"><input type="number" className="field" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></Field>
              <Field label="Category"><input className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
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
