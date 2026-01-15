import type { ShowReelClip } from '@/client/api/model'

/** useTimelineDnd のオプション */
export type UseTimelineDndOptions = {
  clips: ShowReelClip[]
  onReorderClips: (newOrder: ShowReelClip[]) => void
}
