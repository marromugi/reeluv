import { createRoute } from '@hono/zod-openapi'

import { CreateShowReelRequestSchema, CreateShowReelResponseSchema } from './schema'

import { CreateShowReelUseCase } from '@/api/application/showReel/CreateShowReelUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import type { AppContext } from '@/api/route'
import { BadRequestErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * POST /api/reels ルート定義
 */
export const createReelRoute = createRoute({
  method: 'post',
  path: '/reels',
  tags: ['Reel'],
  summary: 'ShowReelを作成',
  description: '新しいShowReelを作成します。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateShowReelRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: CreateShowReelResponseSchema,
        },
      },
      description: '作成されたShowReel',
    },
    400: {
      content: {
        'application/json': {
          schema: BadRequestErrorSchema,
        },
      },
      description: 'バリデーションエラー',
    },
  },
})

/**
 * POST /api/reels ハンドラーを登録
 */
export function registerCreateReel(app: AppContext): void {
  app.openapi(createReelRoute, async (c) => {
    const body = c.req.valid('json')
    const db = c.get('db')

    const repository = new DrizzleShowReelRepository(db)
    const useCase = new CreateShowReelUseCase(repository)

    const result = await useCase.execute(body)

    return c.json(
      {
        data: {
          ...result,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        },
      },
      201
    )
  })
}
