import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { deleteRow, updateField } from './adminApi'
import { clearCache } from '../lib/useData'
import { uploadWithThumb } from '../lib/image'
import { AdminHeader, AdminCard, EmptyState, Field } from './ui'
import { Trash2, Star, Loader2 } from 'lucide-react'
import type { Row } from '../lib/util'

const CATS = ['pratima', 'pandal', 'aarti', 'garba', 'cultural', 'community', 'volunteers', 'visarjan']
const CURRENT_YEAR = new Date().getFullYear()

export default function AdminGallery() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(CURRENT_YEAR)
  const [category, setCategory] = useState('pandal')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')

  async function load() {
    if (!supabase) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false }).limit(100)
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function onUpload(files: FileList | null) {
    if (!files || !files.length || !supabase) return
    setUploading(true)
    const list = Array.from(files)
    for (let i = 0; i < list.length; i++) {
      setProgress(`Uploading ${i + 1} of ${list.length}…`)
      try {
        const { image_url, thumb_url } = await uploadWithThumb(list[i], 'gallery')
        await supabase.from('gallery_images').insert({ year, category, image_url, thumb_url, published: true })
      } catch (e) {
        console.error(e)
      }
    }
    setUploading(false)
    setProgress('')
    clearCache('gallery')
    load()
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this photo?')) return
    await deleteRow('gallery_images', id)
    clearCache('gallery')
    load()
  }

  async function toggleFeatured(r: Row) {
    await updateField('gallery_images', r.id, 'is_featured', !r.is_featured)
    clearCache('gallery')
    load()
  }

  return (
    <div>
      <AdminHeader title="Gallery" />

      <AdminCard>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Year">
            <select className="field" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {Array.from({ length: 8 }, (_, i) => CURRENT_YEAR - i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Upload Photos (multiple allowed)">
            <input type="file" accept="image/*" multiple disabled={uploading} onChange={(e) => onUpload(e.target.files)} className="field !py-2" />
          </Field>
        </div>
        {uploading && <p className="mt-3 flex items-center gap-2 text-sm text-ink/60"><Loader2 size={14} className="animate-spin" /> {progress}</p>}
        <p className="mt-2 text-xs text-ink/45">Photos are automatically resized and converted to WebP to stay within free-tier storage limits.</p>
      </AdminCard>

      <div className="mt-6">
        {loading ? <EmptyState text="Loading…" /> : rows.length === 0 ? <EmptyState text="No photos uploaded yet." /> : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {rows.map((r) => (
              <div key={r.id} className="group relative overflow-hidden rounded-md border border-gold/25 bg-cream">
                <img src={r.thumb_url || r.image_url} alt="" className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => toggleFeatured(r)} title="Feature on homepage" className={`rounded-full p-1.5 ${r.is_featured ? 'bg-gold text-maroon-900' : 'bg-white/80 text-ink/60'}`}>
                    <Star size={13} fill={r.is_featured ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => onDelete(r.id)} title="Delete" className="rounded-full bg-white/80 p-1.5 text-red-600">
                    <Trash2 size={13} />
                  </button>
                </div>
                <span className="absolute left-1 top-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{r.year} · {r.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
