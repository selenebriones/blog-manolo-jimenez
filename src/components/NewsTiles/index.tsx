import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { BreakingBadge } from '@/components/CategoryBadge'
import { Media } from '@/components/Media'
import { Ribbon } from '@/components/Ribbon'
import type { PostCardData } from '@/components/PostCard'
import { formatDate } from '@/utilities/formatDate'

type Props = {
  title: string
  posts: PostCardData[]
}

/**
 * Mosaico de noticias destacadas (inspirado en la sección "What's Happening" de CityGov).
 *
 * - Título dentro de una cinta negra montada entre el banner y los paneles.
 * - Tres paneles a todo lo ancho, sin separación, con la foto de fondo y un degradado oscuro
 *   para que el titular blanco siempre sea legible.
 * - Bajo el titular, una línea fina con un tramo amarillo (acento `sun`) que crece al pasar el cursor.
 * - Todo el panel es clicable (enlace "estirado" en el titular).
 */
export const NewsTiles: React.FC<Props> = ({ title, posts }) => {
  if (!posts.length) return null

  return (
    <section aria-labelledby="destacadas-titulo" className="relative bg-ink">
      {/* Cinta de título montada sobre el borde entre el banner y los paneles:
          el margen negativo la sube la mitad de su alto sobre el banner, y el resto
          queda encima del borde superior de los paneles */}
      <div className="container relative z-10 -mt-9 -mb-9 md:-mt-11 md:-mb-11">
        <Ribbon className="drop-shadow-xl">
          <h2
            className="font-display text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl"
            id="destacadas-titulo"
          >
            {title}
          </h2>
        </Ribbon>
      </div>

      <ul className="grid md:grid-cols-3">
        {posts.map((post, index) => (
          <li key={post.slug ?? index}>
            <Tile post={post} />
          </li>
        ))}
      </ul>
    </section>
  )
}

const Tile: React.FC<{ post: PostCardData }> = ({ post }) => {
  const { title, slug, heroImage, publishedAt, excerpt, breaking, meta } = post
  const image = heroImage || meta?.image
  const summary = excerpt || meta?.description

  return (
    <article className="group relative isolate flex aspect-[4/5] items-end overflow-hidden bg-ink sm:aspect-[16/10] md:aspect-auto md:h-[36rem] lg:h-[42rem]">
      {image && typeof image === 'object' && (
        <Media
          fill
          imgClassName="-z-20 object-cover transition-transform duration-700 group-hover:scale-105"
          resource={image}
          size="(min-width: 768px) 34vw, 100vw"
        />
      )}
      {/* Degradado: casi transparente arriba, denso abajo donde va el texto */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/5 transition-opacity duration-500 group-hover:opacity-95"
      />

      <div className="w-full p-8 text-white lg:p-12">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
          {breaking && <BreakingBadge />}
          {publishedAt && <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>}
        </div>

        <h3 className="font-display text-2xl font-bold leading-snug lg:text-3xl">
          <Link
            className="line-clamp-3 after:absolute after:inset-0 focus:outline-none"
            href={`/posts/${slug}`}
          >
            {title}
          </Link>
        </h3>

        {/* Línea decorativa: riel tenue + tramo amarillo que crece en hover */}
        <div aria-hidden className="relative my-6 h-px w-full max-w-sm bg-white/25">
          <span className="absolute -top-px left-0 h-[3px] w-16 rounded-full bg-sun transition-all duration-500 group-hover:w-32" />
        </div>

        {summary && (
          <p className="line-clamp-4 text-base leading-relaxed text-white/85 lg:text-lg">
            {summary}
          </p>
        )}

        {/* Visualmente es el enlace; el clic real lo toma el enlace "estirado" del titular,
            así cada panel tiene un solo enlace para lectores de pantalla */}
        <span
          aria-hidden
          className="mt-6 inline-flex items-center gap-2 font-semibold text-white underline decoration-sun decoration-2 underline-offset-8 transition-colors group-hover:text-sun"
        >
          Leer más
          <ArrowRight className="size-5 text-sun transition-transform group-hover:translate-x-1" />
        </span>
      </div>

      {/* Anillo de foco visible al navegar con teclado */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 ring-4 ring-inset ring-sun opacity-0 group-focus-within:opacity-100"
      />
    </article>
  )
}
