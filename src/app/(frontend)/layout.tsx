import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { Inter, Poppins } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getSiteSettings } from '@/utilities/getSiteSettings'

// Inter para lectura (párrafos, UI) y Poppins para titulares: ambas sans-serif modernas
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  // Favicon: Configuración del sitio → Encabezado → Logotipo y barra superior
  const header = await getCachedGlobal('header', 1)()
  const favicon = header?.favicon && typeof header.favicon === 'object' ? header.favicon : null

  return (
    // El sitio es institucional y solo tiene tema claro
    <html
      className={cn(inter.variable, poppins.variable, GeistMono.variable)}
      data-theme="light"
      lang="es-MX"
      suppressHydrationWarning
    >
      <head>
        {favicon?.url ? (
          <>
            <link href={favicon.url} rel="icon" type={favicon.mimeType ?? undefined} />
            <link href={favicon.url} rel="apple-touch-icon" />
          </>
        ) : (
          <>
            <link href="/favicon.ico" rel="icon" sizes="32x32" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          </>
        )}
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

/** Título, descripción e imagen para compartir: Configuración del sitio → SEO y datos del sitio. */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()
  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      default: site.defaultTitle,
      template: `%s | ${site.siteName}`,
    },
    description: site.description,
    openGraph: mergeOpenGraph(site),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
