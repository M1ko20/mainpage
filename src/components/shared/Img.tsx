import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { DEFAULT_WIDTHS, photoSrcSet, photoUrl } from '../../lib/unsplash'

interface ImgProps {
  /** Unsplash photo id — builds a responsive srcset automatically. */
  photo?: string
  /** Plain source (e.g. a local screenshot). Used when `photo` is not given. */
  src?: string
  srcSet?: string
  alt: string
  sizes?: string
  /** Width / height of the frame, e.g. 4 / 5. Reserves space to avoid layout shift. */
  aspect?: number
  widths?: readonly number[]
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
  imgStyle?: CSSProperties
  /** Background shown while loading and if the image fails. */
  fallback?: string
}

/**
 * Responsive, lazy image in a fixed frame. The frame owns the dimensions, so a
 * slow or failed remote image never moves the layout — it degrades to a
 * tonal surface that fits the page's palette. Priority (above-the-fold) images
 * skip the fade so they paint as soon as they arrive.
 */
export function Img({
  photo,
  src,
  srcSet,
  alt,
  sizes = '100vw',
  aspect,
  widths = DEFAULT_WIDTHS,
  priority = false,
  className = '',
  imgClassName = '',
  style,
  imgStyle,
  fallback = 'linear-gradient(135deg, rgba(128,128,128,.18), rgba(128,128,128,.06))',
}: ImgProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const ref = useRef<HTMLImageElement>(null)
  const ratio = aspect ? 1 / aspect : undefined
  const resolvedSrc = photo ? photoUrl(photo, 1200, { ratio }) : src
  const resolvedSrcSet = photo ? photoSrcSet(photo, widths, { ratio }) : srcSet

  useEffect(() => {
    const img = ref.current
    if (img?.complete) setState(img.naturalWidth > 0 ? 'loaded' : 'error')
  }, [resolvedSrc])

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: aspect, background: fallback, ...style }}
    >
      {state !== 'error' && resolvedSrc && (
        <img
          ref={ref}
          src={resolvedSrc}
          srcSet={resolvedSrcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`absolute inset-0 h-full w-full object-cover ${priority ? '' : `transition-opacity duration-700 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`} ${imgClassName}`}
          style={imgStyle}
        />
      )}
      {state === 'error' && <span className="sr-only">{alt}</span>}
    </div>
  )
}
