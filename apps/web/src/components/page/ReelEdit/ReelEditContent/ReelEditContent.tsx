'use client'

import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useCallback, useState } from 'react'

import { ClipPanel } from '../ClipPanel'
import { CLIP_PANEL_DRAGGABLE_PREFIX } from '../ClipPanel/ClipThumbnail'
import { HeaderSection } from '../HeaderSection'
import { useReelEdit } from '../hooks/useReelEdit'
import { useSelectedClip } from '../hooks/useSelectedClip'
import { useTimelineClips } from '../hooks/useTimelineClips'
import { InfoPanel } from '../InfoPanel'
import { PreviewSection } from '../PreviewSection'
import { Timeline, TIMELINE_DROPPABLE_ID } from '../Timeline'

import { reelEditContentVariants } from './const'
import type { ReelEditContentProps } from './type'

import type { ShowReelClip } from '@/client/api/model'
import { Typography } from '@/components/ui/Typography'

const styles = reelEditContentVariants()

/**
 * リール編集のメインコンテンツ（Client Component）
 * 全体のレイアウトと状態管理を担当
 */
export const ReelEditContent = ({ reelId }: ReelEditContentProps) => {
  const {
    reel,
    clips: serverClips,
    isUpdatingName,
    mutateReel,
    handleUpdateName,
    handleAddClip,
    handleDeleteClip,
    handleReorderClips,
  } = useReelEdit(reelId)

  const { clips, reorderClips, resetOrder } = useTimelineClips(serverClips)
  const { selectedClipId, selectClip } = useSelectedClip()

  // ドラッグ中のクリップ
  const [activeClip, setActiveClip] = useState<ShowReelClip | null>(null)

  // 選択中のクリップを取得
  const selectedClip = clips.find((clip) => clip.id === selectedClipId) ?? null

  // DnDセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  /** ドラッグ開始時のハンドラー */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    // activeのdataからクリップ情報を取得
    const clip = active.data.current?.clip as ShowReelClip | undefined
    setActiveClip(clip ?? null)
  }, [])

  /** ドラッグ中のハンドラー（リアルタイムで並び替えをプレビュー） */
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event

      if (!over) return

      const activeId = String(active.id)
      const overId = String(over.id)

      // ClipPanelからのドラッグは無視（Timeline内の並び替えのみ処理）
      if (activeId.startsWith(CLIP_PANEL_DRAGGABLE_PREFIX)) return

      // 同じアイテムの場合は無視
      if (activeId === overId) return

      // Timelineのドロップゾーン自体へのオーバーは無視
      if (overId === TIMELINE_DROPPABLE_ID) return

      const oldIndex = clips.findIndex((clip) => clip.uid === activeId)
      const newIndex = clips.findIndex((clip) => clip.uid === overId)

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newOrder = arrayMove(clips, oldIndex, newIndex)
        reorderClips(newOrder)
      }
    },
    [clips, reorderClips]
  )

  /** ドラッグ終了時のハンドラー */
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

      // ドラッグ中のクリップをリセット
      setActiveClip(null)

      if (!over) return

      const activeId = String(active.id)
      const overId = String(over.id)

      // ClipPanelからTimelineへのドロップ
      if (activeId.startsWith(CLIP_PANEL_DRAGGABLE_PREFIX) && overId === TIMELINE_DROPPABLE_ID) {
        const clipId = activeId.replace(CLIP_PANEL_DRAGGABLE_PREFIX, '')
        await handleAddClip(clipId)
        mutateReel()
        return
      }

      // Timeline内での並び替え完了時（サーバーに永続化）
      // 注: 並び替え自体はonDragOverで既に行われている
      if (!activeId.startsWith(CLIP_PANEL_DRAGGABLE_PREFIX)) {
        const clipIds = clips.map((clip) => clip.id)
        try {
          await handleReorderClips(clipIds)
        } catch (error) {
          console.error('クリップの並び替えに失敗しました:', error)
          resetOrder() // ローカル状態をリセット（サーバーデータに戻す）
        }
      }
    },
    [clips, handleAddClip, handleReorderClips, resetOrder, mutateReel]
  )

  /** ドラッグキャンセル時のハンドラー */
  const handleDragCancel = useCallback(() => {
    setActiveClip(null)
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className={styles.container()}>
        {/* ヘッダー */}
        <HeaderSection
          name={reel?.name ?? ''}
          onUpdateName={handleUpdateName}
          isUpdating={isUpdatingName}
        />

        {/* メインエリア */}
        <div className={styles.mainArea()}>
          {/* 左パネル: 互換クリップ一覧 */}
          <ClipPanel reelId={reelId} reel={reel} />

          {/* 中央: プレビュー */}
          <PreviewSection selectedClip={selectedClip} />

          {/* 右パネル: リール情報 */}
          <InfoPanel reel={reel} />
        </div>

        {/* タイムライン */}
        <Timeline
          clips={clips}
          selectedClipId={selectedClipId}
          onSelectClip={selectClip}
          onDeleteClip={handleDeleteClip}
        />
      </div>

      {/* ドラッグ中のオーバーレイ */}
      <DragOverlay dropAnimation={null}>
        {activeClip ? (
          <div className="flex h-16 w-40 cursor-grabbing flex-col justify-center rounded border-2 border-primary-500 bg-neutral-200 px-2 shadow-lg dark:bg-neutral-800">
            <Typography as="span" size="sm" className="truncate">
              {activeClip.name}
            </Typography>
            <Typography as="span" size="xs" variant="description" className="truncate">
              {activeClip.duration}
            </Typography>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
