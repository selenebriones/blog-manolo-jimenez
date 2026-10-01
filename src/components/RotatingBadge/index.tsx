import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

/** Velocidades del giro que ofrece el admin (segundos por vuelta). */
export const ringSpeeds = { slow: 30, normal: 20, fast: 12 } as const
export type RingSpeed = keyof typeof ringSpeeds

type Props = {
  text: string
  image: MediaType
  backgroundImage?: MediaType | null
  speed?: RingSpeed | null
  title: string
  subtitle?: string | null
  content?: string | null
  buttonLabel?: string | null
  buttonUrl?: string | null
}

// Geometría del SVG (unidades del viewBox 500 × 500)
const CENTER = 250
const RADIUS = 212
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** Caracteres que caben cómodamente en la circunferencia con el tamaño de letra usado. */
const CHARS_PER_TURN = 36

/**
 * Repite la frase (con "•" como separador) las veces necesarias para dar una vuelta
 * completa al círculo sin que se amontone ni queden huecos.
 */
const buildRingText = (text: string) => {
  const phrase = `${text.trim().toUpperCase()} • `
  const repeats = Math.max(1, Math.round(CHARS_PER_TURN / phrase.length))
  return phrase.repeat(repeats)
}

/**
 * Sección "A pasos de gigante" (inspirada en el widget de texto circular de CityGov Downtown).
 *
 * - Dos columnas en escritorio: a la izquierda, título, subtítulo, texto y botón; a la derecha,
 *   la foto de fondo en blanco y negro (o azul tenue); el círculo (foto + frase girando) se
 *   centra sobre la línea que divide ambas columnas.
 * - En celular y tablet se apilan: círculo arriba del título, texto y al final la foto.
 * - Alrededor, la frase escrita sobre un trazo circular (SVG `textPath`) que gira
 *   sin fin: una vuelta cada 20 s por defecto, lineal y en sentido horario, como en la demo.
 * - `textLength` reparte las letras exactamente en la circunferencia, así el texto cierra
 *   el círculo sin importar la frase que se capture en el admin.
 * - Si el sistema pide "reducir movimiento", el anillo se queda quieto.
 */
export const RotatingBadge: React.FC<Props> = ({
  text,
  image,
  backgroundImage,
  speed,
  title,
  subtitle,
  content,
  buttonLabel,
  buttonUrl,
}) => {
  const duration = ringSpeeds[speed ?? 'normal'] ?? ringSpeeds.normal
  const pathId = 'anillo-texto'

  const paragraphs = (content ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <section
      aria-labelledby="anillo-titulo"
      className="relative isolate overflow-hidden bg-surface"
    >
      <div className="relative grid lg:grid-cols-2">
        {/* Columna izquierda: círculo con la foto y la frase girando, arriba del título; luego el texto */}
        {/* En escritorio el círculo se monta sobre la división: el padding derecho (lg:pr-40)
            deja libre la mitad del círculo para que no tape el texto */}
        <div className="flex items-center px-4 py-16 md:px-12 md:py-24 lg:pr-40 xl:pl-20">
          <div className="w-full max-w-xl">
            {/* Círculo: en celular y tablet va arriba del título; en escritorio se centra sobre la
                línea que divide texto y foto (se posiciona respecto a la cuadrícula) */}
            <div className="relative z-10 mb-8 aspect-square w-full max-w-[10.3rem] sm:max-w-[13.2rem] lg:absolute lg:left-1/2 lg:top-1/2 lg:mb-0 lg:max-w-[16.1rem] lg:-translate-x-1/2 lg:-translate-y-1/2">
              {/* Anillo de texto giratorio (decorativo: el título de la sección es el texto accesible) */}
              <svg
                aria-hidden
                className="absolute inset-0 size-full animate-rotate-ring motion-reduce:animate-none"
                style={{ '--ring-duration': `${duration}s` } as React.CSSProperties}
                viewBox="0 0 500 500"
              >
                <defs>
                  {/* Círculo que arranca a la izquierda y avanza en sentido horario */}
                  <path
                    d={`M ${CENTER - RADIUS},${CENTER} a ${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a ${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`}
                    id={pathId}
                  />
                </defs>
                <text
                  className="fill-ink font-display font-semibold"
                  fontSize="40"
                  letterSpacing="2"
                >
                  <textPath href={`#${pathId}`} lengthAdjust="spacing" textLength={CIRCUMFERENCE}>
                    {buildRingText(text)}
                  </textPath>
                </text>
              </svg>

              {/* Foto circular */}
              <div className="absolute inset-[17%] overflow-hidden rounded-full bg-surface shadow-card-hover ring-4 ring-white/60 lg:ring-8">
                <Media
                  fill
                  imgClassName="object-cover"
                  resource={image}
                  size="(min-width: 1024px) 180px, (min-width: 640px) 150px, 120px"
                />
              </div>
            </div>

            <h2
              className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl lg:text-5xl"
              id="anillo-titulo"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 font-display text-lg font-semibold text-brand md:text-xl">
                {subtitle}
              </p>
            )}
            <span aria-hidden className="mt-6 block h-1 w-14 rounded-full bg-sun" />

            {paragraphs.map((paragraph, index) => (
              <p className="mt-6 text-lg leading-relaxed text-ink-muted" key={index}>
                {paragraph}
              </p>
            ))}

            {buttonLabel && buttonUrl && (
              <Link
                className="group mt-8 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark"
                href={buttonUrl}
              >
                {buttonLabel}
                <ArrowRight
                  aria-hidden
                  className="size-5 transition-transform group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>
        </div>

        {/* Columna derecha: foto de fondo en blanco y negro (o azul tenue si no hay foto) */}
        <div aria-hidden className="relative min-h-[18rem] bg-brand-light md:min-h-[24rem]">
          {backgroundImage && (
            <>
              <Media
                fill
                imgClassName="object-cover grayscale"
                resource={backgroundImage}
                size="(min-width: 1024px) 50vw, 100vw"
              />
              {/* Velo claro: en escritorio el anillo de letras pisa la foto y así se lee */}
              <div className="absolute inset-0 hidden bg-white/45 lg:block" />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
