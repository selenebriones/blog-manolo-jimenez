import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import type { Media } from '@/payload-types'

type Node = { type: string; fields?: { blockType?: string; media?: Media | number | null } }

/**
 * Agrupa las fotos seguidas del contenido (bloques "Media" uno tras otro) en un solo nodo
 * `mediaRow`, que se pinta como cuadrícula de 3 por fila (ver RichText → blocks.mediaRow).
 *
 * Solo transforma lo que se muestra: el contenido guardado en Payload no cambia, así que en el
 * admin cada foto sigue siendo un bloque que se puede mover o quitar.
 * Una foto sola (sin otra foto pegada) se deja como está, a todo lo ancho.
 */
export const groupMediaBlocks = (state: DefaultTypedEditorState): DefaultTypedEditorState => {
  const children = (state?.root?.children ?? []) as unknown as Node[]
  const grouped: Node[] = []
  let run: Node[] = []

  const isMedia = (node: Node) =>
    node.type === 'block' &&
    node.fields?.blockType === 'mediaBlock' &&
    typeof node.fields.media === 'object'

  const flush = () => {
    if (run.length >= 2) {
      grouped.push({
        type: 'block',
        version: 2,
        format: '',
        fields: {
          id: `row-${grouped.length}`,
          blockType: 'mediaRow',
          images: run.map((node) => node.fields!.media as Media),
        },
      } as unknown as Node)
    } else {
      grouped.push(...run)
    }
    run = []
  }

  for (const node of children) {
    if (isMedia(node)) run.push(node)
    else {
      flush()
      grouped.push(node)
    }
  }
  flush()

  return {
    ...state,
    root: { ...state.root, children: grouped as unknown as typeof state.root.children },
  }
}
