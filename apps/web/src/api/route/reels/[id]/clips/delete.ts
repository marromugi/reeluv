import { createRoute } from '@hono/zod-openapi'

import {
  RemoveClipOperationResponseSchema,
  RemoveClipRequestSchema,
  ShowReelIdParamSchema,
} from '../../schema'

import { RemoveClipFromShowReelUseCase } from '@/api/application/showReel/RemoveClipFromShowReelUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import type { AppContext } from '@/api/route'
import { BadRequestErrorSchema, NotFoundErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * DELETE /api/reels/:id/clips ルート定義
 */
export const removeClipRoute = createRoute({
  method: 'delete',
  path: '/reels/{id}/clips',
  tags: ['Reel'],
  summary: 'ShowReelからクリップを削除',
  description: '指定されたShowReelからVideoClipをインデックス指定で削除します。',
  request: {
    params: ShowReelIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: RemoveClipRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RemoveClipOperationResponseSchema,
        },
      },
      description: 'クリップ削除結果',
    },
    400: {
      content: {
        'application/json': {
          schema: BadRequestErrorSchema,
        },
      },
      description: 'インデックスが範囲外です',
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
 * DELETE /api/reels/:id/clips ハンドラーを登録
 */
export function registerRemoveClip(app: AppContext): void {
  app.openapi(removeClipRoute, async (c) => {
    const { id: showReelId } = c.req.valid('param')
    const { index: clipIndex } = c.req.valid('json')
    const db = c.get('db')

    const repository = new DrizzleShowReelRepository(db)
    const useCase = new RemoveClipFromShowReelUseCase(repository)

    const result = await useCase.execute({ showReelId, clipIndex })

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
