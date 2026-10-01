'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

/** Muestra el título de la propuesta en la fila colapsada del admin. */
export const ProposalRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string | null }>()
  const position = rowNumber !== undefined ? `${rowNumber + 1} · ` : ''
  return <div>{data?.title ? `${position}${data.title}` : 'Nueva propuesta'}</div>
}
