import { relations } from 'drizzle-orm'

import { showReelClips } from './show-reel-clips.schema'
import { showReels } from './show-reels.schema'
import { videoClips } from './video-clips.schema'

/**
 * Show Reel のリレーション
 */
export const showReelsRelations = relations(showReels, ({ many }) => ({
  showReelClips: many(showReelClips),
}))

/**
 * Video Clip のリレーション
 */
export const videoClipsRelations = relations(videoClips, ({ many }) => ({
  showReelClips: many(showReelClips),
}))

/**
 * Show Reel Clips (中間テーブル) のリレーション
 */
export const showReelClipsRelations = relations(showReelClips, ({ one }) => ({
  showReel: one(showReels, {
    fields: [showReelClips.showReelId],
    references: [showReels.id],
  }),
  videoClip: one(videoClips, {
    fields: [showReelClips.videoClipId],
    references: [videoClips.id],
  }),
}))
