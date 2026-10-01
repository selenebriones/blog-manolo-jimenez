import type { Field } from 'payload'

/**
 * Campos de una pestaña del menú principal.
 *
 * Cada pestaña tiene un nombre editable y un destino:
 * - `reference`: una página o noticia del sitio (si cambia su slug, el menú se actualiza solo).
 * - `custom`:    una URL (ruta interna como `/galeria` o un sitio externo).
 * - `file`:      un archivo de Medios, p. ej. el PDF de un informe.
 * - `submenu`:   no enlaza a nada; solo agrupa subpestañas (p. ej. "Informe").
 *
 * Las subpestañas usan los mismos campos, excepto la opción `submenu`
 * (el menú solo tiene un nivel de profundidad).
 */
const navItemFields = (allowSubmenu: boolean): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Nombre de la pestaña',
        required: true,
        admin: { width: '50%' },
      },
      {
        name: 'type',
        type: 'select',
        label: 'Tipo',
        required: true,
        defaultValue: 'reference',
        admin: { width: '50%' },
        options: [
          { label: 'Página o noticia del sitio', value: 'reference' },
          { label: 'URL', value: 'custom' },
          { label: 'Archivo (PDF, documento)', value: 'file' },
          ...(allowSubmenu ? [{ label: 'Menú desplegable (subpestañas)', value: 'submenu' }] : []),
        ],
      },
    ],
  },
  {
    name: 'reference',
    type: 'relationship',
    label: 'Página o noticia',
    relationTo: ['pages', 'posts'],
    required: true,
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'reference',
    },
  },
  {
    name: 'url',
    type: 'text',
    label: 'URL',
    required: true,
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'custom',
      description:
        'Ruta interna (ej. /galeria) o dirección completa (ej. https://coahuila.gob.mx).',
    },
  },
  {
    name: 'file',
    type: 'upload',
    label: 'Archivo',
    relationTo: 'media',
    required: true,
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'file',
    },
  },
  {
    name: 'newTab',
    type: 'checkbox',
    label: 'Abrir en una pestaña nueva del navegador',
    admin: {
      condition: (_, siblingData) => siblingData?.type !== 'submenu',
    },
  },
]

export const navItemsField: Field = {
  name: 'navItems',
  type: 'array',
  label: 'Menú principal',
  labels: { singular: 'Pestaña', plural: 'Pestañas' },
  maxRows: 8,
  admin: {
    initCollapsed: true,
    description: 'Arrastra para reordenar. Usa el menú ⋯ de cada fila para duplicar o eliminar.',
    components: {
      RowLabel: '@/Header/RowLabel#RowLabel',
    },
  },
  fields: [
    ...navItemFields(true),
    {
      name: 'children',
      type: 'array',
      label: 'Subpestañas',
      labels: { singular: 'Subpestaña', plural: 'Subpestañas' },
      minRows: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'submenu',
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
      fields: navItemFields(false),
    },
  ],
}
