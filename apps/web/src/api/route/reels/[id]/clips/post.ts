import { createRoute } from '@hono/zod-openapi'

import {
  AddClipRequestSchema,
  ClipOperationResponseSchema,
  ShowReelIdParamSchema,
} from '../../schema'

import { AddClipToShowReelUseCase } from '@/api/application/showReel/AddClipToShowReelUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import { DrizzleVideoClipRepository } from '@/api/infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import type { AppContext } from '@/api/route'
import { BadRequestErrorSchema, NotFoundErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * POST /api/reels/:id/clips ルート定義
 */
export const addClipRoute = createRoute({
  method: 'post',
  path: '/reels/{id}/clips',
  tags: ['Reel'],
  summary: 'ShowReelにクリップを追加',
  description: '指定されたShowReelにVideoClipを追加します。互換性のないクリップは追加できません。',
  request: {
    params: ShowReelIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: AddClipRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ClipOperationResponseSchema,
        },
      },
      description: 'クリップ追加結果',
    },
    400: {
      content: {
        'application/json': {
          schema: BadRequestErrorSchema,
        },
      },
      description: '互換性エラーまたはバリデーションエラー',
    },
    404: {
      content: {
        'application/json': {
          schema: NotFoundErrorSchema,
        },
      },
      description: 'ShowReelまたはVideoClipが見つかりません',
    },
  },
})

/**
 * POST /api/reels/:id/clips ハンドラーを登録
 */
export function registerAddClip(app: AppContext): void {
  app.openapi(addClipRoute, async (c) => {
    const { id: showReelId } = c.req.valid('param')
    const { clipId } = c.req.valid('json')
    const db = c.get('db')

    const showReelRepository = new DrizzleShowReelRepository(db)
    const videoClipRepository = new DrizzleVideoClipRepository(db)
    const useCase = new AddClipToShowReelUseCase(showReelRepository, videoClipRepository)

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
