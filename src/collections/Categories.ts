import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

/**
 * Colores disponibles para las etiquetas de categoría.
 * Los valores coinciden con los nombres de color de `tailwind.config.mjs`
 * (ver `src/components/CategoryBadge`), así el editor elige el acento sin tocar código.
 */
export const categoryColorOptions = [
  { label: 'Verde (acento)', value: 'leaf' },
  { label: 'Azul institucional', value: 'brand' },
  { label: 'Amarillo (destacado)', value: 'sun' },
  { label: 'Rojo (urgente)', value: 'alert' },
] as const

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoría',
    plural: 'Categorías',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'color', 'slug'],
    group: 'Noticias',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Nombre',
      required: true,
    },
    {
      name: 'color',
      type: 'select',
      label: 'Color de la etiqueta',
      defaultValue: 'leaf',
      required: true,
      options: [...categoryColorOptions],
      admin: {
        description:
          'Usa el rojo solo para temas urgentes; el verde es el acento por defecto para no saturar la portada.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      admin: {
        description: 'Opcional. Se usa como texto introductorio en el listado de la categoría.',
      },
    },
    slugField({
      position: undefined,
    }),
  ],
}
