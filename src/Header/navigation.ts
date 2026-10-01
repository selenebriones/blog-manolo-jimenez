import type { Header } from '@/payload-types'

type RawNavItem = NonNullable<Header['navItems']>[number]
type RawNavChild = NonNullable<RawNavItem['children']>[number]

export type NavLink = { label: string; href: string; newTab: boolean }
export type NavItem = NavLink | { label: string; children: NavLink[] }

export const hasChildren = (item: NavItem): item is { label: string; children: NavLink[] } =>
  'children' in item

/** Resuelve el destino de una pestaña o subpestaña. Devuelve null si está incompleta. */
const resolveHref = (item: RawNavItem | RawNavChild): string | null => {
  switch (item.type) {
    case 'reference': {
      const value = item.reference?.value
      if (!value || typeof value !== 'object' || !value.slug) return null
      if (item.reference?.relationTo === 'posts') return `/posts/${value.slug}`
      return value.slug === 'home' ? '/' : `/${value.slug}`
    }
    case 'custom':
      return item.url || null
    case 'file':
      return item.file && typeof item.file === 'object' ? item.file.url || null : null
    default:
      return null
  }
}

const toLink = (item: RawNavItem | RawNavChild): NavLink | null => {
  const href = resolveHref(item)
  if (!href) return null
  // Los archivos (PDFs) siempre se abren aparte para no sacar a la persona del sitio
  return { label: item.label, href, newTab: Boolean(item.newTab) || item.type === 'file' }
}

/**
 * Convierte el menú del global "Encabezado" en datos listos para pintar.
 * Omite pestañas incompletas y menús desplegables sin subpestañas válidas.
 */
export const resolveNavItems = (items: Header['navItems']): NavItem[] =>
  (items ?? []).flatMap<NavItem>((item) => {
    if (item.type === 'submenu') {
      const children = (item.children ?? [])
        .map(toLink)
        .filter((child): child is NavLink => child !== null)
      return children.length ? [{ label: item.label, children }] : []
    }

    const link = toLink(item)
    return link ? [link] : []
  })

/** Lista plana (pestañas + subpestañas), usada por el footer. */
export const flattenNavItems = (items: NavItem[]): NavLink[] =>
  items.flatMap((item) => (hasChildren(item) ? item.children : [item]))
