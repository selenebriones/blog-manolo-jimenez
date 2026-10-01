import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'

type Props = Page['hero'] & { title?: string | null }

/**
 * Encabezado "Imagen con título de la página" (inspirado en los interiores de CityGov).
 *
 * - Foto a todo lo ancho, pegada al header, con velo oscuro para que el texto blanco
 *   siempre se lea.
 * - Migas de pan (Inicio → página) y el título de la página como único <h1>.
 * - El título sale del campo "Título de la página", así no se captura dos veces.
 */
export const PageTitleHero: React.FC<Props> = ({ media, title }) => (
  <section className="relative isolate flex min-h-[18rem] items-end overflow-hidden bg-ink md:h-[500px]">
    {media && typeof media === 'object' && (
      <Media fill imgClassName="-z-20 object-cover" priority resource={media} size="100vw" />
    )}
    {/* Velo: parejo sobre toda la foto y más denso abajo, donde va el título */}
    <div aria-hidden className="absolute inset-0 -z-10 bg-ink/55" />
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
    />

    <div className="container pb-12 pt-24 text-white md:pb-16">
      <nav aria-label="Migas de pan">
        <ol className="flex flex-wrap items-center gap-3 text-sm font-medium uppercase tracking-wide">
          <li>
            <Link className="transition-colors hover:text-sun" href="/">
              Inicio
            </Link>
          </li>
          <li aria-hidden>
            <ArrowRight className="size-4 text-sun" />
          </li>
          <li aria-current="page" className="text-white/85">
            {title}
          </li>
        </ol>
      </nav>
      <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
    </div>
  </section>
)
