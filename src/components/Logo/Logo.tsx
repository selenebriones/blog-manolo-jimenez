import clsx from 'clsx'
import React from 'react'

import { brandDefaults, type LogoData } from '@/Header/brandDefaults'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  /** `light` invierte el logo (negro → blanco) para fondos oscuros como el footer. */
  tone?: 'dark' | 'light'
  /** Logo cargado en el admin; si no se pasa, el oficial de `public/logo-manolo.png`. */
  logo?: LogoData
}

/** Logotipo del sitio (editable en Configuración del sitio → Encabezado / Pie de página). */
export const Logo = (props: Props) => {
  const {
    loading = 'lazy',
    priority = 'low',
    className,
    tone = 'dark',
    logo = brandDefaults.logo,
  } = props

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('h-12 w-auto md:h-14', tone === 'light' && 'brightness-0 invert', className)}
      src={logo.url}
    />
  )
}
