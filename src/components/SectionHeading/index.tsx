import React from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  /** Texto pequeño sobre el título (p. ej. "Día a día"). */
  eyebrow?: string
  title: string
  /** id del h2, para enlazarlo con `aria-labelledby` de la sección. */
  id?: string
  description?: string
  /** Acción opcional alineada a la derecha (p. ej. enlace "Ver todas"). */
  action?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

/**
 * Encabezado de sección con el subrayado decorativo amarillo (`sun`),
 * el recurso de acento que se repite en todo el sitio.
 */
export const SectionHeading: React.FC<Props> = ({
  eyebrow,
  title,
  id,
  description,
  action,
  align = 'left',
  className,
}) => {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-4 md:mb-12',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl" id={id}>{title}</h2>
        <span
          aria-hidden
          className={cn('mt-4 block h-1 w-14 rounded-full bg-sun', centered && 'mx-auto')}
        />
        {description && <p className="mt-4 text-lg text-ink-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
