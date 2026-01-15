import { createRoute } from '@hono/zod-openapi'

import { ReorderClipsRequestSchema, ReorderClipsResponseSchema, ShowReelIdParamSchema } from '../../../schema'

import { ReorderClipsInShowReelUseCase } from '@/api/application/showReel/ReorderClipsInShowReelUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import type { AppContext } from '@/api/route'
import { BadRequestErrorSchema, NotFoundErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * PUT /api/reels/:id/clips/reorder ルート定義
 */
export const reorderClipsRoute = createRoute({
  method: 'put',
  path: '/reels/{id}/clips/reorder',
  tags: ['Reel'],
  summary: 'ShowReel内のクリップを並べ替え',
  description: '指定されたShowReel内のクリップの順序を変更します。',
  request: {
    params: ShowReelIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: ReorderClipsRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ReorderClipsResponseSchema,
        },
      },
      description: 'クリップ並べ替え結果',
    },
    400: {
      content: {
        'application/json': {
          schema: BadRequestErrorSchema,
        },
      },
      description: 'バリデーションエラーまたはクリップが存在しない',
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
 * PUT /api/reels/:id/clips/reorder ハンドラーを登録
 */
export function registerReorderClips(app: AppContext): void {
  app.openapi(reorderClipsRoute, async (c) => {
    const { id: showReelId } = c.req.valid('param')
    const { clipIds } = c.req.valid('json')
    const db = c.get('db')

    const showReelRepository = new DrizzleShowReelRepository(db)
    const useCase = new ReorderClipsInShowReelUseCase(showReelRepository)

    const result = await useCase.execute({ showReelId, clipIds })

    return c.json(
      {
        data: {
          ...result,
          updatedAt: result.updatedAt.toISOString(),
        },
      },
      200
    )
  })
}
