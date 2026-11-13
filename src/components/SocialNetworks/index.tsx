import { ArrowUpRight } from 'lucide-react'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import {
  SocialIcon,
  socialHandle,
  socialLabels,
  type SocialPlatform,
} from '@/components/SocialIcon'

type Props = {
  title: string
  description?: string | null
  /** Las mismas ligas de Pie de página → Redes sociales, en ese orden. */
  links: { platform: SocialPlatform; url: string }[]
}

/**
 * "Síguenos en redes sociales": texto a la izquierda y una tarjeta por red a la derecha
 * (icono, nombre y usuario); cada tarjeta abre el perfil en otra pestaña.
 * En celular las tarjetas van debajo del texto, de dos en dos.
 */
export const SocialNetworks: React.FC<Props> = ({ title, description, links }) => {
  if (!links.length) return null

  return (
    <section aria-labelledby="redes-titulo" className="bg-white py-16 md:py-24">
      <div className="container grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <SectionHeading
          className="mb-0 md:mb-0"
          description={description ?? undefined}
          eyebrow="Redes sociales"
          id="redes-titulo"
          title={title}
        />

        <ul className="grid grid-cols-2 gap-4 md:gap-6">
          {links.map(({ platform, url }) => {
            const handle = socialHandle(url)

            return (
              <li key={`${platform}-${url}`}>
                <a
                  className="group relative flex h-full flex-col gap-4 rounded-lg bg-white p-5 shadow-card ring-1 ring-border transition duration-300 hover:-translate-y-1 hover:shadow-card-hover md:flex-row md:items-center md:p-6"
                  href={url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand transition-colors group-hover:bg-brand group-hover:text-white md:size-14">
                    <SocialIcon className="size-6" platform={platform} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-semibold text-ink">
                      {socialLabels[platform]}
                    </span>
                    {handle && (
                      <span className="block truncate text-sm text-ink-muted">{handle}</span>
                    )}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="absolute right-4 top-4 size-5 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                  />
                  <span className="sr-only">(abre en otra pestaña)</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
