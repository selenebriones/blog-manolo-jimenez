import type { Metadata } from 'next'

import type { SiteSettingsData } from './getSiteSettings'

/**
 * Open Graph (vista previa al compartir) con los datos del sitio como base.
 * Los valores de la página o noticia (`og`) reemplazan a los del sitio.
 */
export const mergeOpenGraph = (
  site: SiteSettingsData,
  og?: Metadata['openGraph'],
): Metadata['openGraph'] => {
  const siteImages = site.shareImageUrl ? [{ url: site.shareImageUrl }] : undefined

  return {
    type: 'website',
    siteName: site.siteName,
    title: site.defaultTitle,
    description: site.description,
    ...og,
    images: og?.images ?? siteImages,
  }
}
