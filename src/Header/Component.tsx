import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { resolveLink } from '@/utilities/resolveLink'
import { HeaderClient } from './Component.client'
import { brandDefaults, resolveLogo } from './brandDefaults'
import { defaultCta } from './defaults'
import { resolveNavItems } from './navigation'

/**
 * Header (Server Component): lee los globales de Payload y entrega al cliente
 * datos ya resueltos (hrefs listos), para que el componente interactivo sea simple.
 */
export async function Header() {
  const [headerData, footerData] = await Promise.all([
    // depth 1: trae el slug de las páginas y la URL de los archivos enlazados
    getCachedGlobal('header', 1)(),
    // La barra superior reutiliza correo y redes del footer para no capturarlos dos veces
    getCachedGlobal('footer', 1)(),
  ])

  // Ligas de redes: se editan en Pie de página → Contacto y redes
  const socialLinks = footerData?.socialLinks ?? []

  return (
    <HeaderClient
      cta={resolveLink(headerData?.cta) ?? defaultCta}
      email={footerData?.contact?.email ?? null}
      logo={resolveLogo(headerData?.logo)}
      topBarText={headerData?.topBarText || brandDefaults.topBarText}
      topBarTextMobile={headerData?.topBarTextMobile || brandDefaults.topBarTextMobile}
      navItems={resolveNavItems(headerData?.navItems)}
      socialLinks={socialLinks.map(({ platform, url }) => ({ platform, url }))}
    />
  )
}
