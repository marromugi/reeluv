import type { ShowReelDetail } from '@/client/api/model'

/** ClipPanel の Props */
export type ClipPanelProps = {
  reelId: string
  reel: ShowReelDetail | undefined
}
