import type { DatabaseClient } from '@database/core'

/**
 * テスト用のデータベースクライアントを取得
 *
 * vitest.setup.api.ts で各テスト実行前にセットアップされた
 * インメモリDBクライアントを返す
 *
 * @example
 * ```typescript
 * import { getTestDB } from '@/test/database'
 *
 * beforeEach(() => {
 *   repository = new DrizzleVideoClipRepository(getTestDB())
 * })
 * ```
 */
export function getTestDB(): DatabaseClient {
  return globalThis.__TEST_DB__
}
