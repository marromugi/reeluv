import 'vitest'

declare module 'vitest/browser' {
  interface BrowserCommands {
    vrtTest: ([string, ComposedStoryFn]) => void
  }
}

/**
 * API テスト用グローバル変数
 * vitest.setup.api.ts で設定される
 *
 * @deprecated 直接使用しないでください。代わりに `getTestDB()` を使用してください。
 * @see {@link file://../test/database.ts} getTestDB
 */
declare global {
  var __TEST_DB__: import('@database/core').DatabaseClient
}
