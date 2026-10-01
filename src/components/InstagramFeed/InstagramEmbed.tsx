'use client'

import React, { useEffect } from 'react'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

const SCRIPT_ID = 'instagram-embed-js'

/**
 * Publicación de Instagram con el código oficial de "Insertar".
 * Carga `embed.js` una sola vez y, si ya estaba cargado (al navegar sin recargar),
 * le pide a Instagram que procese las publicaciones nuevas.
 */
export const InstagramEmbed: React.FC<{ url: string }> = ({ url }) => {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process()
      return
    }
    if (document.getElementById(SCRIPT_ID)) return

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    document.body.appendChild(script)
  }, [url])

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ margin: 0, maxWidth: '100%', minWidth: 'auto', width: '100%' }}
    >
      {/* Respaldo mientras carga o si el navegador bloquea Instagram */}
      <a
        className="block p-6 text-center font-semibold text-brand underline underline-offset-4"
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        Ver esta publicación en Instagram
      </a>
    </blockquote>
  )
}
