import { setupServer } from 'msw/node'

import { handlers } from './handlers'

/**
 * テスト用MSWサーバー
 *
 * Vitestなどのテスト環境でAPIをモックするために使用
 *
 * @example
 * // vitest.setup.tsで設定
 * import { server } from '@/client/msw/server'
 *
 * beforeAll(() => server.listen())
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 */
export const server = setupServer(...handlers)
