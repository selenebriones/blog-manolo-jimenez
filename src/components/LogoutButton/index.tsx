'use client'

import { Link, LogOutIcon, useConfig } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import './index.scss'

/**
 * Botón de "Cerrar sesión" del admin: naranja y con texto, en lugar del ícono pequeño de Payload
 * (en local, además, lo tapaba el indicador de Next.js). Va al final del menú lateral.
 */
export const LogoutButton: React.FC<{ tabIndex?: number }> = ({ tabIndex = 0 }) => {
  const {
    config: {
      admin: {
        routes: { logout: logoutRoute },
      },
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <Link
      className="logout-button"
      href={formatAdminURL({ adminRoute, path: logoutRoute })}
      prefetch={false}
      tabIndex={tabIndex}
    >
      <LogOutIcon />
      <span>Cerrar sesión</span>
    </Link>
  )
}
