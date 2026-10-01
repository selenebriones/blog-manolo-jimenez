import { Facebook, Instagram, Twitter, Youtube, type LucideIcon } from 'lucide-react'
import React from 'react'

import type { Footer } from '@/payload-types'

export type SocialPlatform = NonNullable<Footer['socialLinks']>[number]['platform']

const icons: Record<SocialPlatform, LucideIcon> = {
  facebook: Facebook,
  x: Twitter,
  instagram: Instagram,
  youtube: Youtube,
}

export const socialLabels: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  x: 'X (Twitter)',
  instagram: 'Instagram',
  youtube: 'YouTube',
}

export const SocialIcon: React.FC<{ platform: SocialPlatform; className?: string }> = ({
  platform,
  className,
}) => {
  const Icon = icons[platform] ?? Facebook
  return <Icon aria-hidden className={className} />
}
