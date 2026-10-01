import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { brandDefaults } from '@/Header/brandDefaults'
import { revalidateFooter } from './hooks/revalidateFooter'

/** Redes sociales soportadas por el footer y la barra superior (cada una tiene su icono). */
export const socialPlatformOptions = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'X (Twitter)', value: 'x' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
] as const

/** Footer institucional: logotipo, descripción, enlaces, contacto, redes y barra inferior. */
export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Pie de página',
  admin: {
    group: 'Configuración del sitio',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identidad',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              label: 'Logotipo del footer (opcional)',
              relationTo: 'media',
              admin: {
                description: 'Si se deja vacío se usa el mismo logotipo del Encabezado.',
              },
            },
            {
              name: 'invertLogo',
              type: 'checkbox',
              label: 'Mostrar el logotipo en blanco',
              defaultValue: true,
              admin: {
                description:
                  'Convierte el logo a blanco para el fondo oscuro. Desactívalo si subiste un logo que ya es blanco o a color.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descripción',
              defaultValue: brandDefaults.footerDescription,
              admin: {
                description: 'Texto breve bajo el logo del footer.',
              },
            },
          ],
        },
        {
          label: 'Enlaces',
          fields: [
            {
              name: 'navTitle',
              type: 'text',
              label: 'Título de la columna',
              defaultValue: brandDefaults.footerNavTitle,
            },
            {
              name: 'linksSource',
              type: 'radio',
              label: '¿Qué enlaces mostrar?',
              defaultValue: 'header',
              options: [
                { label: 'Usar el menú de navegación del Encabezado', value: 'header' },
                { label: 'Enlaces propios del footer', value: 'custom' },
              ],
              admin: {
                layout: 'vertical',
                description:
                  'Con el menú del Encabezado, el footer se actualiza solo cuando cambian las pestañas del menú (incluye las subpestañas).',
              },
            },
            {
              name: 'navItems',
              type: 'array',
              label: 'Enlaces',
              labels: { singular: 'Enlace', plural: 'Enlaces' },
              fields: [
                link({
                  appearances: false,
                }),
              ],
              maxRows: 8,
              admin: {
                condition: (data) => data?.linksSource === 'custom',
                initCollapsed: true,
                components: {
                  RowLabel: '@/Footer/RowLabel#RowLabel',
                },
              },
            },
          ],
        },
        {
          label: 'Contacto y redes',
          fields: [
            {
              name: 'contactTitle',
              type: 'text',
              label: 'Título de la columna',
              defaultValue: brandDefaults.footerContactTitle,
            },
            {
              name: 'contact',
              type: 'group',
              label: 'Contacto',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'email',
                      type: 'email',
                      label: 'Correo',
                      admin: {
                        description:
                          'Se muestra en el footer y en la barra superior del encabezado.',
                      },
                    },
                    { name: 'phone', type: 'text', label: 'Teléfono' },
                  ],
                },
                { name: 'address', type: 'textarea', label: 'Dirección' },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Redes sociales',
              labels: { singular: 'Red social', plural: 'Redes sociales' },
              admin: {
                description:
                  'Ligas de los iconos de redes que aparecen en la barra superior del encabezado y en el footer. Si la lista queda vacía, no se muestran iconos.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      label: 'Red',
                      required: true,
                      options: [...socialPlatformOptions],
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'Liga',
                      required: true,
                      admin: {
                        description:
                          'Dirección completa, ej. https://www.facebook.com/Manolo.Jimenez.Salinas',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Barra inferior',
          fields: [
            {
              name: 'copyright',
              type: 'text',
              label: 'Texto de derechos (izquierda)',
              defaultValue: brandDefaults.copyright,
              admin: {
                description: 'Escribe {año} para mostrar el año actual automáticamente.',
              },
            },
            {
              name: 'legend',
              type: 'text',
              label: 'Leyenda (derecha)',
              defaultValue: brandDefaults.footerLegend,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
