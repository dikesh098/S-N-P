import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { insertRow, updateRow, deleteRow, updateField } from './adminApi'
import { clearCache } from '../lib/useData'
import { pickCurrentYear } from '../lib/festival'
import { AdminHeader, AdminCard, RowActions, Modal, Field, EmptyState } from './ui'
import ImageUpload from './ImageUpload'
import type { Row } from '../lib/util'

const CATS = ['garba', 'dandiya', 'bhajan', 'dance', 'singing', 'children', 'competition', 'community']
const empty = { title: '', title_hi: '', title_mr: '', category: 'garba', description: '', description_hi: '', description_mr: '', event_date: '', event_time: '', location: '', image_url: '', published: true }

export default function AdminEvents() {
  const [years, setYears] = useState<Row[]>([])
  const [yearId, setYearId] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(empty)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('festival_years').select('*').order('year', { ascending: false }).then(({ data }) => {
      setYears(data || [])
      setYearId((pickCurrentYear(data || undefined) || data?.[0])?.id || '')
    })
  }, [])

  async function load() {
    if (!supabase || !yearId) { setRows([]); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('events').select('*').eq('festival_year_id', yearId).order('event_date')
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [yearId])

  function openNew() { setEditing(null); setForm(empty); setError(null); setModalOpen(true) }
  function openEdit(r: Row) { setEditing(r); setForm({ ...empty, ...r }); setError(null); setModalOpen(true) }

  async function onSave() {
    if (!yearId) { setError('Select a festival year first'); return }
    try {
      const payload = { ...form, festival_year_id: yearId, event_date: form.event_date || null }
      if (editing) await updateRow('events', editing.id, payload)
      else await insertRow('events', payload)
      clearCache('events'); setModalOpen(false); load()
    } catch (e: any) { setError(e.message) }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this event?')) return
    await deleteRow('events', id); clearCache('events'); load()
  }

  return (
    <div>
      <AdminHeader title="Events" onAdd={openNew} addLabel="Add Event" />
      <div className="mb-5 max-w-xs">
        <Field label="Festival Year">
          <select className="field" value={yearId} onChange={(e) => setYearId(e.target.value)}>
            {years.map((y) => <option key={y.id} value={y.id}>{y.year}</option>)}
          </select>
        </Field>
      </div>

      {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No events yet." /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <AdminCard key={r.id} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                {r.image_url && <img src={r.image_url} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" />}
                <div className="min-w-0">
                  <p className="font-serif text-lg text-maroon">{r.title} <span className="ml-2 text-xs font-medium capitalize text-saffron-600">{r.category}</span></p>
                  <p className="truncate text-sm text-ink/55">{r.event_date || 'No date'} {r.event_time ? `· ${r.event_time}` : ''}</p>
                </div>
              </div>
              <RowActions published={r.published} onTogglePublish={() => { updateField('events', r.id, 'published', !r.published).then(load); clearCache('events') }} onEdit={() => openEdit(r)} onDelete={() => onDelete(r.id)} />
            </AdminCard>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Event' : 'Add Event'} onClose={() => setModalOpen(false)} wide>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Title (English)"><input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Title (Hindi)"><input className="field" value={form.title_hi} onChange={(e) => setForm({ ...form, title_hi: e.target.value })} /></Field>
              <Field label="Title (Marathi)"><input className="field" value={form.title_mr} onChange={(e) => setForm({ ...form, title_mr: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Category">
                <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Date"><input type="date" className="field" value={form.event_date || ''} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></Field>
              <Field label="Time"><input placeholder="8:15 PM" className="field" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} /></Field>
            </div>
            <Field label="Location"><input className="field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Description (English)"><textarea rows={2} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
              <Field label="Description (Hindi)"><textarea rows={2} className="field" value={form.description_hi} onChange={(e) => setForm({ ...form, description_hi: e.target.value })} /></Field>
              <Field label="Description (Marathi)"><textarea rows={2} className="field" value={form.description_mr} onChange={(e) => setForm({ ...form, description_mr: e.target.value })} /></Field>
            </div>
            <ImageUpload label="Image" folder="events" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
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
