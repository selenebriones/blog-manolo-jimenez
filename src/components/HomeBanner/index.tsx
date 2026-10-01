import Link from 'next/link'
import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

type WelcomeContent = { eyebrow?: string | null; title?: string | null; text?: string | null }

type Props = {
  image?: MediaType | number | null
  mobileImage?: MediaType | number | null
  url?: string | null
  newTab?: boolean | null
  /** Hero de respaldo si todavía no se ha cargado un banner en el admin. */
  welcome: WelcomeContent
}

const asMedia = (value: Props['image']) => (value && typeof value === 'object' ? value : null)

/**
 * Banner de portada: imagen a todo lo ancho cargada en
 * Configuración del sitio → Página de inicio → Banner.
 *
 * - Se muestra a su proporción natural (sin recortes), porque suele traer texto integrado.
 * - Admite una versión para celular (art direction) para que ese texto se lea en pantallas chicas.
 * - Si tiene enlace, todo el banner es clicable.
 * - Incluye un <h1> solo para lectores de pantalla y buscadores, porque el texto visible es imagen.
 */
export const HomeBanner: React.FC<Props> = ({ image, mobileImage, url, newTab, welcome }) => {
  const desktop = asMedia(image)
  const mobile = asMedia(mobileImage)

  if (!desktop) return <WelcomeHero {...welcome} />

  const content = (
    <>
      <Media
        className={mobile ? 'hidden md:block' : undefined}
        imgClassName="block h-auto w-full"
        priority
        resource={desktop}
        size="100vw"
      />
      {mobile && (
        <Media
          className="md:hidden"
          imgClassName="block h-auto w-full"
          priority
          resource={mobile}
          size="100vw"
        />
      )}
    </>
  )

  return (
    <section aria-label="Banner principal" className="bg-ink">
      <h1 className="sr-only">Manolo Jiménez, Gobernador de Coahuila</h1>
      {url ? (
        <Link
          className="block focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-sun"
          href={url}
          {...(newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </section>
  )
}

/** Hero de respaldo mientras no haya banner cargado. */
const WelcomeHero: React.FC<WelcomeContent> = ({ eyebrow, title, text }) => (
  <section className="relative overflow-hidden bg-brand py-24 text-white md:py-32">
    {/* Círculos decorativos muy sutiles */}
    <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-white/5" />
    <div aria-hidden className="absolute -bottom-32 right-40 size-72 rounded-full bg-white/5" />

    <div className="container relative">
      {eyebrow && (
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-sun">{eyebrow}</p>
      )}
      <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
        {title}
      </h1>
      {text && <p className="mt-6 max-w-xl text-lg text-white/85">{text}</p>}
    </div>
  </section>
)
