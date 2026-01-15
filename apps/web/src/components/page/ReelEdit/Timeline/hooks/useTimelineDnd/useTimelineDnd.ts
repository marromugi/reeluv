'use client'

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useState } from 'react'

import type { UseTimelineDndOptions } from './type'

/**
 * タイムラインのドラッグ＆ドロップを管理するフック
 */
export const useTimelineDnd = ({ clips, onReorderClips }: UseTimelineDndOptions) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  /** ドラッグ開始 */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  /** ドラッグ終了 */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (!over || active.id === over.id) return

      const oldIndex = clips.findIndex((clip) => clip.id === active.id)
      const newIndex = clips.findIndex((clip) => clip.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return

      const newOrder = arrayMove(clips, oldIndex, newIndex)
      onReorderClips(newOrder)
    },
    [clips, onReorderClips]
  )

  /** ドラッグキャンセル */
  const handleDragCancel = useCallback(() => {
    setActiveId(null)
  }, [])

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
