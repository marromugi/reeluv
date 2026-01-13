import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import * as schema from '../schema'

export type DatabaseClient = BetterSQLite3Database<typeof schema>

/**
 * SQLiteデータベースクライアントを作成する
 *
 * @param databasePath - データベースファイルのパス
 * @returns Drizzle ORMクライアント
 *
 * @example
 * ```typescript
 * const db = createDatabaseClient('./data.db')
 * const showReels = await db.query.showReels.findMany()
 * ```
 */
export function createDatabaseClient(databasePath: string): DatabaseClient {
  const sqlite = new Database(databasePath)

  // WALモードを有効化（パフォーマンス向上）
  sqlite.pragma('journal_mode = WAL')

  return drizzle(sqlite, { schema })
}
