import type { ShowReelListItem } from '@/client/api/model'

export type ReelCardProps = {
  reel: ShowReelListItem
  /** アニメーション遅延用のインデックス */
  index?: number
}
