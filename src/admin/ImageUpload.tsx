import { useRef, useState } from 'react'
import { Upload, Loader2, X } from 'lucide-react'
import { uploadImage } from '../lib/image'

export default function ImageUpload({
  value, onChange, folder, label = 'Image',
}: { value?: string | null; onChange: (url: string) => void; folder: string; label?: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file?: File) {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
    } catch (e: any) {
      setError(e?.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-md border border-gold/30 bg-cream">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange('')} className="absolute right-0.5 top-0.5 rounded-full bg-maroon-900/70 p-0.5 text-ivory">
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-gold/40 bg-cream text-gold">
            <Upload size={20} />
          </div>
        )}
        <div>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="btn-outline !min-h-[38px] !px-3 !py-1.5 text-xs">
            {busy ? <Loader2 size={14} className="animate-spin" /> : 'Choose File'}
          </button>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}
