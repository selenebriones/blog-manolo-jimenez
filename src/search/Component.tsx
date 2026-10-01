'use client'

import { Search as SearchIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { useDebounce } from '@/utilities/useDebounce'

/**
 * Buscador de noticias: actualiza `?q=` mientras se escribe (con una pausa breve).
 * Arranca con el término de la URL, así un enlace como /search?q=seguridad funciona
 * (la versión de la plantilla lo borraba al cargar).
 */
export const Search: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initial = searchParams.get('q') ?? ''

  const [value, setValue] = useState(initial)
  const debouncedValue = useDebounce(value)
  const lastPushed = useRef(initial)

  useEffect(() => {
    const term = debouncedValue.trim()
    if (term === lastPushed.current) return
    lastPushed.current = term
    router.replace(`${pathname}${term ? `?q=${encodeURIComponent(term)}` : ''}`, { scroll: false })
  }, [debouncedValue, pathname, router])

  return (
    <form onSubmit={(event) => event.preventDefault()} role="search">
      <label className="sr-only" htmlFor="search">
        Buscar noticias
      </label>
      <div className="relative">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted"
        />
        <input
          autoComplete="off"
          className="h-14 w-full rounded-lg border border-border bg-white pl-12 pr-4 text-lg text-ink shadow-card placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
          id="search"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Buscar por palabra clave, lugar o programa…"
          type="search"
          value={value}
        />
      </div>
    </form>
  )
}
