import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

import { generateId } from '../util/id'

/**
 * ビデオ規格
 * - PAL: 25fps (1フレーム = 40ミリ秒)
 * - NTSC: 30fps
 */
export const videoStandards = ['PAL', 'NTSC'] as const
export type VideoStandard = (typeof videoStandards)[number]

/**
 * ビデオ解像度
 * - SD: 標準解像度
 * - HD: 高解像度
 */
export const videoDefinitions = ['SD', 'HD'] as const
export type VideoDefinition = (typeof videoDefinitions)[number]

/**
 * Show Reel テーブル
 * 複数のビデオクリップをまとめたショーリール
 */
export const showReels = sqliteTable('show_reels', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId()),
  name: text('name').notNull(),
  videoStandard: text('video_standard', { enum: videoStandards }).notNull(),
  videoDefinition: text('video_definition', { enum: videoDefinitions }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export type ShowReel = typeof showReels.$inferSelect
export type NewShowReel = typeof showReels.$inferInsert
