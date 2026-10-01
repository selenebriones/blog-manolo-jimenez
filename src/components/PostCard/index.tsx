import { ArrowRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Category, Post } from '@/payload-types'

import { BreakingBadge, CategoryBadge } from '@/components/CategoryBadge'
import { Media } from '@/components/Media'
import { formatDate } from '@/utilities/formatDate'
import { cn } from '@/utilities/ui'

/** Campos mínimos que necesita la tarjeta (coinciden con `defaultPopulate` de Posts). */
export type PostCardData = Pick<
  Post,
  'title' | 'slug' | 'heroImage' | 'categories' | 'publishedAt' | 'excerpt' | 'breaking' | 'meta'
>

type Props = {
  post: PostCardData
  /** Muestra el extracto bajo el título (útil en listados, opcional en grids densos). */
  showExcerpt?: boolean
  /** Carga la imagen con prioridad (solo para tarjetas visibles al cargar la página). */
  priority?: boolean
  className?: string
}

/**
 * Tarjeta de noticia.
 *
 * Diseño: tarjeta blanca con sombra suave sobre fondo `surface`, imagen 16:10 con zoom
 * sutil al pasar el cursor, y metadatos (categoría + fecha) sobre el titular.
 *
 * Accesibilidad: toda la tarjeta es clicable mediante un enlace "estirado" en el titular
 * (`after:absolute after:inset-0`), así solo hay un enlace por tarjeta para lectores de pantalla.
 */
export const PostCard: React.FC<Props> = ({
  post,
  showExcerpt = false,
  priority = false,
  className,
}) => {
  const { title, slug, heroImage, categories, publishedAt, excerpt, breaking, meta } = post

  const href = `/posts/${slug}`
  // Se muestra solo la primera categoría para mantener la tarjeta limpia
  const category = categories?.find((c): c is Category => typeof c === 'object' && c !== null)
  const image = heroImage || meta?.image
  const summary = excerpt || meta?.description

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-card',
        'transition duration-300 hover:-translate-y-1 hover:shadow-card-hover',
        'focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2',
        className,
      )}
    >
      {/* Imagen */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {image && typeof image === 'object' ? (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            resource={image}
            size="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          // Sin imagen: bloque neutro con el color primario muy tenue
          <div aria-hidden className="flex h-full items-center justify-center bg-brand-light">
            <span className="font-display text-4xl font-bold text-brand/30">MJ</span>
          </div>
        )}

        {breaking && <BreakingBadge className="absolute left-4 top-4" />}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          {category && <CategoryBadge category={category} />}
          {publishedAt && (
            <time
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted"
              dateTime={publishedAt}
            >
              <CalendarDays aria-hidden className="size-4 text-sun" />
              {formatDate(publishedAt)}
            </time>
          )}
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
          <Link className="line-clamp-3 after:absolute after:inset-0 focus:outline-none" href={href}>
            {title}
          </Link>
        </h3>

        {showExcerpt && summary && (
          <p className="mt-3 line-clamp-2 text-[0.95rem] leading-relaxed text-ink-muted">
            {summary}
          </p>
        )}

        {/* Decorativo: el enlace real es el titular */}
        <span
          aria-hidden
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand"
        >
          Leer más
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  )
}
