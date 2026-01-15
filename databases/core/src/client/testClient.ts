import Database from 'better-sqlite3'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

import * as schema from '../schema'

import type { DatabaseClient } from './sqlite'

/**
 * テスト用のインメモリDBクライアントを作成
 */
export function createTestDatabaseClient(): DatabaseClient {
  const sqlite = new Database(':memory:')
  return drizzle(sqlite, { schema })
}

/**
 * マイグレーションを実行してテーブルを作成
 *
 * @param db - データベースクライアント
 * @param migrationsFolder - マイグレーションファイルのディレクトリパス
 *
 * @example
 * ```typescript
 * import { resolve } from 'node:path'
 *
 * const migrationsFolder = resolve(import.meta.dirname, 'node_modules/@reeluv/database-core/drizzle')
 * setupTestTables(db, migrationsFolder)
 * ```
 */
export function setupTestTables(
  db: BetterSQLite3Database<typeof schema>,
  migrationsFolder: string
): void {
  migrate(db, { migrationsFolder })
}

/**
 * テスト用のDBセットアップ（クライアント作成＋マイグレーション実行）
 *
 * @param migrationsFolder - マイグレーションファイルのディレクトリパス
 *
 * @example
 * ```typescript
 * import { resolve } from 'node:path'
 *
 * const migrationsFolder = resolve(import.meta.dirname, 'node_modules/@reeluv/database-core/drizzle')
 * const db = setupTestDatabase(migrationsFolder)
 * ```
 */
export function setupTestDatabase(migrationsFolder: string): DatabaseClient {
  const db = createTestDatabaseClient()
  setupTestTables(db, migrationsFolder)
  return db
}
