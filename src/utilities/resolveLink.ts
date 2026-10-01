import type { Page, Post } from '@/payload-types'

/** Forma del grupo `link` que generan `src/fields/link.ts` y los globales. */
export type LinkField = {
  type?: 'reference' | 'custom' | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  url?: string | null
  label?: string | null
}

export type ResolvedLink = { href: string; label: string; newTab?: boolean }

/**
 * Convierte un campo `link` de Payload en `{ href, label }` para componentes de UI
 * que no usan `CMSLink` (navbar, footer). Devuelve null si el enlace está incompleto.
 */
export const resolveLink = (link?: LinkField | null): ResolvedLink | null => {
  if (!link) return null

  let href = link.url ?? ''

  if (link.type === 'reference' && typeof link.reference?.value === 'object') {
    const { relationTo, value } = link.reference
    const slug = value.slug === 'home' ? '' : value.slug
    href = relationTo === 'pages' ? `/${slug ?? ''}` : `/${relationTo}/${slug}`
  }

  if (!href || !link.label) return null

  return { href, label: link.label, newTab: Boolean(link.newTab) }
}
