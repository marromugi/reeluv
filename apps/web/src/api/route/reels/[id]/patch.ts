import { createRoute } from '@hono/zod-openapi'

import {
  ShowReelIdParamSchema,
  UpdateShowReelNameRequestSchema,
  UpdateShowReelNameResponseSchema,
} from '../schema'

import { UpdateShowReelNameUseCase } from '@/api/application/showReel/UpdateShowReelNameUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import type { AppContext } from '@/api/route'
import { BadRequestErrorSchema, NotFoundErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * PATCH /api/reels/:id ルート定義
 */
export const updateReelNameRoute = createRoute({
  method: 'patch',
  path: '/reels/{id}',
  tags: ['Reel'],
  summary: 'ShowReelの名前を更新',
  description: '指定されたIDのShowReelの名前を更新します。',
  request: {
    params: ShowReelIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateShowReelNameRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UpdateShowReelNameResponseSchema,
        },
      },
      description: '更新されたShowReel情報',
    },
    400: {
      content: {
        'application/json': {
          schema: BadRequestErrorSchema,
        },
      },
      description: 'バリデーションエラー',
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
 * PATCH /api/reels/:id ハンドラーを登録
 */
export function registerUpdateReelName(app: AppContext): void {
  app.openapi(updateReelNameRoute, async (c) => {
    const { id } = c.req.valid('param')
    const { name } = c.req.valid('json')
    const db = c.get('db')

    const repository = new DrizzleShowReelRepository(db)
    const useCase = new UpdateShowReelNameUseCase(repository)

    const result = await useCase.execute({ id, name })

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
