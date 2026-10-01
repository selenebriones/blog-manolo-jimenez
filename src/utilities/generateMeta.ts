import type { Metadata } from 'next'

import type { Page, Post } from '../payload-types'

import { getShareImageUrl, getSiteSettings } from './getSiteSettings'
import { mergeOpenGraph } from './mergeOpenGraph'

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Metadatos de una página o noticia: su pestaña "SEO" si la llenaron; si no, el titular,
 * y la descripción e imagen del sitio (Configuración del sitio → SEO y datos del sitio).
 */
export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args
  const site = await getSiteSettings()

  // El plugin SEO puede traer ya el sufijo " | Nombre del sitio": se quita para no duplicarlo
  const suffix = new RegExp(`\\s*\\|\\s*${escapeRegex(site.siteName)}$`)
  const base = (doc?.meta?.title || doc?.title || '').replace(suffix, '').trim()
  const title = base ? `${base} | ${site.siteName}` : site.defaultTitle
  const description = doc?.meta?.description || site.description
  const image = getShareImageUrl(doc?.meta?.image) ?? site.shareImageUrl

  return {
    description,
    openGraph: mergeOpenGraph(site, {
      description,
      images: image ? [{ url: image }] : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    // `absolute`: el título ya trae el sufijo; evita que la plantilla del layout lo repita
    title: { absolute: title },
  }
}
