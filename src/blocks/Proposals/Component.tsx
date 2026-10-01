import { ChevronRight } from 'lucide-react'
import React from 'react'

import type { ProposalsBlock as Props } from '@/payload-types'

import { Ribbon } from '@/components/Ribbon'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

/**
 * Colores de los puntos, en el orden de la agenda original: verde, rojo, amarillo, azul.
 * La viñeta usa el color pleno; el texto usa el tono oscuro para cumplir contraste sobre blanco.
 */
const pointStyles = [
  { icon: 'text-leaf', text: 'text-leaf-dark' },
  { icon: 'text-alert', text: 'text-alert-dark' },
  { icon: 'text-sun', text: 'text-sun-dark' },
  { icon: 'text-brand', text: 'text-brand' },
]

/**
 * Propuestas: encabezado opcional y una cuadrícula de tarjetas (2 columnas en escritorio).
 * La imagen destacada (opcional) va a la derecha del título y sube sobre el encabezado
 * con foto de la página; debajo deja su propio espacio para no tapar las tarjetas.
 * Cada tarjeta: título en una flecha de color (misma figura que la cinta de portada), frase introductoria en negritas y
 * lista de puntos con viñeta de color y frase destacada.
 */
export const ProposalsBlock: React.FC<Props> = ({ title, intro, featureImage, items }) => {
  if (!items?.length) return null

  return (
    <section className="container">
      {(title || intro || featureImage) && (
        // En celular la imagen va arriba (column-reverse); en escritorio, a la derecha del título
        <header className="mb-12 flex flex-col-reverse gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {title && (
              <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
                {title}
              </h2>
            )}
            <div aria-hidden className="relative mt-6 h-px w-full max-w-md bg-border">
              <span className="absolute -top-px left-0 h-[3px] w-16 rounded-full bg-leaf" />
            </div>
            {intro && <p className="mt-6 text-lg leading-relaxed text-ink-muted">{intro}</p>}
          </div>

          {featureImage && typeof featureImage === 'object' && (
            // Desde tablet, el margen negativo la sube sobre el encabezado con foto (`relative z-10`
            // la deja encima). En celular queda sobre el fondo blanco, sin encimarse.
            <Media
              className="relative z-10 mx-auto w-52 shrink-0 drop-shadow-2xl md:mx-0 md:-mt-64 md:w-64 lg:-mt-72 lg:w-80"
              imgClassName="block h-auto w-full"
              priority
              resource={featureImage}
              size="(min-width: 1024px) 320px, (min-width: 768px) 256px, 208px"
            />
          )}
        </header>
      )}

      <ul className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {items.map((item, index) => (
          <li key={item.id ?? index}>
            <article className="flex h-full flex-col rounded-lg bg-white p-6 shadow-card md:p-8">
              <Ribbon className="self-start" color={item.color ?? 'brand'} size="sm">
                <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-wide md:text-xl">
                  {item.title}
                </h3>
              </Ribbon>

              <p className="mt-5 text-lg font-semibold leading-snug text-ink">{item.summary}</p>

              {item.points && item.points.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {item.points.map((point, pointIndex) => {
                    const style = pointStyles[pointIndex % pointStyles.length]!
                    return (
                      <li
                        className="flex gap-2 leading-relaxed text-ink-muted"
                        key={point.id ?? pointIndex}
                      >
                        <ChevronRight
                          aria-hidden
                          className={cn('mt-1 size-5 shrink-0', style.icon)}
                          strokeWidth={3}
                        />
                        <span>
                          <strong className={cn('font-semibold', style.text)}>
                            {point.highlight}
                          </strong>
                          {point.text ? ` ${point.text}` : null}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
