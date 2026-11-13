import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { BrandStripe } from '@/components/BrandStripe'
import { HomeBanner } from '@/components/HomeBanner'
// Instagram en pausa (ver el bloque comentado al final de la portada)
// import { InstagramFeed } from '@/components/InstagramFeed'
import { NewsTiles } from '@/components/NewsTiles'
import { postCardSelect } from '@/components/PostCard/select'
import { PostGrid } from '@/components/PostGrid'
import { RotatingBadge } from '@/components/RotatingBadge'
import { SectionHeading } from '@/components/SectionHeading'
import { SocialNetworks } from '@/components/SocialNetworks'
import { homePageDefaults } from '@/HomePage/defaults'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getSiteSettings } from '@/utilities/getSiteSettings'

/**
 * Página de inicio.
 *
 * Estructura (de arriba a abajo; Header y Footer vienen del layout):
 * 1. Banner cargado en el admin (imagen a todo lo ancho, con versión opcional para celular),
 *    seguido de la franja de colores de la marca.
 * 2. "A pasos de gigante": texto de presentación + foto en círculo con la frase girando alrededor.
 * 3. "Coahuila Pa' Delante": las 3 noticias más recientes en mosaico.
 * 4. Más noticias: cuadrícula que continúa después de las 3 del mosaico (sin repetir; cantidad editable).
 * 5. Síguenos en redes sociales: una tarjeta por cada red de Pie de página → Redes sociales.
 *    (Antes era el recuadro de Facebook; el componente FacebookFeed sigue en el proyecto por si se
 *    conecta la API de Meta.)
 * 6. Síguenos en Instagram (en pausa, comentado): 3 publicaciones elegidas en el admin.
 *
 * Textos, cantidad de noticias y visibilidad de cada sección se editan en
 * Configuración del sitio → Página de inicio (global `home-page`).
 *
 * Se regenera cada 10 min y, además, al publicar/editar una noticia o guardar el global.
 */
export const revalidate = 600

/** El mosaico de destacadas es de 3 paneles fijos (una fila a todo lo ancho). */
const HIGHLIGHT_COUNT = 3

/**
 * Mezcla lo guardado en el admin con los textos por defecto: un campo nunca guardado
 * (null/undefined) toma el valor por defecto. Un texto guardado vacío ("") se respeta,
 * así el equipo puede ocultar un botón o enlace dejándolo en blanco.
 */
const withDefaults = <T extends object>(saved: T | null | undefined, defaults: Partial<T>): T =>
  ({
    ...defaults,
    ...Object.fromEntries(
      Object.entries(saved ?? {}).filter(([, value]) => value !== null && value !== undefined),
    ),
  }) as T

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  // depth 1: trae las imágenes del banner ya pobladas
  const settings = await getCachedGlobal('home-page', 1)()

  const banner = withDefaults(settings?.banner, homePageDefaults.banner)
  const highlights = withDefaults(settings?.highlights, homePageDefaults.highlights)
  const ring = withDefaults(settings?.ring, homePageDefaults.ring)
  const ringImage = typeof ring.image === 'object' ? ring.image : null
  const ringBackground = typeof ring.backgroundImage === 'object' ? ring.backgroundImage : null
  const latest = withDefaults(settings?.latest, homePageDefaults.latest)
  const facebook = withDefaults(settings?.facebook, homePageDefaults.facebook)
  // const instagram = withDefaults(settings?.instagram, homePageDefaults.instagram)

  const highlightCount = highlights.enabled ? HIGHLIGHT_COUNT : 0
  const latestCount = latest.enabled ? Number(latest.count) || 9 : 0

  // Una sola consulta: las primeras 3 van al mosaico y las siguientes a la cuadrícula,
  // así ninguna noticia se repite en la portada. `overrideAccess: false` = solo publicadas.
  const footer = await getCachedGlobal('footer', 1)()
  const socialLinks = (footer?.socialLinks ?? []).map(({ platform, url }) => ({ platform, url }))
  // const instagramProfileUrl =
  //   footer?.socialLinks?.find((link) => link.platform === 'instagram')?.url ?? null

  const { docs: recent } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    depth: 1,
    limit: Math.max(highlightCount + latestCount, 1),
    overrideAccess: false,
    select: postCardSelect,
  })

  const highlightPosts = recent.slice(0, highlightCount)
  const latestPosts = recent.slice(highlightCount, highlightCount + latestCount)

  return (
    <>
      <HomeBanner
        image={banner.image}
        mobileImage={banner.mobileImage}
        newTab={banner.newTab}
        url={banner.url}
        welcome={{
          eyebrow: banner.welcomeEyebrow,
          title: banner.welcomeTitle,
          text: banner.welcomeText,
        }}
      />
      <BrandStripe />

      {ring.enabled && ringImage && (
        <RotatingBadge
          backgroundImage={ringBackground}
          image={ringImage}
          buttonLabel={ring.buttonLabel}
          buttonUrl={ring.buttonUrl}
          content={ring.content}
          speed={ring.speed}
          subtitle={ring.subtitle}
          text={ring.text}
          title={ring.title}
        />
      )}

      {highlights.enabled && <NewsTiles posts={highlightPosts} title={highlights.title} />}

      {latest.enabled && latestPosts.length > 0 && (
        <section aria-labelledby="mas-noticias" className="bg-surface py-16 md:py-24">
          <div className="container">
            <SectionHeading
              action={
                latest.viewAllLabel && (
                  <Link
                    className="group inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-dark"
                    href="/posts"
                  >
                    {latest.viewAllLabel}
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                )
              }
              description={latest.description ?? undefined}
              eyebrow={latest.eyebrow ?? undefined}
              id="mas-noticias"
              title={latest.title}
            />

            <PostGrid posts={latestPosts} showExcerpt={Boolean(latest.showExcerpt)} />
          </div>
        </section>
      )}

      {facebook.enabled && (
        <SocialNetworks
          description={facebook.description}
          links={socialLinks}
          title={facebook.title}
        />
      )}

      {/* Instagram en pausa por ahora: para volver a mostrarlo, quitar los comentarios de este
          bloque, del import y de `instagram` / `instagramProfileUrl` más arriba.
      {instagram.enabled && (
        <InstagramFeed
          buttonLabel={instagram.buttonLabel}
          description={instagram.description}
          postUrls={(instagram.posts ?? []).map((post) => post.url)}
          profileUrl={instagramProfileUrl}
          title={instagram.title}
        />
      )} */}
    </>
  )
}

/** La portada usa el título y la descripción del sitio (Configuración del sitio → SEO y datos del sitio). */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()
  return {
    title: { absolute: site.defaultTitle },
    description: site.description,
  }
}
