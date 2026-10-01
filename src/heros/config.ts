import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Tipo de encabezado',
      options: [
        { label: 'Ninguno', value: 'none' },
        { label: 'Imagen con título de la página', value: 'pageTitle' },
        { label: 'Alto impacto (imagen a pantalla completa)', value: 'highImpact' },
        { label: 'Impacto medio (texto e imagen)', value: 'mediumImpact' },
        { label: 'Bajo impacto (solo texto)', value: 'lowImpact' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: {
        // El encabezado "Imagen con título" usa el título de la página; no lleva texto propio
        condition: (_, { type } = {}) => type !== 'pageTitle',
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) => type !== 'pageTitle',
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      label: 'Imagen',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'pageTitle'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
