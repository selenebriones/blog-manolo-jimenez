import React from 'react'

import type { TimelineBlock as Props } from '@/payload-types'

import { cn } from '@/utilities/ui'

/**
 * Línea de tiempo.
 *
 * - Escritorio: los años arriba, una línea horizontal con un punto por etapa y la
 *   descripción debajo, en columnas iguales.
 * - Celular y tablet: línea vertical a la izquierda; cada etapa con su punto, el año y
 *   la descripción a la derecha.
 */
export const TimelineBlock: React.FC<Props> = ({ title, items }) => {
  const stages = items ?? []
  if (!stages.length) return null

  return (
    <section className="overflow-hidden bg-surface py-16 md:py-24">
      <div className="container">
        {title && (
          <h2 className="mb-12 font-display text-3xl font-bold leading-tight text-ink md:mb-16 md:text-4xl">
            {title}
          </h2>
        )}

        <ol
          className="relative grid gap-10 lg:gap-8 lg:[grid-template-columns:repeat(var(--stages),minmax(0,1fr))]"
          style={{ '--stages': stages.length } as React.CSSProperties}
        >
          {/* Línea: vertical en celular, horizontal (a la altura de los puntos) en escritorio.
              En escritorio sale de los bordes de la pantalla, como en la referencia. */}
          <span
            aria-hidden
            className="absolute bottom-2 left-3 top-2 w-1 rounded-full bg-alert lg:bottom-auto lg:left-[calc(50%-50vw)] lg:right-[calc(50%-50vw)] lg:top-[4.875rem] lg:h-1 lg:w-auto"
          />

          {stages.map((stage, index) => {
            const paragraphs = stage.description
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)

            return (
              <li className="relative pl-12 lg:pl-0" key={stage.id ?? index}>
                <p className="font-display text-2xl font-light text-ink-muted lg:h-12 lg:text-4xl">
                  {stage.year}
                </p>

                {/* Punto sobre la línea */}
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-0 top-0.5 size-7 rounded-full border-[6px] border-alert bg-white',
                    'lg:static lg:mt-3 lg:block lg:size-10 lg:border-[7px]',
                  )}
                />

                <div className="mt-3 space-y-4 lg:mt-8 lg:pr-4">
                  {paragraphs.map((paragraph, i) => (
                    <p className="leading-relaxed text-ink-muted" key={i}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
