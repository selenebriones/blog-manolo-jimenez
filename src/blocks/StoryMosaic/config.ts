import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/**
 * Bloque "Historia con mosaico": texto a la izquierda y hasta 4 fotos en mosaico
 * a la derecha (inspirado en la sección "Briefly form history" de CityGov).
 * Se usa en Mi Historia, pero sirve para cualquier página de presentación.
 */
export const StoryMosaic: Block = {
  slug: 'storyMosaic',
  interfaceName: 'StoryMosaicBlock',
  labels: {
    singular: 'Historia con mosaico',
    plural: 'Historias con mosaico',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título (opcional)',
          admin: { width: '60%', description: 'Déjalo vacío si el texto va sin título.' },
        },
        {
          name: 'isPageTitle',
          type: 'checkbox',
          label: 'Es el título principal de la página',
          defaultValue: true,
          admin: {
            width: '40%',
            style: { alignSelf: 'center' },
            description:
              'Actívalo si la página no tiene hero (cada página debe tener un solo título principal).',
          },
        },
      ],
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtítulo (opcional)',
      admin: {
        description: 'Línea corta bajo el título, en mayúsculas espaciadas.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenido',
      required: true,
      // Mismas herramientas que el editor de las noticias (sin bloques incrustados)
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
    },
    {
      name: 'images',
      type: 'array',
      label: 'Fotos del mosaico',
      labels: { singular: 'Foto', plural: 'Fotos' },
      minRows: 1,
      maxRows: 4,
      admin: {
        description:
          'Hasta 4 fotos, en este orden: 1) horizontal arriba · 2) vertical arriba · 3) vertical abajo · 4) horizontal abajo. Con 3 fotos y sin gráfico inferior: la 1 arriba a todo lo ancho y la 2 y 3 debajo. Marca el punto focal en Medios para que el recorte quede bien.',
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
      type: 'row',
      fields: [
        {
          name: 'topGraphic',
          type: 'upload',
          label: 'Gráfico superior (opcional)',
          relationTo: 'media',
          admin: {
            width: '50%',
            description:
              'Va arriba de la foto 1, en el espacio que deja la foto vertical. Ideal: PNG o WebP con fondo transparente.',
          },
        },
        {
          name: 'bottomGraphic',
          type: 'upload',
          label: 'Gráfico inferior (opcional)',
          relationTo: 'media',
          admin: {
            width: '50%',
            description: 'Va debajo de la foto 4. Ideal: PNG o WebP con fondo transparente.',
          },
        },
      ],
    },
  ],
}
