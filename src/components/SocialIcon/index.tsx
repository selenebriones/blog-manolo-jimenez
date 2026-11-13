import { Facebook, Instagram, Youtube, type LucideIcon } from 'lucide-react'
import React from 'react'

import type { Footer } from '@/payload-types'

export type SocialPlatform = NonNullable<Footer['socialLinks']>[number]['platform']

type IconProps = { className?: string }

/** Logotipo de X (lucide solo trae el pájaro de Twitter). */
const XIcon: React.FC<IconProps> = ({ className }) => (
  <svg aria-hidden className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

/** Logotipo de TikTok (no existe en lucide). */
const TikTokIcon: React.FC<IconProps> = ({ className }) => (
  <svg aria-hidden className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

const icons: Record<SocialPlatform, LucideIcon | React.FC<IconProps>> = {
  facebook: Facebook,
  x: XIcon,
  instagram: Instagram,
  youtube: Youtube,
  tiktok: TikTokIcon,
}

export const socialLabels: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  x: 'X',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export const SocialIcon: React.FC<{ platform: SocialPlatform; className?: string }> = ({
  platform,
  className,
}) => {
  const Icon = icons[platform] ?? Facebook
  return <Icon aria-hidden className={className} />
}

/**
 * Usuario de la red a partir de la liga, para mostrarlo en las tarjetas:
 * `https://x.com/manolojim` → `@manolojim`. Ignora parámetros como `?hl=es`.
 */
export const socialHandle = (url: string): string | null => {
  try {
    const segment = new URL(url).pathname.split('/').filter(Boolean)[0]
    return segment ? `@${decodeURIComponent(segment).replace(/^@/, '')}` : null
  } catch {
    return null
  }
}
