import type { Block } from 'payload'

/**
 * Bloque "Propuestas": tarjetas con los ejes de la agenda.
 * Cada propuesta tiene un título en etiqueta de color, una frase introductoria
 * y una lista de puntos; cada punto abre con una frase destacada en color.
 */
export const Proposals: Block = {
  slug: 'proposals',
  interfaceName: 'ProposalsBlock',
  labels: {
    singular: 'Propuestas',
    plural: 'Bloques de propuestas',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título de la sección (opcional)',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Texto introductorio (opcional)',
    },
    {
      name: 'featureImage',
      type: 'upload',
      label: 'Imagen destacada (opcional)',
      relationTo: 'media',
      admin: {
        description:
          'Se muestra a la derecha del título, encimada sobre el encabezado de la página (ej. el mapa de Coahuila). Ideal: PNG o WebP con fondo transparente, vertical.',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Propuestas',
      labels: { singular: 'Propuesta', plural: 'Propuestas' },
      minRows: 1,
      admin: {
        initCollapsed: true,
        description: 'Arrastra para reordenar.',
        components: {
          RowLabel: '@/blocks/Proposals/RowLabel#ProposalRowLabel',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Título',
              required: true,
              admin: { width: '60%' },
            },
            {
              name: 'color',
              type: 'select',
              label: 'Color de la etiqueta',
              required: true,
              defaultValue: 'brand',
              admin: { width: '40%' },
              options: [
                { label: 'Azul institucional', value: 'brand' },
                { label: 'Verde', value: 'leaf' },
                { label: 'Amarillo', value: 'sun' },
                { label: 'Rojo', value: 'alert' },
              ],
            },
          ],
        },
        {
          name: 'summary',
          type: 'textarea',
          label: 'Frase introductoria',
          required: true,
        },
        {
          name: 'points',
          type: 'array',
          label: 'Puntos',
          labels: { singular: 'Punto', plural: 'Puntos' },
          admin: {
            description:
              'La frase destacada se pinta en color (verde, rojo, amarillo y azul, en ese orden) y el resto en gris.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'highlight',
                  type: 'text',
                  label: 'Frase destacada',
                  required: true,
                  admin: { width: '40%' },
                },
                {
                  name: 'text',
                  type: 'textarea',
                  label: 'Resto del texto',
                  admin: { width: '60%', rows: 2 },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
