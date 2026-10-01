import React from 'react'

import { cn } from '@/utilities/ui'

export type RibbonColor = 'ink' | 'brand' | 'leaf' | 'sun' | 'alert'

/** Fondo del centro y relleno de las puntas (clases completas para que Tailwind las detecte). */
const colorStyles: Record<RibbonColor, { bg: string; fill: string; text: string }> = {
  ink: { bg: 'bg-ink', fill: 'fill-ink', text: 'text-white' },
  brand: { bg: 'bg-brand', fill: 'fill-brand', text: 'text-white' },
  leaf: { bg: 'bg-leaf', fill: 'fill-leaf', text: 'text-white' },
  // En amarillo el texto va oscuro: blanco sobre amarillo casi no se lee
  sun: { bg: 'bg-sun', fill: 'fill-sun', text: 'text-ink' },
  alert: { bg: 'bg-alert', fill: 'fill-alert', text: 'text-white' },
}

const sizeStyles = {
  // Cinta de título de sección (portada)
  lg: {
    notch: 'w-7 md:w-9',
    point: 'w-10 md:w-12',
    body: 'justify-center px-2 py-4 text-center md:py-5',
  },
  // Etiqueta de título (tarjetas de propuestas)
  sm: {
    notch: 'w-3.5',
    point: 'w-5',
    body: 'px-2 py-2',
  },
}

type Props = {
  children: React.ReactNode
  color?: RibbonColor
  size?: keyof typeof sizeStyles
  className?: string
}

/**
 * Cinta en forma de flecha: muesca a la izquierda y punta a la derecha, como las
 * flechas del logo.
 *
 * Los extremos son SVG independientes (con esquinas suavizadas) y el centro es un bloque
 * flexible, así la cinta se estira a cualquier ancho sin deformar las puntas. Los SVG solo
 * se estiran en alto (`preserveAspectRatio="none"`) si el texto ocupa dos líneas.
 */
export const Ribbon: React.FC<Props> = ({ children, color = 'ink', size = 'lg', className }) => {
  const c = colorStyles[color]
  const s = sizeStyles[size]

  return (
    <div className={cn('flex items-stretch', c.text, className)}>
      {/* Muesca izquierda (entra en forma de "<") */}
      <svg
        aria-hidden
        className={cn('shrink-0', s.notch, c.fill)}
        preserveAspectRatio="none"
        viewBox="0 0 36 92"
      >
        <path d="M36 0H5Q0 0 3.5 3.5L32 42Q35 46 32 50L3.5 88.5Q0 92 5 92H36Z" />
      </svg>

      <div className={cn('flex min-w-0 flex-1 items-center', s.body, c.bg)}>{children}</div>

      {/* Punta derecha (flecha ">") */}
      <svg
        aria-hidden
        className={cn('shrink-0', s.point, c.fill)}
        preserveAspectRatio="none"
        viewBox="0 0 50 92"
      >
        <path d="M0 0H3Q8 0 11.5 3.5L47 42Q50 46 47 50L11.5 88.5Q8 92 3 92H0Z" />
      </svg>
    </div>
  )
}
