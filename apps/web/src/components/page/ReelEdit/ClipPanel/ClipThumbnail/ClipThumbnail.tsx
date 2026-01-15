'use client'

import { useDraggable } from '@dnd-kit/core'

import { clipThumbnailVariants } from './const'
import type { ClipThumbnailProps } from './type'

import { Typography } from '@/components/ui/Typography'

/** ドラッグ元を識別するためのプレフィックス */
export const CLIP_PANEL_DRAGGABLE_PREFIX = 'clip-panel-'

/**
 * クリップのサムネイル表示（ドラッグ可能）
 */
export const ClipThumbnail = ({ clip }: ClipThumbnailProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${CLIP_PANEL_DRAGGABLE_PREFIX}${clip.id}`,
    data: { clip, source: 'clip-panel' },
  })

  return (
    <div
      ref={setNodeRef}
      className={clipThumbnailVariants({ isDragging })}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center justify-between gap-2">
        <Typography as="span" size="sm" className="truncate">
          {clip.name}
        </Typography>
        <div className="flex shrink-0 gap-1">
          <span className="rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {clip.videoStandard}
          </span>
          <span className="rounded-md bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {clip.videoDefinition}
          </span>
        </div>
      </div>
      <Typography as="span" size="xs" variant="description" className="truncate">
        {clip.duration}
      </Typography>
    </div>
  )
}
