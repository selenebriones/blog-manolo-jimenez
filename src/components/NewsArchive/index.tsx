import type { PaginatedDocs } from 'payload'
import React from 'react'

import type { PostCardData } from '@/components/PostCard'
import { Pagination } from '@/components/Pagination'
import { PostGrid } from '@/components/PostGrid'
import { SectionHeading } from '@/components/SectionHeading'

/** Listado de noticias (/posts y /posts/page/N): encabezado, rango, cuadrícula y paginación. */
export const NewsArchive: React.FC<{ posts: PaginatedDocs<PostCardData>; limit: number }> = ({
  posts,
  limit,
}) => {
  const page = posts.page ?? 1
  const from = posts.totalDocs === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, posts.totalDocs)

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container">
        <SectionHeading
          description="El trabajo de cada día en los 38 municipios de Coahuila."
          eyebrow="Día a día"
          title="Noticias"
          action={
            posts.totalDocs > 0 && (
              <p className="text-sm text-ink-muted">
                Mostrando {from}–{to} de {posts.totalDocs} noticias
              </p>
            )
          }
        />

        {posts.docs.length > 0 ? (
          <PostGrid posts={posts.docs} showExcerpt />
        ) : (
          <p className="rounded-lg bg-white p-10 text-center text-ink-muted shadow-card">
            Aún no hay noticias publicadas.
          </p>
        )}

        {posts.totalPages > 1 && (
          <Pagination className="mt-12" page={page} totalPages={posts.totalPages} />
        )}
      </div>
    </section>
  )
}
