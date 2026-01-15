'use client'

import { useDroppable } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import { timelineVariants } from './const'
import { TimelineClip } from './TimelineClip'
import { TimelineRuler } from './TimelineRuler'
import type { TimelineProps } from './type'

import { Typography } from '@/components/ui/Typography'

const styles = timelineVariants()

/** タイムラインのドロップゾーンID */
export const TIMELINE_DROPPABLE_ID = 'timeline-droppable'

/**
 * タイムラインコンポーネント
 * クリップの表示、選択、並び替え、削除を提供
 * ドロップゾーンとして機能し、ClipPanelからのドラッグを受け付ける
 */
export const Timeline = ({ clips, selectedClipId, onSelectClip, onDeleteClip }: TimelineProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: TIMELINE_DROPPABLE_ID,
  })

  return (
    <div className={styles.container()}>
      <div className={styles.content()}>
        {/* 時間目盛り */}
        <TimelineRuler />

        {/* クリップトラック（ドロップゾーン） */}
        <div
          ref={setNodeRef}
          className={`${styles.track()} ${isOver ? 'transition-colors bg-orange-100 dark:ring-orange-400/50 dark:bg-orange-950/30' : ''}`}
        >
          {clips.length === 0 ? (
            <div className={styles.emptyState()}>
              <Typography as="span" size="sm" variant="description">
                {isOver ? 'ドロップしてクリップを追加' : 'クリップをドラッグして追加'}
              </Typography>
            </div>
          ) : (
            <SortableContext
              items={clips.map((c) => c.uid)}
              strategy={horizontalListSortingStrategy}
            >
              <div className={styles.clipList()}>
                {clips.map((clip, index) => (
                  <TimelineClip
                    key={clip.uid}
                    clip={clip}
                    sortableId={clip.uid}
                    isSelected={clip.id === selectedClipId}
                    onSelect={() => onSelectClip(clip.id)}
                    onDelete={() => onDeleteClip(index)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  )
}
