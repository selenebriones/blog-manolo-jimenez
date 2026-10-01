import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Garantiza que la primera cuenta creada (pantalla "Create first user")
 * sea administradora, para que nadie se quede fuera de la gestión de usuarios.
 */
export const firstUserIsAdmin: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data

  const { totalDocs } = await req.payload.count({ collection: 'users', req })

  if (totalDocs === 0) {
    return { ...data, role: 'admin' }
  }

  return data
}
