/**
 * Valores por defecto de la identidad del sitio (logo y leyendas).
 * Se usan mientras no se capture otra cosa en el admin (Encabezado / Pie de página).
 */
export const brandDefaults = {
  logo: { url: '/logo-manolo.png', width: 242, height: 75, alt: 'Manolo Jiménez, Gobernador' },
  topBarText: 'Gobernador del Estado de Coahuila de Zaragoza',
  topBarTextMobile: 'Gobernador de Coahuila',
  footerDescription:
    'Sitio oficial de Manolo Jiménez, Gobernador de Coahuila. Noticias, propuestas y el trabajo de cada día en los 38 municipios del estado.',
  footerNavTitle: 'Navegación',
  footerContactTitle: 'Contacto',
  copyright: '© {año} Manolo Jiménez. Todos los derechos reservados.',
  footerLegend: 'Gobernador del Estado de Coahuila de Zaragoza',
}

export type LogoData = { url: string; width: number; height: number; alt: string }

/** Convierte un archivo de Medios en datos para el <Logo>; si no hay, usa el logo oficial. */
export const resolveLogo = (
  media?:
    | { url?: string | null; width?: number | null; height?: number | null; alt?: string | null }
    | number
    | null,
): LogoData => {
  if (!media || typeof media !== 'object' || !media.url) return brandDefaults.logo
  return {
    url: media.url,
    width: media.width ?? brandDefaults.logo.width,
    height: media.height ?? brandDefaults.logo.height,
    alt: media.alt || brandDefaults.logo.alt,
  }
}
