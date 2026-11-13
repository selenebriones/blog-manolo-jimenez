'use client'

import { Link, useConfig } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

/**
 * Aviso en Página de inicio → Redes sociales: las redes no se editan aquí sino en el Pie de
 * página. Lleva un botón directo a esa pantalla.
 */
export const SocialLinksNotice: React.FC = () => {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        borderRadius: 6,
        border: '1px solid #b6dbe4',
        background: '#e6f2f5',
        color: '#05637a',
      }}
    >
      <p style={{ margin: 0, lineHeight: 1.5 }}>
        <strong>¿Quieres agregar, quitar o cambiar una red social?</strong>
        <br />
        Las redes y sus ligas se editan en <strong>Pie de página → Contacto y redes</strong>. Ahí
        mismo se cambian los iconos de la barra superior y del footer.
      </p>
      <Link
        href={formatAdminURL({ adminRoute, path: '/globals/footer' })}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: 6,
          background: '#077d98',
          color: '#fff',
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Editar redes sociales →
      </Link>
    </div>
  )
}
