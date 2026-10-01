import type { Metadata } from 'next/types'

import { NewsArchive } from '@/components/NewsArchive'
import { postCardSelect } from '@/components/PostCard/select'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

const LIMIT = 12

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: LIMIT,
    page: sanitizedPageNumber,
    overrideAccess: false,
    sort: '-publishedAt',
    select: postCardSelect,
  })

  if (sanitizedPageNumber > 1 && posts.docs.length === 0) notFound()

  return (
    <>
      <PageClient />
      <NewsArchive limit={LIMIT} posts={posts} />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Noticias — página ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  // Debe coincidir con LIMIT (la plantilla original dividía entre 10 y dejaba páginas fuera)
  const totalPages = Math.ceil(totalDocs / LIMIT)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
