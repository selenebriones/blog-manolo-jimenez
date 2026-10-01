import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React, { Suspense } from 'react'

import { postCardSelect } from '@/components/PostCard/select'
import { PostGrid } from '@/components/PostGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { Search } from '@/search/Component'
import PageClient from './page.client'

const LIMIT = 24

type Args = {
  searchParams: Promise<{
    q?: string
  }>
}

/**
 * Búsqueda de noticias. Los resultados usan la misma tarjeta que la portada (PostGrid).
 * Busca en titular, extracto y descripción SEO; sin término muestra las más recientes.
 */
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q } = await searchParamsPromise
  const query = q?.trim() ?? ''
  const payload = await getPayload({ config: configPromise })

  const where: Where | undefined = query
    ? {
        or: [
          { title: { like: query } },
          { excerpt: { like: query } },
          { 'meta.description': { like: query } },
        ],
      }
    : undefined

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: LIMIT,
    overrideAccess: false,
    select: postCardSelect,
    sort: '-publishedAt',
    where,
  })

  return (
    <section className="bg-surface py-16 md:py-24">
      <PageClient />
      <div className="container">
        <SectionHeading
          description="Encuentra noticias, anuncios y programas del Gobierno de Coahuila."
          eyebrow="Noticias"
          title="Buscar"
        />

        <div className="mb-10 max-w-3xl">
          <Suspense>
            <Search />
          </Suspense>
          <p aria-live="polite" className="mt-4 text-ink-muted">
            {query
              ? `${posts.totalDocs} ${posts.totalDocs === 1 ? 'resultado' : 'resultados'} para “${query}”${posts.totalDocs > LIMIT ? ` (se muestran los ${LIMIT} más recientes)` : ''}`
              : 'Noticias más recientes'}
          </p>
        </div>

        {posts.docs.length > 0 ? (
          <PostGrid posts={posts.docs} />
        ) : (
          <p className="rounded-lg bg-white p-10 text-center text-ink-muted shadow-card">
            No encontramos noticias con “{query}”. Prueba con otra palabra.
          </p>
        )}
      </div>
    </section>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Buscar',
  }
}
