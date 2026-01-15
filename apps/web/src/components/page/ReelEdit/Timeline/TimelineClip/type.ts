import type { ShowReelClip } from '@/client/api/model'

/** TimelineClip の Props */
export type TimelineClipProps = {
  clip: ShowReelClip
  /** SortableContext用のユニークID（同一クリップが複数存在する場合に使用） */
  sortableId: string
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}
