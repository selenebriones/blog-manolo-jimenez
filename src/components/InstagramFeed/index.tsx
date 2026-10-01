import { Instagram } from 'lucide-react'
import React from 'react'

import { SectionHeading } from '@/components/SectionHeading'
import { normalizeInstagramUrl } from '@/utilities/instagram'
import { InstagramEmbed } from './InstagramEmbed'

type Props = {
  title: string
  description?: string | null
  buttonLabel?: string | null
  profileUrl?: string | null
  /** Ligas de publicaciones (máx. 3), elegidas en el admin. */
  postUrls: string[]
}

/**
 * "Síguenos en Instagram": encabezado con botón al perfil y 3 publicaciones elegidas en el
 * admin, insertadas con el código oficial de Instagram (3 columnas; 2 en tablet; 1 en celular).
 */
export const InstagramFeed: React.FC<Props> = ({
  title,
  description,
  buttonLabel,
  profileUrl,
  postUrls,
}) => {
  const urls = postUrls
    .map(normalizeInstagramUrl)
    .filter((url): url is string => url !== null)
    .slice(0, 3)

  if (!urls.length) return null

  return (
    <section aria-labelledby="instagram-titulo" className="bg-surface py-16 md:py-24">
      <div className="container">
        <SectionHeading
          action={
            buttonLabel &&
            profileUrl && (
              <a
                className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
                href={profileUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Instagram aria-hidden className="size-5" />
                {buttonLabel}
              </a>
            )
          }
          description={description ?? undefined}
          eyebrow="Redes sociales"
          id="instagram-titulo"
          title={title}
        />

        <ul className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {urls.map((url) => (
            <li className="min-w-0" key={url}>
              <InstagramEmbed url={url} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
