/**
 * Fecha legible en español de México, p. ej. "25 sep 2026".
 * Se fija la zona horaria de Coahuila para que servidor y navegador muestren el mismo día.
 */
const formatter = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Monterrey',
})

export const formatDate = (value?: string | null): string =>
  value ? formatter.format(new Date(value)).replace('.', '') : ''
