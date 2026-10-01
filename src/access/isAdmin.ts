import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

/**
 * Solo usuarios con rol `admin`.
 * Se usa para gestionar usuarios y cambiar roles.
 */
export const isAdmin: Access<User> = ({ req: { user } }) => user?.role === 'admin'

/** Versión a nivel de campo (p. ej. para que nadie se asigne un rol a sí mismo). */
export const isAdminField: FieldAccess<User> = ({ req: { user } }) => user?.role === 'admin'

/**
 * Admins pueden todo; el resto solo puede leer o editar su propio documento.
 * Devuelve una query para que Payload filtre por `id` del usuario en sesión.
 */
export const isAdminOrSelf: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true

  return { id: { equals: user.id } }
}
