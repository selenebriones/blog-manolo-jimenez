import React from 'react'

import type { Media as MediaType, ProfileIntroBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

/** Casilla del mosaico: en celular con proporción fija; en escritorio llena el alto disponible. */
const Tile: React.FC<{ image: MediaType; className?: string; sizes: string }> = ({
  image,
  className,
  sizes,
}) => (
  <div className={cn('relative overflow-hidden bg-surface shadow-card lg:aspect-auto', className)}>
    <Media fill imgClassName="object-cover" resource={image} size={sizes} />
  </div>
)

/**
 * Presentación con foto.
 *
 * - Izquierda: retrato vertical con marco blanco y sombra suave y, opcional, un mosaico de
 *   hasta 3 fotos debajo (con 1 o 3, la primera a todo lo ancho; las demás lado a lado).
 * - En escritorio la columna izquierda se estira al alto del texto y el mosaico ocupa lo que
 *   queda (3 partes el retrato, 2 el mosaico), así ambas columnas terminan a la misma altura (las fotos se recortan con
 *   `object-cover` respetando su punto focal).
 * - Derecha: título, subtítulo y la rayita amarilla (mismo estilo que la sección
 *   "Soy Manolo" del inicio), el contenido y, opcional, un gráfico centrado debajo.
 * - En celular todo se apila: retrato, texto y al final el mosaico.
 */
export const ProfileIntroBlock: React.FC<Props> = ({
  image,
  photos,
  title,
  subtitle,
  content,
  graphic,
}) => {
  const tiles = (photos ?? [])
    .map(({ image }) => image)
    .filter((photo): photo is MediaType => Boolean(photo) && typeof photo === 'object')
  // Con 1 o 3 fotos la primera va a todo lo ancho; las demás van de dos en dos, lado a lado
  const wide = tiles.length % 2 === 1 ? tiles[0] : undefined
  const pair = wide ? tiles.slice(1) : tiles

  return (
    <section className="container">
      <div
        className={cn(
          'grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16 xl:gap-24',
          tiles.length ? 'lg:items-stretch' : 'items-center',
        )}
      >
        {/* En celular este contenedor "desaparece" (contents) para poder mandar el mosaico
            después del texto; en escritorio es la columna izquierda */}
        <div className="contents lg:flex lg:flex-col lg:gap-6">
          {image && typeof image === 'object' && (
            <div className="mx-auto flex w-full max-w-md bg-white p-3 shadow-card lg:min-h-[24rem] lg:max-w-none lg:flex-[3]">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface lg:aspect-auto">
                <Media
                  fill
                  imgClassName="object-cover"
                  resource={image}
                  size="(min-width: 1024px) 40vw, 90vw"
                />
              </div>
            </div>
          )}

          {/* Mosaico: en escritorio comparte el alto con el retrato (mínimo 16rem) */}
          {tiles.length > 0 && (
            <div className="order-last mx-auto flex w-full max-w-md flex-col gap-4 md:gap-6 lg:order-none lg:min-h-[16rem] lg:max-w-none lg:flex-[2]">
              {wide && (
                <Tile
                  className="aspect-[16/9] lg:flex-1"
                  image={wide}
                  sizes="(min-width: 1024px) 40vw, 90vw"
                />
              )}
              {pair.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:gap-6 lg:flex-1">
                  {pair.map((photo, index) => (
                    <Tile
                      className="aspect-[4/5]"
                      image={photo}
                      key={index}
                      sizes="(min-width: 1024px) 20vw, 45vw"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={cn(tiles.length > 0 && 'lg:self-center')}>
          <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl lg:text-5xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-4 font-display text-lg font-semibold text-brand md:text-xl">
              {subtitle}
            </p>
          )}
          <span aria-hidden className="mt-6 block h-1 w-14 rounded-full bg-sun" />

          <RichText
            className="mt-8 prose-p:text-lg prose-p:leading-relaxed prose-p:text-ink-muted prose-strong:text-ink"
            data={content}
            enableGutter={false}
          />

          {/* Gráfico con texto (lema): a su proporción natural, centrado respecto al texto */}
          {graphic && typeof graphic === 'object' && (
            <Media
              className="mx-auto mt-10 block w-full max-w-sm"
              imgClassName="block h-auto w-full"
              resource={graphic}
              size="384px"
            />
          )}
        </div>
      </div>
    </section>
  )
}
