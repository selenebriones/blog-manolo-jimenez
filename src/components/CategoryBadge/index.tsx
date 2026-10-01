import React from 'react'

import type { Category } from '@/payload-types'

import { cn } from '@/utilities/ui'

type BadgeColor = Category['color']

/**
 * Estilos por color de categoría (el editor elige el color en el admin).
 * - `tint`:  fondo tenue + texto oscuro del mismo tono → para tarjetas sobre blanco.
 * - `solid`: color pleno → para usar sobre fotografías (hero).
 * Las clases van completas (no interpoladas) para que Tailwind las detecte.
 */
const variants: Record<'tint' | 'solid', Record<BadgeColor, string>> = {
  tint: {
    leaf: 'bg-leaf-light text-leaf-dark',
    brand: 'bg-brand-light text-brand-dark',
    sun: 'bg-sun-light text-sun-dark',
    alert: 'bg-alert-light text-alert-dark',
  },
  solid: {
    leaf: 'bg-leaf text-white',
    brand: 'bg-brand text-white',
    sun: 'bg-sun text-ink',
    alert: 'bg-alert text-white',
  },
}

type Props = {
  category: Pick<Category, 'title' | 'color'>
  variant?: 'tint' | 'solid'
  className?: string
}

export const CategoryBadge: React.FC<Props> = ({
  category,
  variant = 'tint',
  className,
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
      variants[variant][category.color ?? 'leaf'],
      className,
    )}
  >
    {category.title}
  </span>
)

/** Etiqueta roja de "Última hora" (el uso más fuerte del color de alerta). */
export const BreakingBadge: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full bg-alert px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white',
      className,
    )}
  >
    <span aria-hidden className="relative flex size-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
      <span className="relative inline-flex size-1.5 rounded-full bg-white" />
    </span>
    Última hora
  </span>
)
