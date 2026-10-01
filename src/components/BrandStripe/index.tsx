import React from 'react'

import { cn } from '@/utilities/ui'

/**
 * Franja decorativa con los colores de la marca, en el orden de las flechas del logo:
 * verde, rojo, amarillo y azul (cuatro tramos iguales).
 * Se usa bajo el banner de portada y en la parte superior del footer.
 */
export const BrandStripe: React.FC<{ className?: string }> = ({ className }) => (
  <div aria-hidden className={cn('grid h-1 grid-cols-4', className)}>
    <span className="bg-leaf" />
    <span className="bg-alert" />
    <span className="bg-sun" />
    <span className="bg-brand" />
  </div>
)
