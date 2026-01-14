import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

/**
 * ブラウザ用MSWワーカー
 *
 * 開発環境でAPIをモックするために使用
 *
 * @example
 * // アプリケーションのエントリーポイントで起動
 * if (process.env.NODE_ENV === 'development') {
 *   const { worker } = await import('@/client/msw/browser')
 *   await worker.start()
 * }
 */
export const worker = setupWorker(...handlers)
