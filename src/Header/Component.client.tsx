'use client'

import { ChevronDown, FileText, Mail, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

import { Logo } from '@/components/Logo/Logo'
import { SocialIcon, socialLabels, type SocialPlatform } from '@/components/SocialIcon'
import type { ResolvedLink } from '@/utilities/resolveLink'
import type { LogoData } from './brandDefaults'
import { cn } from '@/utilities/ui'
import { hasChildren, type NavItem, type NavLink } from './navigation'

type Props = {
  navItems: NavItem[]
  cta: ResolvedLink
  email: string | null
  socialLinks: { platform: SocialPlatform; url: string }[]
  logo: LogoData
  topBarText: string
  topBarTextMobile: string
}

/** Un enlace está activo si coincide la ruta o si es una sección padre (p. ej. /posts/...). */
const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

const isItemActive = (pathname: string, item: NavItem) =>
  hasChildren(item)
    ? item.children.some((child) => isActive(pathname, child.href))
    : isActive(pathname, item.href)

const newTabProps = (link: NavLink) =>
  link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

const isFile = (href: string) => /\.(pdf|docx?|xlsx?|pptx?)(\?|$)/i.test(href)

/**
 * Botón destacado del header. Los enlaces de correo o teléfono (mailto:, tel:) y los externos
 * van como <a> normal; las rutas del sitio usan <Link> para navegar sin recargar.
 */
const CtaLink: React.FC<{ cta: ResolvedLink; className: string }> = ({ cta, className }) => {
  const isExternal = /^(mailto:|tel:|https?:\/\/)/i.test(cta.href)
  const newTab = cta.newTab || /^https?:\/\//i.test(cta.href)

  if (isExternal) {
    return (
      <a
        className={className}
        href={cta.href}
        {...(newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      >
        {cta.label}
      </a>
    )
  }

  return (
    <Link className={className} href={cta.href}>
      {cta.label}
    </Link>
  )
}

/** Estilo común de las pestañas de escritorio, con el subrayado amarillo en la activa. */
const desktopTabClasses = (active: boolean) =>
  cn(
    'relative flex items-center gap-1 whitespace-nowrap px-3 py-2 font-medium transition-colors hover:text-brand xl:px-4',
    'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-sun after:transition-transform xl:after:inset-x-4',
    active ? 'text-brand after:scale-x-100' : 'text-ink after:scale-x-0',
  )

/**
 * Pestaña con subpestañas (escritorio).
 * Se abre al pasar el cursor o al hacer clic/Enter; se cierra con Escape, al salir o al
 * hacer clic fuera. El botón expone `aria-expanded` para lectores de pantalla.
 */
const DesktopDropdown: React.FC<{
  item: { label: string; children: NavLink[] }
  active: boolean
}> = ({ item, active }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  return (
    <li
      className="relative"
      onBlur={(event) => {
        // Cierra al salir con Tab del bloque completo
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false)
      }}
      onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      ref={ref}
    >
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={desktopTabClasses(active)}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {item.label}
        <ChevronDown
          aria-hidden
          className={cn('size-4 transition-transform', open && 'rotate-180')}
        />
      </button>

      {/* `pt-2` deja un puente invisible para que el hover no se pierda entre botón y panel */}
      <div className={cn('absolute left-0 top-full z-50 pt-2', !open && 'hidden')} id={panelId}>
        <ul className="min-w-64 overflow-hidden rounded-lg border border-border bg-white py-2 shadow-card-hover">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                className="flex items-center gap-3 px-4 py-2.5 text-ink transition-colors hover:bg-surface hover:text-brand"
                href={child.href}
                onClick={() => setOpen(false)}
                {...newTabProps(child)}
              >
                {isFile(child.href) && (
                  <FileText aria-hidden className="size-4 shrink-0 text-sun" />
                )}
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

/** Pestaña con subpestañas (móvil): se despliega en línea, como acordeón. */
const MobileDropdown: React.FC<{
  item: { label: string; children: NavLink[] }
  active: boolean
}> = ({ item, active }) => {
  const [open, setOpen] = useState(active)
  const panelId = useId()

  return (
    <li>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between border-l-4 px-4 py-3 text-left font-medium',
          active ? 'border-sun text-brand' : 'border-transparent text-ink',
        )}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {item.label}
        <ChevronDown
          aria-hidden
          className={cn('size-5 transition-transform', open && 'rotate-180')}
        />
      </button>
      <ul className={cn('mb-2 ml-4 border-l border-border', !open && 'hidden')} id={panelId}>
        {item.children.map((child) => (
          <li key={child.href}>
            <Link
              className="flex items-center gap-3 px-5 py-2.5 text-ink-muted hover:text-brand"
              href={child.href}
              {...newTabProps(child)}
            >
              {isFile(child.href) && <FileText aria-hidden className="size-4 shrink-0 text-sun" />}
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}

/**
 * Header institucional (inspirado en CityGov):
 * 1. Barra superior en color primario con adscripción, correo y redes.
 * 2. Barra principal blanca y fija con logo, menú, búsqueda y botón destacado.
 * 3. Debajo de 1280 px (móvil, tablet y laptops chicas) el menú se despliega en un panel
 *    bajo la barra: con 6 pestañas no caben en una sola línea.
 *
 * Las pestañas vienen del global "Encabezado" del admin (nombres, orden y subpestañas).
 */
export const HeaderClient: React.FC<Props> = ({
  navItems,
  cta,
  email,
  socialLinks,
  logo,
  topBarText,
  topBarTextMobile,
}) => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Cierra el menú móvil al navegar
  useEffect(() => setMenuOpen(false), [pathname])

  // Sombra en la barra principal solo cuando ya hay scroll (se ve más ligera arriba)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* 1. Barra superior */}
      <div className="bg-brand text-sm text-white">
        <div className="container flex h-10 items-center justify-between gap-4">
          <p className="truncate font-medium">
            <span className="md:hidden">{topBarTextMobile}</span>
            <span className="hidden md:inline">{topBarText}</span>
          </p>
          <div className="flex items-center gap-4">
            {email && (
              <a
                className="hidden items-center gap-2 opacity-90 transition-opacity hover:opacity-100 sm:inline-flex"
                href={`mailto:${email}`}
              >
                <Mail aria-hidden className="size-4" />
                {email}
              </a>
            )}
            <ul className="flex items-center gap-1">
              {socialLinks.map(({ platform, url }) => (
                <li key={url}>
                  <a
                    aria-label={socialLabels[platform]}
                    className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                    href={url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <SocialIcon className="size-4" platform={platform} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Barra principal */}
      <header
        className={cn(
          'sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow',
          scrolled ? 'border-transparent shadow-card' : 'border-border',
        )}
      >
        <div className="container flex h-20 items-center justify-between gap-6">
          <Link aria-label="Ir al inicio" className="shrink-0" href="/">
            <Logo loading="eager" logo={logo} priority="high" />
          </Link>

          {navItems.length > 0 && (
            <nav aria-label="Principal" className="hidden xl:block">
              <ul className="flex items-center">
                {navItems.map((item) => {
                  const active = isItemActive(pathname, item)

                  if (hasChildren(item)) {
                    return <DesktopDropdown active={active} item={item} key={item.label} />
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        aria-current={active ? 'page' : undefined}
                        className={desktopTabClasses(active)}
                        href={item.href}
                        {...newTabProps(item)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}

          <div className="flex items-center gap-2">
            <Link
              aria-label="Buscar"
              className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface hover:text-brand"
              href="/search"
            >
              <Search aria-hidden className="size-5" />
            </Link>

            <CtaLink
              className="hidden whitespace-nowrap rounded-md bg-brand px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-dark sm:inline-flex"
              cta={cta}
            />

            {navItems.length > 0 && (
              <button
                aria-controls="menu-movil"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface xl:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                type="button"
              >
                {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            )}
          </div>
        </div>

        {/* 3. Menú móvil */}
        <nav
          aria-label="Principal (móvil)"
          className={cn('border-t border-border bg-white xl:hidden', !menuOpen && 'hidden')}
          id="menu-movil"
        >
          <ul className="container flex max-h-[calc(100vh-7.5rem)] flex-col overflow-y-auto py-4">
            {navItems.map((item) => {
              const active = isItemActive(pathname, item)

              if (hasChildren(item)) {
                return <MobileDropdown active={active} item={item} key={item.label} />
              }

              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block border-l-4 px-4 py-3 font-medium',
                      active ? 'border-sun text-brand' : 'border-transparent text-ink',
                    )}
                    href={item.href}
                    {...newTabProps(item)}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
            <li className="mt-3 px-4 sm:hidden">
              <CtaLink
                className="flex justify-center rounded-md bg-brand px-5 py-3 font-semibold text-white"
                cta={cta}
              />
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
