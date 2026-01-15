/**
 * API テスト用のセットアップファイル
 *
 * 各テスト実行前にインメモリDBをセットアップし、グローバル変数で共有
 */
import { resolve } from 'node:path'

import { setupTestDatabase, type DatabaseClient } from '@database/core'
import { beforeEach } from 'vitest'

/**
 * @database/core パッケージのマイグレーションフォルダパス
 */
const MIGRATIONS_FOLDER = resolve(process.cwd(), '../../databases/core/drizzle')

/**
 * テスト用DBクライアントを保持するグローバル変数
 *
 * @deprecated 直接使用しないでください。代わりに `getTestDB()` を使用してください。
 * @see {@link file://./src/test/database.ts} getTestDB
 */
declare global {
  var __TEST_DB__: DatabaseClient
}

beforeEach(() => {
  globalThis.__TEST_DB__ = setupTestDatabase(MIGRATIONS_FOLDER)
})
