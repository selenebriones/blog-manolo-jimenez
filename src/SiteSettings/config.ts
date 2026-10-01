import type { GlobalConfig } from 'payload'

import { siteSettingsDefaults as d } from './defaults'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

/**
 * SEO y datos del sitio: nombre, título de la portada, descripción e imagen para compartir.
 * Cada página y noticia puede tener su propio título/descripción/imagen en su pestaña "SEO";
 * estos valores se usan cuando no los tiene y para la portada.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'SEO y datos del sitio',
  admin: {
    group: 'Configuración del sitio',
    description:
      'Cómo aparece el sitio en Google, en la pestaña del navegador y al compartirlo en redes o WhatsApp.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Nombre del sitio',
      required: true,
      defaultValue: d.siteName,
      admin: {
        description:
          'Se agrega al final del título de cada página, ej. "Mi Historia | Manolo Jiménez".',
      },
    },
    {
      name: 'defaultTitle',
      type: 'text',
      label: 'Título de la portada',
      required: true,
      defaultValue: d.defaultTitle,
      admin: {
        description: 'Título completo de la página de inicio. Recomendado: menos de 60 caracteres.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción del sitio',
      required: true,
      defaultValue: d.description,
      maxLength: 200,
      admin: {
        description:
          'Aparece bajo el título en Google y al compartir. Se usa en las páginas que no tienen descripción propia. Recomendado: 120–160 caracteres.',
      },
    },
    {
      name: 'shareImage',
      type: 'upload',
      label: 'Imagen para compartir',
      relationTo: 'media',
      admin: {
        description:
          'La que se ve al compartir el sitio en Facebook, WhatsApp o X. Horizontal de 1200 × 630 px. Las noticias usan su propia foto.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
