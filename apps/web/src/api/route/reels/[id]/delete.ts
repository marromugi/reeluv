import { createRoute } from '@hono/zod-openapi'

import { DeleteShowReelResponseSchema, ShowReelIdParamSchema } from '../schema'

import { DeleteShowReelUseCase } from '@/api/application/showReel/DeleteShowReelUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import type { AppContext } from '@/api/route'

/**
 * DELETE /api/reels/:id ルート定義
 */
export const deleteReelRoute = createRoute({
  method: 'delete',
  path: '/reels/{id}',
  tags: ['Reel'],
  summary: 'ShowReelを削除',
  description: '指定されたIDのShowReelを削除します。存在しないIDでもエラーにしません（冪等性）。',
  request: {
    params: ShowReelIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DeleteShowReelResponseSchema,
        },
      },
      description: '削除結果',
    },
  },
})

/**
 * DELETE /api/reels/:id ハンドラーを登録
 */
export function registerDeleteReel(app: AppContext): void {
  app.openapi(deleteReelRoute, async (c) => {
    const { id } = c.req.valid('param')
    const db = c.get('db')

    const repository = new DrizzleShowReelRepository(db)
    const useCase = new DeleteShowReelUseCase(repository)

    const result = await useCase.execute({ id })

    return c.json({ data: result }, 200)
  })
}
