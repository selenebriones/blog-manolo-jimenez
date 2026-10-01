import type { Metadata } from 'next/types'

import { NewsArchive } from '@/components/NewsArchive'
import { postCardSelect } from '@/components/PostCard/select'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

const LIMIT = 12

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: LIMIT,
    overrideAccess: false,
    sort: '-publishedAt',
    select: postCardSelect,
  })

  return (
    <>
      <PageClient />
      <NewsArchive limit={LIMIT} posts={posts} />
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Noticias',
    description: 'Noticias y el día a día del Gobernador de Coahuila, Manolo Jiménez.',
  }
}
