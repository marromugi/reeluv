'use client'

import { useCallback, useMemo } from 'react'
import { useSWRConfig } from 'swr'

import type { ShowReelDetailResponse } from '@/client/api/model'
import {
  deleteApiReelsIdClips,
  getGetApiReelsIdKey,
  useGetApiReelsId,
  usePatchApiReelsId,
  usePostApiReelsIdClips,
  usePutApiReelsIdClipsReorder,
} from '@/client/api/reel/reel'

/** fallbackData（Suspense使用時に必須） */
const fallbackData: ShowReelDetailResponse = {
  data: {
    id: '',
    name: '',
    videoStandard: 'NTSC',
    videoDefinition: 'HD',
    clips: [],
    clipCount: 0,
    totalDuration: '00:00:00:00',
    createdAt: '',
    updatedAt: '',
  },
}

/**
 * リール編集の中心フック
 * データ取得、クリップ操作、名前更新を管理
 */
export const useReelEdit = (reelId: string) => {
  const { mutate } = useSWRConfig()

  // リール詳細取得
  const { data } = useGetApiReelsId(reelId, {
    swr: { suspense: true, fallbackData },
  })

  // ミューテーションフック
  const { trigger: updateName, isMutating: isUpdatingName } = usePatchApiReelsId(reelId)
  const { trigger: addClipToReel } = usePostApiReelsIdClips(reelId)
  const { trigger: reorderClips } = usePutApiReelsIdClipsReorder(reelId)

  const reel = data?.data
  const clips = useMemo(() => reel?.clips ?? [], [reel?.clips])

  /** キャッシュを更新 */
  const mutateReel = useCallback(() => {
    mutate(getGetApiReelsIdKey(reelId))
  }, [mutate, reelId])

  /** リール名を更新 */
  const handleUpdateName = useCallback(
    async (name: string) => {
      await updateName({ name })
      mutateReel()
    },
    [updateName, mutateReel]
  )

  /** クリップを追加 */
  const handleAddClip = useCallback(
    async (clipId: string) => {
      await addClipToReel({ clipId })
      mutateReel()
    },
    [addClipToReel, mutateReel]
  )

  /** クリップを削除（インデックス指定） */
  const handleDeleteClip = useCallback(
    async (index: number) => {
      await deleteApiReelsIdClips(reelId, { index })
      mutateReel()
    },
    [reelId, mutateReel]
  )

  /** クリップを並び替え（順序が変更された場合のみ実行） */
  const handleReorderClips = useCallback(
    async (clipIds: string[]) => {
      const currentClipIds = clips.map((clip) => clip.id)
      const hasOrderChanged = clipIds.some((id, index) => id !== currentClipIds[index])

      if (!hasOrderChanged) return

      await reorderClips({ clipIds })
      mutateReel()
    },
    [clips, reorderClips, mutateReel]
  )

  return {
    reel,
    clips,
    isUpdatingName,
    mutateReel,
    handleUpdateName,
    handleAddClip,
    handleDeleteClip,
    handleReorderClips,
  }
}
