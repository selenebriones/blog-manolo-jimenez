import type { Block } from 'payload'

/**
 * Bloque "Línea de tiempo": años sobre una línea horizontal con un punto por etapa
 * y la descripción debajo de cada año.
 */
export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: {
    singular: 'Línea de tiempo',
    plural: 'Líneas de tiempo',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título (opcional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Etapas',
      labels: { singular: 'Etapa', plural: 'Etapas' },
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'En orden cronológico. Se ven mejor de 3 a 5 etapas.',
        components: {
          RowLabel: '@/blocks/Timeline/RowLabel#TimelineRowLabel',
        },
      },
      fields: [
        {
          name: 'year',
          type: 'text',
          label: 'Año',
          required: true,
          admin: { description: 'Ej. 2008 o 2018 – 2021' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción',
          required: true,
          admin: { description: 'Deja una línea en blanco para separar párrafos.' },
        },
      ],
    },
  ],
}
