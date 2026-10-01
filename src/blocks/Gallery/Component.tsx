import React from 'react'

import type { GalleryBlock as Props, Media as MediaType } from '@/payload-types'

import { GalleryGrid, type GalleryItem } from './GalleryGrid'

/**
 * Galería: encabezado opcional (mismo estilo que las demás secciones interiores)
 * y el mosaico de fotos con vista ampliada.
 */
export const GalleryBlock: React.FC<Props> = ({ title, intro, images }) => {
  const items: GalleryItem[] = (images ?? [])
    .filter(
      (row): row is typeof row & { image: MediaType } =>
        typeof row.image === 'object' && row.image !== null,
    )
    .map((row) => ({
      id: row.id ?? String(row.image.id),
      image: row.image,
      caption: row.caption ?? null,
    }))

  if (!items.length) return null

  return (
    <section className="container">
      {(title || intro) && (
        <header className="mb-12 max-w-3xl">
          {title && (
            <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
              {title}
            </h2>
          )}
          <div aria-hidden className="relative mt-6 h-px w-full max-w-md bg-border">
            <span className="absolute -top-px left-0 h-[3px] w-16 rounded-full bg-leaf" />
          </div>
          {intro && <p className="mt-6 text-lg leading-relaxed text-ink-muted">{intro}</p>}
        </header>
      )}

      <GalleryGrid items={items} />
    </section>
  )
}
