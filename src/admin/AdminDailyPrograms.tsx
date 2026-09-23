import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { insertRow, updateRow, deleteRow, updateField } from './adminApi'
import { clearCache } from '../lib/useData'
import { pickCurrentYear } from '../lib/festival'
import { AdminHeader, AdminCard, RowActions, Modal, Field, EmptyState } from './ui'
import ImageUpload from './ImageUpload'
import type { Row } from '../lib/util'
import { Plus, Trash2 } from 'lucide-react'

const emptyItem = { time: '', title: '', title_hi: '', title_mr: '', kind: 'aarti' }
const empty = { day_number: 1, program_date: '', title: '', title_hi: '', title_mr: '', description: '', description_hi: '', description_mr: '', location: '', image_url: '', darshan_image_url: '', items: [emptyItem], published: true }

export default function AdminDailyPrograms() {
  const [years, setYears] = useState<Row[]>([])
  const [yearId, setYearId] = useState<string>('')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(empty)
  const [error, setError] = useState<string | null>(null)

  async function loadYears() {
    if (!supabase) return
    const { data } = await supabase.from('festival_years').select('*').order('year', { ascending: false })
    setYears(data || [])
    const cur = pickCurrentYear(data || undefined)
    setYearId((cur || data?.[0])?.id || '')
  }
  useEffect(() => { loadYears() }, [])

  async function loadPrograms() {
    if (!supabase || !yearId) { setRows([]); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('daily_programs').select('*').eq('festival_year_id', yearId).order('day_number')
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { loadPrograms() }, [yearId])

  function openNew() { setEditing(null); setForm({ ...empty, day_number: (rows[rows.length - 1]?.day_number || 0) + 1 }); setError(null); setModalOpen(true) }
  function openEdit(r: Row) { setEditing(r); setForm({ ...empty, ...r, items: r.items?.length ? r.items : [emptyItem] }); setError(null); setModalOpen(true) }
  function close() { setModalOpen(false) }

  async function onSave() {
    if (!yearId) { setError('Select a festival year first'); return }
    try {
      const payload = { ...form, festival_year_id: yearId, day_number: Number(form.day_number), program_date: form.program_date || null }
      if (editing) await updateRow('daily_programs', editing.id, payload)
      else await insertRow('daily_programs', payload)
      clearCache('programs')
      setModalOpen(false)
      loadPrograms()
    } catch (e: any) { setError(e.message) }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this day?')) return
    await deleteRow('daily_programs', id)
    clearCache('programs')
    loadPrograms()
  }

  function setItem(i: number, patch: Partial<typeof emptyItem>) {
    setForm((f: any) => ({ ...f, items: f.items.map((it: any, idx: number) => (idx === i ? { ...it, ...patch } : it)) }))
  }

  return (
    <div>
      <AdminHeader title="Daily Programs" onAdd={openNew} addLabel="Add Day" />

      <div className="mb-5 max-w-xs">
        <Field label="Festival Year">
          <select className="field" value={yearId} onChange={(e) => setYearId(e.target.value)}>
            {years.map((y) => <option key={y.id} value={y.id}>{y.year}</option>)}
          </select>
        </Field>
      </div>

      {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No days added for this year yet." /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <AdminCard key={r.id} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                {r.image_url && <img src={r.image_url} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" />}
                <div className="min-w-0">
                  <p className="font-serif text-lg text-maroon">Day {r.day_number} {r.title && `· ${r.title}`}</p>
                  <p className="truncate text-sm text-ink/55">{r.program_date || 'No date set'} {r.location ? `· ${r.location}` : ''}</p>
                </div>
              </div>
              <RowActions published={r.published} onTogglePublish={() => { updateField('daily_programs', r.id, 'published', !r.published).then(loadPrograms); clearCache('programs') }} onEdit={() => openEdit(r)} onDelete={() => onDelete(r.id)} />
            </AdminCard>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Day' : 'Add Day'} onClose={close} wide>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Day Number"><input type="number" min={1} max={12} className="field" value={form.day_number} onChange={(e) => setForm({ ...form, day_number: e.target.value })} /></Field>
              <Field label="Date"><input type="date" className="field" value={form.program_date || ''} onChange={(e) => setForm({ ...form, program_date: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Title (English)"><input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Title (Hindi)"><input className="field" value={form.title_hi} onChange={(e) => setForm({ ...form, title_hi: e.target.value })} /></Field>
              <Field label="Title (Marathi)"><input className="field" value={form.title_mr} onChange={(e) => setForm({ ...form, title_mr: e.target.value })} /></Field>
            </div>
            <Field label="Location"><input className="field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Description (English)"><textarea rows={2} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
              <Field label="Description (Hindi)"><textarea rows={2} className="field" value={form.description_hi} onChange={(e) => setForm({ ...form, description_hi: e.target.value })} /></Field>
              <Field label="Description (Marathi)"><textarea rows={2} className="field" value={form.description_mr} onChange={(e) => setForm({ ...form, description_mr: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageUpload label="Day Card Image" folder="programs" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
              <ImageUpload label="Darshan Image" folder="programs" value={form.darshan_image_url} onChange={(url) => setForm({ ...form, darshan_image_url: url })} />
            </div>

            <div>
              <label className="label">Schedule Items</label>
              <div className="space-y-2">
                {form.items.map((it: any, i: number) => (
                  <div key={i} className="grid grid-cols-[80px_1fr_1fr_auto] items-center gap-2">
                    <input placeholder="7:30 PM" className="field !py-2 text-sm" value={it.time} onChange={(e) => setItem(i, { time: e.target.value })} />
                    <select className="field !py-2 text-sm" value={it.kind} onChange={(e) => setItem(i, { kind: e.target.value })}>
                      <option value="aarti">Aarti</option>
                      <option value="cultural">Cultural Program</option>
                      <option value="prasad">Prasad</option>
                      <option value="other">Other</option>
                    </select>
                    <input placeholder="Title (English)" className="field !py-2 text-sm" value={it.title} onChange={(e) => setItem(i, { title: e.target.value })} />
                    <button type="button" onClick={() => setForm((f: any) => ({ ...f, items: f.items.filter((_: any, idx: number) => idx !== i) }))} className="rounded-md p-2 text-ink/40 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setForm((f: any) => ({ ...f, items: [...f.items, emptyItem] }))} className="btn-outline mt-2 !min-h-[34px] !px-3 !py-1.5 text-xs">
                <Plus size={14} /> Add Item
              </button>
            </div>

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
