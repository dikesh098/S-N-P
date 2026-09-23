interface Props { src?: string | null; alt: string; className?: string; sizes?: string }

/** A photo with graceful fallback + lazy loading, used everywhere real images may be missing. */
export default function SmartImage({ src, alt, className = '', sizes }: Props) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-cream text-maroon/30 ${className}`}>
        <span className="text-4xl">🌸</span>
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" sizes={sizes} className={className} />
}
