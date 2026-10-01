'use client'

import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    FB?: { XFBML: { parse: (element?: HTMLElement) => void } }
  }
}

const SDK_ID = 'facebook-jssdk'
const SDK_SRC = 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v23.0'

/**
 * Recuadro oficial de Facebook ("Page Plugin") con la línea de tiempo de la página.
 *
 * - Carga el SDK de Facebook una sola vez, aunque el componente se monte varias veces.
 * - Al navegar entre páginas sin recargar, vuelve a pedir al SDK que pinte el recuadro
 *   (`FB.XFBML.parse`), porque el SDK solo lo hace por sí mismo en la primera carga.
 * - Facebook limita el ancho a 180–500 px; se adapta al contenedor dentro de ese rango.
 */
export const FacebookPagePlugin: React.FC<{
  pageUrl: string
  pageName: string
  height?: number
}> = ({ pageUrl, pageName, height = 640 }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse(ref.current ?? undefined)
      return
    }
    if (document.getElementById(SDK_ID)) return

    const script = document.createElement('script')
    script.id = SDK_ID
    script.src = SDK_SRC
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    document.body.appendChild(script)
  }, [pageUrl])

  return (
    <div className="w-[500px] max-w-full" ref={ref}>
      <div
        className="fb-page"
        data-adapt-container-width="true"
        data-height={height}
        data-hide-cover="false"
        data-href={pageUrl}
        data-show-facepile="true"
        data-small-header="false"
        data-tabs="timeline"
        data-width="500"
      >
        {/* Respaldo mientras carga o si el navegador bloquea Facebook */}
        <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
          <a
            className="font-semibold text-brand underline underline-offset-4"
            href={pageUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {pageName} en Facebook
          </a>
        </blockquote>
      </div>
    </div>
  )
}
