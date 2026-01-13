import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

import { generateId } from '../util/id'

import { videoStandards, videoDefinitions } from './show-reels.schema'

/**
 * Video Clip テーブル
 * 個々のビデオクリップ情報を保持
 *
 * タイムコードは文字列として保存 (HH:MM:ss:ff 形式)
 * - HH: 時
 * - MM: 分
 * - ss: 秒
 * - ff: フレーム
 */
export const videoClips = sqliteTable(
  'video_clips',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => generateId()),
    name: text('name').notNull(),
    description: text('description'),
    videoStandard: text('video_standard', { enum: videoStandards }).notNull(),
    videoDefinition: text('video_definition', { enum: videoDefinitions }).notNull(),
    startTimecode: text('start_timecode').notNull(), // HH:MM:ss:ff 形式
    endTimecode: text('end_timecode').notNull(), // HH:MM:ss:ff 形式
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index('video_clips_standard_definition_idx').on(table.videoStandard, table.videoDefinition),
  ]
)

export type VideoClip = typeof videoClips.$inferSelect
export type NewVideoClip = typeof videoClips.$inferInsert
