/**
 * Campos que se piden a Payload para pintar una `PostCard`.
 * Usarlo en `payload.find({ select: postCardSelect })` evita traer el contenido completo
 * (rich text) de cada noticia en los listados.
 */
export const postCardSelect = {
  title: true,
  slug: true,
  heroImage: true,
  categories: true,
  publishedAt: true,
  excerpt: true,
  breaking: true,
  meta: {
    image: true,
    description: true,
  },
} as const
