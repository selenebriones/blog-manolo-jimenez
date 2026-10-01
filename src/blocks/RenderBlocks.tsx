import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GalleryBlock } from '@/blocks/Gallery/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProfileIntroBlock } from '@/blocks/ProfileIntro/Component'
import { ProposalsBlock } from '@/blocks/Proposals/Component'
import { StoryMosaicBlock } from '@/blocks/StoryMosaic/Component'
import { TimelineBlock } from '@/blocks/Timeline/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  gallery: GalleryBlock,
  mediaBlock: MediaBlock,
  profileIntro: ProfileIntroBlock,
  proposals: ProposalsBlock,
  storyMosaic: StoryMosaicBlock,
  timeline: TimelineBlock,
}

/**
 * Bloques con fondo propio de lado a lado (ej. línea de tiempo): si son el último bloque,
 * van pegados al footer, sin el margen inferior de los demás.
 */
const fullBleedBlocks = new Set<string>(['timeline'])

export const endsWithFullBleed = (blocks?: Page['layout'][0][] | null) => {
  const last = blocks?.[blocks.length - 1]
  return Boolean(last && fullBleedBlocks.has(last.blockType))
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const isLastFullBleed = index === blocks.length - 1 && fullBleedBlocks.has(blockType)

              return (
                <div className={isLastFullBleed ? 'mb-0 mt-16' : 'my-16'} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
