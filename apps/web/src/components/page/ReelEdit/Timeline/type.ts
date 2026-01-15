import type { TimelineClipItem } from '../hooks/useTimelineClips'

/** Timeline の Props */
export type TimelineProps = {
  clips: TimelineClipItem[]
  selectedClipId: string | null
  onSelectClip: (clipId: string) => void
  onDeleteClip: (index: number) => Promise<void>
}
