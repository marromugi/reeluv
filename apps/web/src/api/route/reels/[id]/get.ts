import { createRoute } from '@hono/zod-openapi'

import { ShowReelDetailResponseSchema, ShowReelIdParamSchema } from '../schema'

import { GetShowReelUseCase } from '@/api/application/showReel/GetShowReelUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import type { AppContext } from '@/api/route'
import { NotFoundErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * GET /api/reels/:id ルート定義
 */
export const getReelByIdRoute = createRoute({
  method: 'get',
  path: '/reels/{id}',
  tags: ['Reel'],
  summary: '指定されたIDのShowReelを取得',
  description: 'ShowReelの詳細を取得します。クリップの詳細も含まれます。',
  request: {
    params: ShowReelIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ShowReelDetailResponseSchema,
        },
      },
      description: 'ShowReel詳細',
    },
    404: {
      content: {
        'application/json': {
          schema: NotFoundErrorSchema,
        },
      },
      description: 'ShowReelが見つかりません',
    },
  },
})

/**
 * GET /api/reels/:id ハンドラーを登録
 */
export function registerGetReelById(app: AppContext): void {
  app.openapi(getReelByIdRoute, async (c) => {
    const { id } = c.req.valid('param')
    const db = c.get('db')

    const repository = new DrizzleShowReelRepository(db)
    const useCase = new GetShowReelUseCase(repository)

    const result = await useCase.execute({ id })

    // DateをISO文字列に変換
    const data = {
      ...result,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    }

    return c.json({ data }, 200)
  })
}
