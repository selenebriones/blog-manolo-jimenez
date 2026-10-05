import type { Media } from '@/payload-types'

import { siteSettingsDefaults } from '@/SiteSettings/defaults'
import { getCachedGlobal } from './getGlobals'
import { getServerSideURL } from './getURL'

export type SiteSettingsData = {
  siteName: string
  defaultTitle: string
  description: string
  /** URL absoluta de la imagen para compartir (o null si no se ha cargado). */
  shareImageUrl: string | null
}

/** URL absoluta de una imagen de Medios (las redes la recortan a 1200 × 630 al compartir). */
export const getShareImageUrl = (image?: Media | number | null): string | null => {
  if (!image || typeof image !== 'object' || !image.url) return null
  const url = image.url
  return url.startsWith('http') ? url : `${getServerSideURL()}${url}`
}

/** SEO y datos del sitio (global `site-settings`) con los valores por defecto aplicados. */
export const getSiteSettings = async (): Promise<SiteSettingsData> => {
  const settings = await getCachedGlobal('site-settings', 1)()
  return {
    siteName: settings?.siteName || siteSettingsDefaults.siteName,
    defaultTitle: settings?.defaultTitle || siteSettingsDefaults.defaultTitle,
    description: settings?.description || siteSettingsDefaults.description,
    shareImageUrl: getShareImageUrl(settings?.shareImage),
  }
}
