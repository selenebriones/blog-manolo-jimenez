/**
 * Convierte cualquier liga de publicación de Instagram a la forma que entiende `embed.js`:
 * quita parámetros (?hl=es, ?igsh=…) y el usuario ("/manolojimenezs/reel/ID" → "/p/ID/").
 * Devuelve null si no es una liga de publicación.
 */
export const normalizeInstagramUrl = (raw: string): string | null => {
  const match = raw.trim().match(/instagram\.com\/(?:[^/]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/)
  // Siempre como /p/: el script de Instagram solo reconoce ese formato (los Reels también abren así)
  return match ? `https://www.instagram.com/p/${match[2]}/` : null
}
