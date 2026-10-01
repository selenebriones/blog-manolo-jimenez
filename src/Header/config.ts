import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { brandDefaults } from './brandDefaults'
import { navItemsField } from './navFields'
import { revalidateHeader } from './hooks/revalidateHeader'

/**
 * Encabezado del sitio: menú principal (pestañas con subpestañas opcionales)
 * y botón destacado ("Únete" / "Contacto"). Todo se edita desde el admin.
 */
export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Encabezado',
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
          label: 'Logotipo y barra superior',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              label: 'Logotipo',
              relationTo: 'media',
              admin: {
                description:
                  'PNG o SVG con fondo transparente, en color oscuro (va sobre fondo blanco). Si se deja vacío se usa el logo oficial.',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              label: 'Favicon (icono de la pestaña del navegador)',
              relationTo: 'media',
              admin: {
                description:
                  'Imagen CUADRADA, idealmente PNG de 512 × 512 px o SVG, con un símbolo simple (se ve muy pequeño). Si se deja vacío se usa el icono predeterminado.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'topBarText',
                  type: 'text',
                  label: 'Leyenda de la barra superior (escritorio)',
                  defaultValue: brandDefaults.topBarText,
                  admin: { width: '60%' },
                },
                {
                  name: 'topBarTextMobile',
                  type: 'text',
                  label: 'Leyenda corta (celular)',
                  defaultValue: brandDefaults.topBarTextMobile,
                  admin: { width: '40%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Menú',
          fields: [navItemsField],
        },
        {
          label: 'Botón destacado',
          fields: [
            link({
              appearances: false,
              overrides: {
                name: 'cta',
                label: 'Botón destacado',
                admin: {
                  description:
                    'Botón en color primario a la derecha del menú. Ej. "Únete" o "Contacto". Para abrir el correo usa una URL como mailto:contacto@manolojimenez.mx',
                },
              },
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
