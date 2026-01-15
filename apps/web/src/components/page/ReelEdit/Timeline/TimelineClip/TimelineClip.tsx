'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { timelineClipVariants } from './const'
import type { TimelineClipProps } from './type'

import { Close } from '@/components/icon'
import { IconButton } from '@/components/ui/IconButton'
import { Typography } from '@/components/ui/Typography'

/**
 * タイムライン上の個別クリップ
 * ドラッグ＆ドロップ、選択、削除をサポート
 */
export const TimelineClip = ({
  clip,
  sortableId,
  isSelected,
  onSelect,
  onDelete,
}: TimelineClipProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    // スワップ時のスムーズなアニメーション
    transition: transition ?? 'transform 200ms ease',
  }

  const styles = timelineClipVariants({ isSelected, isDragging })

  /** 削除ボタンのクリックハンドラ */
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // クリップ選択を防ぐ
    e.preventDefault() // ドラッグイベントを防ぐ
    onDelete()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.container()}
      onClick={onSelect}
      {...attributes}
      {...listeners}
    >
      {/* 削除ボタン（ホバー時に表示） */}
      <div
        className={styles.deleteButton()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <IconButton
          icon={Close}
          variant="solid"
          theme="alert"
          size="xs"
          aria-label="クリップを削除"
          onClick={handleDelete}
        />
      </div>

      {/* クリップ情報 */}
      <Typography as="span" size="sm" className="truncate">
        {clip.name}
      </Typography>
      <Typography as="span" size="xs" variant="description">
        {clip.duration}
      </Typography>
    </div>
  )
}
