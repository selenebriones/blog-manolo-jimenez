import { getCachedGlobal } from '@/utilities/getGlobals'
import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { BrandStripe } from '@/components/BrandStripe'
import { Logo } from '@/components/Logo/Logo'
import { SocialIcon, socialLabels } from '@/components/SocialIcon'
import { brandDefaults, resolveLogo } from '@/Header/brandDefaults'
import { flattenNavItems, resolveNavItems } from '@/Header/navigation'
import { resolveLink, type ResolvedLink } from '@/utilities/resolveLink'

/**
 * Footer institucional en fondo oscuro (`ink`), con tres columnas (identidad + redes, navegación y
 * contacto) y una barra inferior. Todo es editable en Configuración del sitio → Pie de página.
 */
export async function Footer() {
  const [footerData, headerData] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('header', 1)(),
  ])

  const navItems = (footerData?.navItems ?? [])
    .map(({ link }) => resolveLink(link))
    .filter((item): item is ResolvedLink => item !== null)
  // Por defecto el footer repite el menú del Encabezado; con "Enlaces propios" usa los suyos
  const useCustomLinks = footerData?.linksSource === 'custom'
  const links = useCustomLinks ? navItems : flattenNavItems(resolveNavItems(headerData?.navItems))

  const socialLinks = footerData?.socialLinks ?? []
  // Correo: Pie de página → Contacto y redes → Contacto (también se muestra en la barra superior)
  const email = footerData?.contact?.email
  const phone = footerData?.contact?.phone
  const address = footerData?.contact?.address

  // Logotipo: el propio del footer o, si no hay, el del Encabezado; en blanco salvo que se indique lo contrario
  const logo = resolveLogo(footerData?.logo ?? headerData?.logo)
  const invertLogo = footerData?.invertLogo ?? true
  const year = String(new Date().getFullYear())
  const copyright = (footerData?.copyright || brandDefaults.copyright).replace(/\{a[ñn]o\}/gi, year)

  return (
    <footer className="bg-ink text-white/75">
      <BrandStripe />

      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        {/* Identidad */}
        <div className="lg:col-span-5">
          <Link aria-label="Ir al inicio" className="inline-block" href="/">
            <Logo logo={logo} tone={invertLogo ? 'light' : 'dark'} />
          </Link>
          <p className="mt-6 max-w-sm leading-relaxed">
            {footerData?.description || brandDefaults.footerDescription}
          </p>
          <ul className="mt-6 flex gap-2">
            {socialLinks.map(({ platform, url }) => (
              <li key={url}>
                <a
                  aria-label={socialLabels[platform]}
                  className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand"
                  href={url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SocialIcon className="size-5" platform={platform} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Navegación */}
        {links.length > 0 && (
          <nav aria-label="Pie de página" className="lg:col-span-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
              {footerData?.navTitle || brandDefaults.footerNavTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    className="transition-colors hover:text-white"
                    href={item.href}
                    {...(item.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Contacto */}
        <div className="lg:col-span-4">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
            {footerData?.contactTitle || brandDefaults.footerContactTitle}
          </h2>
          <ul className="mt-5 space-y-4">
            {email && (
              <li>
                <a
                  className="flex items-start gap-3 transition-colors hover:text-white"
                  href={`mailto:${email}`}
                >
                  <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-sun" />
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a
                  className="flex items-start gap-3 transition-colors hover:text-white"
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                >
                  <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-sun" />
                  {phone}
                </a>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-sun" />
                <span className="whitespace-pre-line">{address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-6 text-sm text-white/60 md:flex-row md:justify-between">
          <p>{copyright}</p>
          <p>{footerData?.legend || brandDefaults.footerLegend}</p>
        </div>
      </div>
    </footer>
  )
}
