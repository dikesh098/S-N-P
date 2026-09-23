import { type ReactNode } from 'react'
import { Trash2, Pencil, Plus, Eye, EyeOff } from 'lucide-react'

export function AdminHeader({ title, onAdd, addLabel = 'Add New' }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-serif text-2xl text-maroon">{title}</h1>
      {onAdd && (
        <button onClick={onAdd} className="btn-primary !min-h-[40px] !px-4 !py-2 text-sm">
          <Plus size={16} /> {addLabel}
        </button>
      )}
    </div>
  )
}

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`paper rounded-md p-5 ${className}`}>{children}</div>
}

export function RowActions({
  published, onTogglePublish, onEdit, onDelete,
}: { published?: boolean; onTogglePublish?: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {onTogglePublish && (
        <button onClick={onTogglePublish} title={published ? 'Unpublish' : 'Publish'} className="rounded-md p-2 text-ink/50 hover:bg-cream hover:text-maroon">
          {published ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      )}
      <button onClick={onEdit} title="Edit" className="rounded-md p-2 text-ink/50 hover:bg-cream hover:text-maroon">
        <Pencil size={16} />
      </button>
      <button onClick={onDelete} title="Delete" className="rounded-md p-2 text-ink/50 hover:bg-red-50 hover:text-red-600">
        <Trash2 size={16} />
      </button>
    </div>
  )
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className={`max-h-[90vh] w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} overflow-y-auto rounded-md bg-ivory p-6 sm:p-7`} onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-5 font-serif text-xl text-maroon">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

export function EmptyState({ text }: { text: string }) {
  return <p className="py-10 text-center text-sm text-ink/50">{text}</p>
}
