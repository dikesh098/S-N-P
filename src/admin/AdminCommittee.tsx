import { useEffect, useState } from 'react'
import { listAll, insertRow, updateRow, deleteRow, updateField } from './adminApi'
import { clearCache } from '../lib/useData'
import { AdminHeader, AdminCard, RowActions, Modal, Field, EmptyState } from './ui'
import ImageUpload from './ImageUpload'
import type { Row } from '../lib/util'

const GROUPS = [
  { key: 'office', label: 'Office Bearers' }, { key: 'organizing', label: 'Organizing Members' },
  { key: 'cultural', label: 'Cultural Team' }, { key: 'volunteer', label: 'Volunteer Team' },
  { key: 'women', label: "Women's Committee" }, { key: 'youth', label: 'Youth Committee' },
]
const empty = { name: '', name_hi: '', name_mr: '', role: '', role_hi: '', role_mr: '', group_key: 'office', photo_url: '', description: '', description_hi: '', description_mr: '', sort_order: 0, published: true }

export default function AdminCommittee() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(empty)
  const [error, setError] = useState<string | null>(null)

  async function load() { setLoading(true); try { setRows(await listAll('committee_members', 'sort_order', true)) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setForm(empty); setError(null); setModalOpen(true) }
  function openEdit(r: Row) { setEditing(r); setForm({ ...empty, ...r }); setError(null); setModalOpen(true) }

  async function onSave() {
    try {
      if (editing) await updateRow('committee_members', editing.id, form)
      else await insertRow('committee_members', form)
      clearCache('committee'); setModalOpen(false); load()
    } catch (e: any) { setError(e.message) }
  }
  async function onDelete(id: string) {
    if (!confirm('Remove this committee member?')) return
    await deleteRow('committee_members', id); clearCache('committee'); load()
  }

  return (
    <div>
      <AdminHeader title="Committee" onAdd={openNew} addLabel="Add Member" />
      {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No committee members added yet." /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <AdminCard key={r.id} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                {r.photo_url && <img src={r.photo_url} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />}
                <div className="min-w-0">
                  <p className="font-serif text-lg text-maroon">{r.name} <span className="ml-2 text-xs font-medium text-saffron-600">{r.role}</span></p>
                  <p className="text-sm text-ink/55">{GROUPS.find((g) => g.key === r.group_key)?.label}</p>
                </div>
              </div>
              <RowActions published={r.published} onTogglePublish={() => { updateField('committee_members', r.id, 'published', !r.published).then(load); clearCache('committee') }} onEdit={() => openEdit(r)} onDelete={() => onDelete(r.id)} />
            </AdminCard>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Member' : 'Add Member'} onClose={() => setModalOpen(false)} wide>
          <div className="space-y-4">
            <Field label="Group">
              <select className="field" value={form.group_key} onChange={(e) => setForm({ ...form, group_key: e.target.value })}>
                {GROUPS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Name (English)"><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Name (Hindi)"><input className="field" value={form.name_hi} onChange={(e) => setForm({ ...form, name_hi: e.target.value })} /></Field>
              <Field label="Name (Marathi)"><input className="field" value={form.name_mr} onChange={(e) => setForm({ ...form, name_mr: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Role (English)"><input className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></Field>
              <Field label="Role (Hindi)"><input className="field" value={form.role_hi} onChange={(e) => setForm({ ...form, role_hi: e.target.value })} /></Field>
              <Field label="Role (Marathi)"><input className="field" value={form.role_mr} onChange={(e) => setForm({ ...form, role_mr: e.target.value })} /></Field>
            </div>
            <ImageUpload label="Photo" folder="committee" value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} />
            <Field label="Description (English)"><textarea rows={2} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Sort Order"><input type="number" className="field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></Field>
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
