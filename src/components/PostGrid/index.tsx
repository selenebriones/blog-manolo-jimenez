import React from 'react'

import { PostCard, type PostCardData } from '@/components/PostCard'
import { cn } from '@/utilities/ui'

type Props = {
  posts: PostCardData[]
  showExcerpt?: boolean
  className?: string
}

/** Cuadrícula responsiva de tarjetas: 1 columna en móvil, 2 en tablet y 3 en escritorio. */
export const PostGrid: React.FC<Props> = ({ posts, showExcerpt, className }) => (
  <ul className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8', className)}>
    {posts.map((post, index) => (
      <li key={post.slug ?? index}>
        {/* Las 3 primeras suelen verse sin scroll: se cargan con prioridad */}
        <PostCard post={post} priority={index < 3} showExcerpt={showExcerpt} />
      </li>
    ))}
  </ul>
)
