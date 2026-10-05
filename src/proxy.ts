import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Sitio privado mientras se revisa: el navegador pide usuario y contraseña antes de mostrar
 * cualquier página (autenticación básica de HTTP).
 *
 * - Se activa solo si existen `SITE_USER` y `SITE_PASSWORD` (variables de entorno en Vercel).
 *   Para abrir el sitio al público basta con borrarlas y volver a desplegar.
 * - Mientras está activo, también pide a los buscadores que no indexen nada (`X-Robots-Tag`).
 * - El admin (`/admin`) y la API (`/api`) quedan fuera: el admin ya tiene su propio login, y el
 *   servidor necesita leer las fotos en `/api/media/file/…` sin contraseña para optimizarlas.
 */
export function proxy(request: NextRequest) {
  const user = process.env.SITE_USER
  const password = process.env.SITE_PASSWORD
  if (!user || !password) return NextResponse.next()

  const header = request.headers.get('authorization') ?? ''
  const [scheme, encoded] = header.split(' ')

  if (scheme === 'Basic' && encoded) {
    const decoded = atob(encoded)
    const separator = decoded.indexOf(':')
    if (decoded.slice(0, separator) === user && decoded.slice(separator + 1) === password) {
      const response = NextResponse.next()
      response.headers.set('X-Robots-Tag', 'noindex, nofollow')
      return response
    }
  }

  return new NextResponse('Este sitio todavía no está abierto al público.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Manolo Jimenez", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

export const config = {
  // Todo menos el admin, la API, los archivos internos de Next.js y el favicon
  matcher: ['/((?!admin|api|_next/static|_next/image|favicon\\.ico|favicon\\.svg).*)'],
}
