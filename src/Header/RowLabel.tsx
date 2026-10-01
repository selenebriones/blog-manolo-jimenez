'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

/** Muestra el nombre de la pestaña en la fila colapsada del admin (ej. "3 · Propuestas"). */
export const RowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string | null }>()

  const position = rowNumber !== undefined ? `${rowNumber + 1} · ` : ''

  return <div>{data?.label ? `${position}${data.label}` : 'Nueva pestaña'}</div>
}
