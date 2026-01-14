import { createRoute } from '@hono/zod-openapi'

import { ShowReelListResponseSchema } from './schema'

import { GetAllShowReelsUseCase } from '@/api/application/showReel/GetAllShowReelsUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import type { AppContext } from '@/api/route'

/**
 * GET /api/reels ルート定義
 */
export const getReelsRoute = createRoute({
  method: 'get',
  path: '/reels',
  tags: ['Reel'],
  summary: '全てのShowReelを取得',
  description: 'ShowReelの一覧を取得します。クリップの詳細は含まれません。',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ShowReelListResponseSchema,
        },
      },
      description: 'ShowReel一覧',
    },
  },
})

/**
 * GET /api/reels ハンドラーを登録
 */
export function registerGetReels(app: AppContext): void {
  app.openapi(getReelsRoute, async (c) => {
    const db = c.get('db')
    const repository = new DrizzleShowReelRepository(db)
    const useCase = new GetAllShowReelsUseCase(repository)

    const result = await useCase.execute()

    // DateをISO文字列に変換
    const showReels = result.showReels.map((reel) => ({
      ...reel,
      createdAt: reel.createdAt.toISOString(),
      updatedAt: reel.updatedAt.toISOString(),
    }))

    return c.json({ data: { showReels } }, 200)
  })
}
