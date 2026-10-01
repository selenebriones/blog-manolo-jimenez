import React from 'react'

import type { Media as MediaType, StoryMosaicBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

/** Proporción de cada casilla del mosaico: horizontal, vertical, vertical, horizontal. */
const tiles = [
  { aspect: 'aspect-[7/5]', sizes: '(min-width: 1024px) 30vw, 60vw' },
  { aspect: 'aspect-[5/7]', sizes: '(min-width: 1024px) 20vw, 40vw' },
  { aspect: 'aspect-[5/7]', sizes: '(min-width: 1024px) 20vw, 40vw' },
  { aspect: 'aspect-[7/5]', sizes: '(min-width: 1024px) 30vw, 60vw' },
]

const Tile: React.FC<{ image?: MediaType | number | null; index: number }> = ({ image, index }) => {
  if (!image || typeof image !== 'object') return null
  const tile = tiles[index]!

  return (
    <div className={cn('relative overflow-hidden bg-surface shadow-card', tile.aspect)}>
      <Media fill imgClassName="object-cover" resource={image} size={tile.sizes} />
    </div>
  )
}

/** Gráfico con texto (lema, firma): se muestra completo, a su proporción natural. */
const Graphic: React.FC<{ image?: MediaType | number | null; className?: string }> = ({
  image,
  className,
}) => {
  if (!image || typeof image !== 'object') return null

  return (
    <Media
      className={className}
      imgClassName="block h-auto w-full"
      resource={image}
      size="(min-width: 1024px) 30vw, 60vw"
    />
  )
}

/**
 * Historia con mosaico.
 *
 * - Izquierda: título, subtítulo opcional, una línea fina con un tramo verde (acento
 *   `leaf`) y el contenido en texto enriquecido.
 * - Derecha: mosaico de 4 fotos en dos filas desfasadas. Arriba, una horizontal y una
 *   vertical que sobresale hacia arriba; abajo, una vertical que baja más y una horizontal.
 * - Gráficos opcionales en los dos huecos que deja el desfase: uno arriba de la foto 1
 *   y otro debajo de la foto 4.
 * - En celular el mosaico va debajo del texto, con la misma composición.
 */
export const StoryMosaicBlock: React.FC<Props> = ({
  title,
  isPageTitle,
  subtitle,
  content,
  images,
  topGraphic,
  bottomGraphic,
}) => {
  const photos = (images ?? []).map(({ image }) => image)
  const Heading = isPageTitle ? 'h1' : 'h2'

  return (
    <section className="container">
      <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16 xl:gap-24">
        <div>
          {title && (
            <>
              <Heading className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
                {title}
              </Heading>
              {subtitle && (
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-ink-muted">
                  {subtitle}
                </p>
              )}

              {/* Línea decorativa: riel tenue + tramo verde */}
              <div aria-hidden className="relative mt-6 h-px w-full max-w-md bg-border">
                <span className="absolute -top-px left-0 h-[3px] w-16 rounded-full bg-leaf" />
              </div>
            </>
          )}

          <RichText
            className={cn(
              title && 'mt-8',
              'prose-p:text-lg prose-p:leading-relaxed prose-p:text-ink-muted prose-strong:text-ink',
            )}
            data={content}
            enableGutter={false}
          />
        </div>

        {/* Con 3 fotos y sin gráfico inferior quedaría un hueco: la horizontal va arriba a
            todo lo ancho y las dos verticales debajo, lado a lado */}
        {photos.length === 3 && !bottomGraphic && (
          <div className="grid gap-4 md:gap-6">
            <Graphic className="px-2" image={topGraphic} />
            <div className="relative aspect-[16/9] overflow-hidden bg-surface shadow-card">
              <Media
                fill
                imgClassName="object-cover"
                resource={photos[0] as MediaType}
                size="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {photos.slice(1).map((photo, i) =>
                photo && typeof photo === 'object' ? (
                  <div
                    className="relative aspect-[4/5] overflow-hidden bg-surface shadow-card"
                    key={i}
                  >
                    <Media
                      fill
                      imgClassName="object-cover"
                      resource={photo}
                      size="(min-width: 1024px) 25vw, 50vw"
                    />
                  </div>
                ) : null,
              )}
            </div>
          </div>
        )}

        {photos.length > 0 && !(photos.length === 3 && !bottomGraphic) && (
          <div className="grid gap-4 md:gap-6">
            <div className="grid grid-cols-[3fr_2fr] items-end gap-4 md:gap-6">
              <div className="flex flex-col gap-4 md:gap-6">
                <Graphic className="px-2" image={topGraphic} />
                <Tile image={photos[0]} index={0} />
              </div>
              <Tile image={photos[1]} index={1} />
            </div>
            <div className="grid grid-cols-[2fr_3fr] items-start gap-4 md:gap-6">
              <Tile image={photos[2]} index={2} />
              <div className="flex flex-col gap-4 md:gap-6">
                <Tile image={photos[3]} index={3} />
                <Graphic className="px-2" image={bottomGraphic} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
