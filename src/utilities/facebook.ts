// Solo para uso en el servidor (Server Components): lee el token de las variables de entorno.

export type FacebookPost = {
  id: string
  message: string
  image: string | null
  url: string
  createdAt: string
}

type GraphPost = {
  id: string
  message?: string
  full_picture?: string
  permalink_url?: string
  created_time: string
}

/** ¿Hay credenciales configuradas? (variables FACEBOOK_PAGE_ID y FACEBOOK_PAGE_TOKEN del .env) */
export const hasFacebookCredentials = () =>
  Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN)

/**
 * Últimas publicaciones de la página de Facebook vía Graph API.
 *
 * - El token se lee solo en el servidor (nunca llega al navegador ni al admin).
 * - La respuesta se guarda en caché 1 hora (`revalidate`), así el sitio no depende de que
 *   Facebook responda en cada visita.
 * - Si falla (token vencido, Facebook caído…), devuelve [] y la sección simplemente no se muestra.
 */
export const getFacebookPosts = async (limit = 3): Promise<FacebookPost[]> => {
  const pageId = process.env.FACEBOOK_PAGE_ID
  const token = process.env.FACEBOOK_PAGE_TOKEN
  if (!pageId || !token) return []

  const version = process.env.FACEBOOK_GRAPH_VERSION || 'v23.0'
  const params = new URLSearchParams({
    fields: 'message,full_picture,permalink_url,created_time',
    // Pedimos de más porque algunas publicaciones no traen texto ni foto (cambios de portada, etc.)
    limit: String(limit * 3),
    access_token: token,
  })

  try {
    const response = await fetch(
      `https://graph.facebook.com/${version}/${pageId}/posts?${params}`,
      {
        next: { revalidate: 3600, tags: ['facebook-posts'] },
      },
    )
    if (!response.ok) {
      console.error('[facebook] Error de la Graph API:', response.status, await response.text())
      return []
    }
    const { data } = (await response.json()) as { data: GraphPost[] }

    return data
      .filter((post) => post.message || post.full_picture)
      .slice(0, limit)
      .map((post) => ({
        id: post.id,
        message: post.message ?? '',
        image: post.full_picture ?? null,
        url: post.permalink_url ?? `https://www.facebook.com/${post.id}`,
        createdAt: post.created_time,
      }))
  } catch (error) {
    console.error('[facebook] No se pudieron obtener las publicaciones:', error)
    return []
  }
}
