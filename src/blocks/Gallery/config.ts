import type { Block } from 'payload'

/**
 * Bloque "Galería": mosaico de fotos que respeta la proporción de cada una.
 * Al hacer clic, la foto se abre en grande con navegación anterior/siguiente.
 */
export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Galería',
    plural: 'Galerías',
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
      name: 'images',
      type: 'array',
      label: 'Fotos',
      labels: { singular: 'Foto', plural: 'Fotos' },
      minRows: 1,
      admin: {
        initCollapsed: true,
        description:
          'Arrastra para reordenar. Se acomodan en columnas (3 en escritorio, 2 en tablet, 1 en celular).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'image',
              type: 'upload',
              label: 'Foto',
              relationTo: 'media',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'caption',
              type: 'text',
              label: 'Pie de foto (opcional)',
              admin: {
                width: '50%',
                description: 'Se ve al pasar el cursor y en la vista ampliada.',
              },
            },
          ],
        },
      ],
    },
  ],
}
