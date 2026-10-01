'use client'

import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

export type GalleryItem = { id: string; image: MediaType; caption: string | null }

/**
 * Mosaico (columnas CSS: cada foto conserva su proporción) + visor ampliado.
 *
 * El visor usa <dialog> nativo: atrapa el foco, se cierra con Escape y devuelve el foco
 * a la foto que lo abrió. Flechas ← → del teclado para navegar; también botones en pantalla.
 */
export const GalleryGrid: React.FC<{
  items: GalleryItem[]
  /**
   * `masonry` (Galería): columnas, cada foto en su proporción.
   * `grid` (fotos dentro de una noticia): filas de 3 (2 en celular), todas recortadas a 4:3;
   * la foto completa se ve en el visor.
   */
  layout?: 'masonry' | 'grid'
}> = ({ items, layout = 'masonry' }) => {
  const isGrid = layout === 'grid'
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState<number | null>(null)

  const open = (i: number) => {
    setIndex(i)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()
  const go = useCallback(
    (step: number) => setIndex((i) => (i === null ? i : (i + step + items.length) % items.length)),
    [items.length],
  )

  // Navegación con teclado mientras el visor está abierto
  useEffect(() => {
    if (index === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go])

  const current = index !== null ? items[index] : null

  return (
    <>
      <ul
        className={
          isGrid
            ? 'not-prose grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4'
            : 'columns-1 gap-6 sm:columns-2 lg:columns-3'
        }
      >
        {items.map((item, i) => {
          const label = item.caption || item.image.alt || `Foto ${i + 1}`
          return (
            <li className={isGrid ? undefined : 'mb-6 break-inside-avoid'} key={item.id}>
              <button
                aria-label={`Ver en grande: ${label}`}
                className={`group relative block w-full overflow-hidden rounded-lg bg-surface shadow-card focus:outline-none focus-visible:ring-4 focus-visible:ring-sun ${isGrid ? 'aspect-[4/3]' : ''}`}
                onClick={() => open(i)}
                type="button"
              >
                {isGrid ? (
                  <Media
                    fill
                    imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                    resource={item.image}
                    size="(min-width: 768px) 340px, 50vw"
                  />
                ) : (
                  <Media
                    imgClassName="block h-auto w-full transition-transform duration-500 group-hover:scale-105"
                    resource={item.image}
                    size="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                )}
                {/* Capa al pasar el cursor: icono de ampliar y pie de foto */}
                <span
                  aria-hidden
                  className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-ink/80 via-ink/10 to-transparent p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <Expand className="ml-auto size-8 rounded-full bg-white/90 p-1.5 text-ink" />
                  {item.caption && (
                    <span className="line-clamp-2 font-medium text-white">{item.caption}</span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <dialog
        aria-label="Galería de fotos"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80"
        onClose={() => setIndex(null)}
        // Clic en el fondo (fuera de la foto y los controles) cierra el visor
        onClick={(event) => event.target === event.currentTarget && close()}
        ref={dialogRef}
      >
        {current && (
          <div
            className="flex h-full flex-col"
            onClick={(event) => event.target === event.currentTarget && close()}
          >
            <div className="flex items-center justify-between px-4 py-3 md:px-8">
              <p aria-live="polite" className="text-sm font-medium text-white/80">
                {index! + 1} / {items.length}
              </p>
              <button
                aria-label="Cerrar"
                className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                onClick={close}
                type="button"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="relative flex-1">
              <Media
                fill
                imgClassName="object-contain"
                key={current.id}
                priority
                resource={current.image}
                size="100vw"
              />
              <button
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 transition-colors hover:bg-brand md:left-6"
                onClick={() => go(-1)}
                type="button"
              >
                <ChevronLeft className="size-7" />
              </button>
              <button
                aria-label="Foto siguiente"
                className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 transition-colors hover:bg-brand md:right-6"
                onClick={() => go(1)}
                type="button"
              >
                <ChevronRight className="size-7" />
              </button>
            </div>

            <p className="min-h-16 px-4 py-4 text-center text-white/90 md:px-8">
              {current.caption || current.image.alt}
            </p>
          </div>
        )}
      </dialog>
    </>
  )
}
