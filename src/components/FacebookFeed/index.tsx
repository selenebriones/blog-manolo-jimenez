import { ArrowUpRight, Facebook } from 'lucide-react'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import type { FacebookPost } from '@/utilities/facebook'
import { formatDate } from '@/utilities/formatDate'
import { FacebookPagePlugin } from './PagePlugin'

type Props = {
  /**
   * `widget`: recuadro oficial de Facebook (no requiere token).
   * `cards`: tarjetas con el diseño del sitio (requiere la conexión con la API de Meta).
   */
  mode: 'widget' | 'cards'
  posts: FacebookPost[]
  title: string
  description?: string | null
  buttonLabel?: string | null
  pageUrl: string
  pageName: string
  /** Vista previa con datos de ejemplo (solo en desarrollo, mientras no hay token). */
  isPreview?: boolean
}

/**
 * "Síguenos en Facebook": en modo `widget`, texto y botón del sitio a la izquierda y el
 * recuadro oficial de Facebook a la derecha; en modo `cards`, las últimas publicaciones como
 * tarjetas del sitio (cada una enlaza a la publicación original).
 */
export const FacebookFeed: React.FC<Props> = ({
  mode,
  posts,
  title,
  description,
  buttonLabel,
  pageUrl,
  pageName,
  isPreview,
}) => {
  const followButton = buttonLabel && (
    <a
      className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
      href={pageUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Facebook aria-hidden className="size-5" />
      {buttonLabel}
    </a>
  )

  if (mode === 'widget') {
    return (
      <section aria-labelledby="facebook-titulo" className="bg-white py-16 md:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <SectionHeading
              className="mb-8 md:mb-8"
              description={description ?? undefined}
              eyebrow="Redes sociales"
              id="facebook-titulo"
              title={title}
            />
            {followButton}
          </div>
          <div className="flex justify-center rounded-lg bg-white p-2 shadow-card ring-1 ring-border lg:justify-end">
            <FacebookPagePlugin pageName={pageName} pageUrl={pageUrl} />
          </div>
        </div>
      </section>
    )
  }

  if (!posts.length) return null

  return (
    <section aria-labelledby="facebook-titulo" className="bg-white pt-16 md:pt-24">
      <div className="container">
        {isPreview && (
          <p className="mb-6 inline-flex rounded-full bg-sun-light px-3 py-1 text-sm font-semibold text-sun-dark">
            Vista previa con datos de ejemplo · se reemplaza con las publicaciones reales al
            conectar Facebook
          </p>
        )}

        <SectionHeading
          action={
            buttonLabel && (
              <a
                className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
                href={pageUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Facebook aria-hidden className="size-5" />
                {buttonLabel}
              </a>
            )
          }
          description={description ?? undefined}
          eyebrow="Redes sociales"
          id="facebook-titulo"
          title={title}
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <li key={post.id}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-border transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                {/* Encabezado estilo publicación: icono, nombre de la página y fecha */}
                <header className="flex items-center gap-3 p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Facebook aria-hidden className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{pageName}</p>
                    <time className="text-sm text-ink-muted" dateTime={post.createdAt}>
                      {formatDate(post.createdAt)}
                    </time>
                  </div>
                </header>

                {post.image && (
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    {/* Imagen alojada por Facebook (CDN externo): <img> simple, sin optimizar */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      src={post.image}
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  {post.message && (
                    <p className="line-clamp-4 whitespace-pre-line leading-relaxed text-ink">
                      {post.message}
                    </p>
                  )}
                  <a
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand after:absolute after:inset-0 focus:outline-none"
                    href={post.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Ver en Facebook
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
