import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Row } from '../lib/util'

export default function Lightbox({
  images, index, onClose, onNav,
}: { images: Row[]; index: number; onClose: () => void; onNav: (i: number) => void }) {
  const img = images[index]

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onNav((index - 1 + images.length) % images.length)
    },
    [index, images.length, onClose, onNav],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!img) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-maroon-900/95 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-full bg-ivory/10 p-2.5 text-ivory hover:bg-ivory/20">
        <X size={22} />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onNav((index - 1 + images.length) % images.length) }}
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-ivory/10 p-2.5 text-ivory hover:bg-ivory/20 sm:left-4"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNav((index + 1) % images.length) }}
            aria-label="Next"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-ivory/10 p-2.5 text-ivory hover:bg-ivory/20 sm:right-4"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <img src={img.image_url} alt={img.caption || ''} className="max-h-[80vh] w-full rounded-md object-contain" />
        {img.caption && <figcaption className="mt-3 text-center text-sm text-ivory/80">{img.caption}</figcaption>}
      </figure>
    </div>
  )
}
