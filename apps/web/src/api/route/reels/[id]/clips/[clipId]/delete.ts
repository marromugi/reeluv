import { createRoute } from '@hono/zod-openapi'

import {
  ClipIdParamSchema,
  ClipOperationResponseSchema,
  ShowReelIdParamSchema,
} from '../../../schema'

import { RemoveClipFromShowReelUseCase } from '@/api/application/showReel/RemoveClipFromShowReelUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import type { AppContext } from '@/api/route'
import { BadRequestErrorSchema, NotFoundErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * パスパラメータスキーマ（ShowReelID + ClipID）
 */
const RemoveClipParamsSchema = ShowReelIdParamSchema.merge(ClipIdParamSchema)

/**
 * DELETE /api/reels/:id/clips/:clipId ルート定義
 */
export const removeClipRoute = createRoute({
  method: 'delete',
  path: '/reels/{id}/clips/{clipId}',
  tags: ['Reel'],
  summary: 'ShowReelからクリップを削除',
  description: '指定されたShowReelからVideoClipを削除します。',
  request: {
    params: RemoveClipParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ClipOperationResponseSchema,
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
      description: 'クリップがShowReelに含まれていません',
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
 * DELETE /api/reels/:id/clips/:clipId ハンドラーを登録
 */
export function registerRemoveClip(app: AppContext): void {
  app.openapi(removeClipRoute, async (c) => {
    const { id: showReelId, clipId } = c.req.valid('param')
    const db = c.get('db')

    const repository = new DrizzleShowReelRepository(db)
    const useCase = new RemoveClipFromShowReelUseCase(repository)

    const result = await useCase.execute({ showReelId, clipId })

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
