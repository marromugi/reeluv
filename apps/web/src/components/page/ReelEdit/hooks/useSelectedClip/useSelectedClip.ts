'use client'

import { useCallback, useState } from 'react'

/**
 * 選択中のクリップを管理するフック
 */
export const useSelectedClip = () => {
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)

  /** クリップを選択 */
  const selectClip = useCallback((clipId: string) => {
    setSelectedClipId(clipId)
  }, [])

  /** 選択を解除 */
  const clearSelection = useCallback(() => {
    setSelectedClipId(null)
  }, [])

  /** 選択をトグル */
  const toggleSelection = useCallback((clipId: string) => {
    setSelectedClipId((prev) => (prev === clipId ? null : clipId))
  }, [])

  return {
    selectedClipId,
    selectClip,
    clearSelection,
    toggleSelection,
  }
}
