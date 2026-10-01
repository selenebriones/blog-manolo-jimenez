import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/**
 * Bloque "Presentación con foto": retrato a la izquierda y título + texto a la derecha.
 * Se usa al inicio de Mi Historia.
 */
export const ProfileIntro: Block = {
  slug: 'profileIntro',
  interfaceName: 'ProfileIntroBlock',
  labels: {
    singular: 'Presentación con foto',
    plural: 'Presentaciones con foto',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      label: 'Foto',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Retrato vertical. Marca el punto focal en Medios para que el recorte quede bien.',
      },
    },
    {
      name: 'photos',
      type: 'array',
      label: 'Fotos debajo del retrato (opcional)',
      labels: { singular: 'Foto', plural: 'Fotos' },
      maxRows: 3,
      admin: {
        description:
          'Hasta 3 fotos en mosaico bajo el retrato: con 2 van lado a lado; con 3, la 1 a todo lo ancho y la 2 y 3 debajo. En escritorio se ajustan al alto del texto. Marca el punto focal en Medios para que el recorte quede bien.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Foto',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtítulo (opcional)',
      admin: { description: 'Línea corta bajo el título, en azul.' },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenido',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'graphic',
      type: 'upload',
      label: 'Gráfico debajo del texto (opcional)',
      relationTo: 'media',
      admin: {
        description:
          'Lema o firma que va centrado bajo el texto. Ideal: PNG o WebP con fondo transparente.',
      },
    },
  ],
}
