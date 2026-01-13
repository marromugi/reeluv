import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core'

import { showReels } from './show-reels.schema'
import { videoClips } from './video-clips.schema'

/**
 * Show Reel と Video Clip の中間テーブル
 * ショーリール内のクリップの順序も管理
 */
export const showReelClips = sqliteTable(
  'show_reel_clips',
  {
    showReelId: text('show_reel_id')
      .notNull()
      .references(() => showReels.id, { onDelete: 'cascade' }),
    videoClipId: text('video_clip_id')
      .notNull()
      .references(() => videoClips.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(), // クリップの表示順序
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    primaryKey({ columns: [table.showReelId, table.videoClipId] }),
    index('show_reel_clips_show_reel_id_idx').on(table.showReelId),
    index('show_reel_clips_video_clip_id_idx').on(table.videoClipId),
  ]
)

export type ShowReelClip = typeof showReelClips.$inferSelect
export type NewShowReelClip = typeof showReelClips.$inferInsert
