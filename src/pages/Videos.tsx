import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useData } from '../lib/useData'
import { getVideos } from '../lib/api'
import { tr, youtubeId } from '../lib/util'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import { Play } from 'lucide-react'

export default function Videos() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: videos, loading } = useData('videos', getVideos)
  const [playing, setPlaying] = useState<string | null>(null)

  return (
    <>
      <Seo title={t('videos.title')} />
      <section className="section bg-ivory">
        <div className="container-x">
          <SectionHeading label={t('videos.label')} title={t('videos.title')} />

          {!loading && (!videos || videos.length === 0) && <p className="mt-12 text-center text-ink/60">{t('videos.empty')}</p>}

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(videos || []).map((v) => {
              const id = youtubeId(v.youtube_url)
              if (!id) return null
              const isPlaying = playing === v.id
              return (
                <div key={v.id} className="paper overflow-hidden rounded-md">
                  <div className="relative aspect-video bg-maroon-900">
                    {isPlaying ? (
                      <iframe
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                        title={tr(v, 'title', lang)}
                        allow="accelerated-video-playback; encrypted-media; autoplay"
                        allowFullScreen
                      />
                    ) : (
                      <button onClick={() => setPlaying(v.id)} className="group relative block h-full w-full" aria-label={tr(v, 'title', lang)}>
                        <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover opacity-90" loading="lazy" />
                        <span className="absolute inset-0 flex items-center justify-center bg-maroon-900/25 transition-colors group-hover:bg-maroon-900/40">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-saffron text-maroon-900 shadow-soft">
                            <Play size={22} fill="currentColor" />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-maroon">{tr(v, 'title', lang)}</h3>
                    {tr(v, 'description', lang) && <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{tr(v, 'description', lang)}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
