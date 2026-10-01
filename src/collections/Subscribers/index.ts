import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

/**
 * Suscriptores del boletín.
 *
 * El formulario público NO escribe por la API REST: usa la server action
 * `subscribeToNewsletter` (Local API con `overrideAccess`), así `create` puede
 * quedar cerrado y nadie puede crear registros masivamente desde /api/subscribers.
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: {
    singular: 'Suscriptor',
    plural: 'Suscriptores',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['email', 'name', 'status', 'createdAt'],
    group: 'Boletín',
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Correo electrónico',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      defaultValue: 'active',
      required: true,
      options: [
        { label: 'Activo', value: 'active' },
        { label: 'Dado de baja', value: 'unsubscribed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Origen',
      defaultValue: 'sitio-web',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
