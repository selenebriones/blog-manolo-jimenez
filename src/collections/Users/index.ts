import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isAdmin, isAdminField, isAdminOrSelf } from '../../access/isAdmin'
import { firstUserIsAdmin } from './hooks/firstUserIsAdmin'

/**
 * Usuarios del panel (equipo de comunicación).
 *
 * Roles:
 * - admin:  gestiona usuarios, roles y todo el contenido.
 * - editor: crea, edita y publica noticias y páginas.
 * - autor:  redacta noticias (aparece como firma en las notas).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdmin,
    read: authenticated,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    group: 'Administración',
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nombre completo',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          label: 'Cargo',
          admin: {
            description: 'Ej. "Coordinación de Comunicación Social". Se muestra junto a la firma.',
          },
        },
      ],
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'editor',
      // Se guarda en el JWT para que las reglas de acceso no consulten la BD en cada request
      saveToJWT: true,
      access: {
        // Solo un admin puede cambiar roles (evita que alguien se promueva a sí mismo)
        create: isAdminField,
        update: isAdminField,
      },
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Autor', value: 'autor' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      label: 'Foto de perfil',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Semblanza',
      maxLength: 400,
    },
  ],
  hooks: {
    beforeChange: [firstUserIsAdmin],
  },
  timestamps: true,
}
