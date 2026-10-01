'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

/** Muestra el año de la etapa en la fila colapsada del admin. */
export const TimelineRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<{ year?: string | null }>()
  const position = rowNumber !== undefined ? `${rowNumber + 1} · ` : ''
  return <div>{data?.year ? `${position}${data.year}` : 'Nueva etapa'}</div>
}
