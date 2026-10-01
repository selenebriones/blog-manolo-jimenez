import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { preventFileReplacement } from './hooks/preventFileReplacement'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Biblioteca de imágenes y archivos.
 * Los archivos se guardan en `public/media` y se generan varios tamaños
 * para servir siempre la imagen más ligera posible (tarjetas, hero, redes sociales).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo',
    plural: 'Medios',
  },
  admin: {
    group: 'Contenido',
    description:
      'Cada foto se comparte entre todas las secciones que la usan. Para cambiar la foto de una sola sección, sube un archivo nuevo desde esa sección; el archivo de una foto existente no se puede reemplazar.',
  },
  hooks: {
    beforeOperation: [preventFileReplacement],
  },
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      // Obligatorio: accesibilidad (lectores de pantalla) y SEO de imágenes
      required: true,
      admin: {
        description:
          'Describe lo que se ve en la imagen, p. ej. "El gobernador inaugura la clínica en Torreón".',
      },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Crédito fotográfico',
      admin: {
        description: 'Opcional. Ej. "Foto: Comunicación Social".',
      },
    },
    {
      // URL original de la foto en el sitio anterior (WordPress). La usa el importador para
      // no subir dos veces la misma foto. No se muestra en el admin.
      name: 'sourceUrl',
      type: 'text',
      index: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Pie de foto',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
