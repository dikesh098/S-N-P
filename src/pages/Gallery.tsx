import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { getGallery } from '../lib/api'
import type { Row } from '../lib/util'
import SectionHeading from '../components/SectionHeading'
import SmartImage from '../components/YearImage'
import Lightbox from '../components/Lightbox'
import Seo from '../components/Seo'

const CATS = ['pratima', 'pandal', 'aarti', 'garba', 'cultural', 'community', 'volunteers', 'visarjan'] as const
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i)
const PAGE_SIZE = 24

export default function Gallery() {
  const { t } = useTranslation()
  const [year, setYear] = useState<number | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [items, setItems] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    setPage(0)
    setItems([])
    setHasMore(true)
  }, [year, category])

  useEffect(() => {
    let alive = true
    setLoading(true)
    getGallery({ year, category, page, pageSize: PAGE_SIZE })
      .then((rows) => {
        if (!alive) return
        setItems((prev) => (page === 0 ? rows : [...prev, ...rows]))
        setHasMore(rows.length === PAGE_SIZE)
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, category, page])

  const spans = useMemo(
    () => items.map((it, i) => (it._h && it._w ? it._h / it._w : 1) > 1.15 && i % 5 === 0),
    [items],
  )

  return (
    <>
      <Seo title={t('gallery.title')} />
      <section className="section bg-ivory">
        <div className="container-x">
          <SectionHeading label={t('gallery.label')} title={t('gallery.title')} />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => setYear(null)} aria-pressed={year === null} className="chip">{t('gallery.allYears')}</button>
            {YEARS.map((y) => (
              <button key={y} onClick={() => setYear(y)} aria-pressed={year === y} className="chip">{y}</button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => setCategory(null)} aria-pressed={category === null} className="chip">{t('gallery.allCategories')}</button>
            {CATS.map((c) => (
              <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c} className="chip">{t(`gallery.categories.${c}`)}</button>
            ))}
          </div>

          {!loading && items.length === 0 && <p className="mt-14 text-center text-ink/60">{t('gallery.empty')}</p>}

          <div className="mt-12 columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
            {items.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setLightboxIndex(i)}
                className={`group block w-full overflow-hidden rounded-md ${spans[i] ? '' : ''}`}
              >
                <SmartImage src={g.thumb_url || g.image_url} alt={g.caption || ''} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </button>
            ))}
          </div>

          {hasMore && items.length > 0 && (
            <div className="mt-10 text-center">
              <button onClick={() => setPage((p) => p + 1)} disabled={loading} className="btn-outline">
                {loading ? t('common.loading') : t('gallery.loadMore')}
              </button>
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox images={items} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={setLightboxIndex} />
      )}
    </>
  )
}
