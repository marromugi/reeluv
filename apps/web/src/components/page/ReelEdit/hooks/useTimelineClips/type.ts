import type { ShowReelClip } from '@/client/api/model'

/** リール内でのユニークIDを持つクリップ */
export type TimelineClipItem = ShowReelClip & {
  /** リール内でのユニークID（ソート用） */
  uid: string
}

/** 状態の型 */
export type State = {
  /** 現在のローカル並び順（nullの場合はサーバーデータを使用） */
  localOrder: TimelineClipItem[] | null
}

/** アクションの型 */
export type Action = { type: 'reorder'; clips: TimelineClipItem[] } | { type: 'reset' }
