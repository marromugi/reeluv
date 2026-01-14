import { createRoute } from '@hono/zod-openapi'

import { CreateVideoClipRequestSchema, CreateVideoClipResponseSchema } from './schema'

import { CreateVideoClipUseCase } from '@/api/application/videoClip/CreateVideoClipUseCase'
import { DrizzleVideoClipRepository } from '@/api/infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import type { AppContext } from '@/api/route'
import { BadRequestErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * POST /api/clips ルート定義
 */
export const createClipRoute = createRoute({
  method: 'post',
  path: '/clips',
  tags: ['Clip'],
  summary: 'VideoClipを作成',
  description: '新しいVideoClipを作成します。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateVideoClipRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: CreateVideoClipResponseSchema,
        },
      },
      description: '作成されたVideoClip',
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
 * POST /api/clips ハンドラーを登録
 */
export function registerCreateClip(app: AppContext): void {
  app.openapi(createClipRoute, async (c) => {
    const body = c.req.valid('json')
    const db = c.get('db')

    const repository = new DrizzleVideoClipRepository(db)
    const useCase = new CreateVideoClipUseCase(repository)

    const result = await useCase.execute({
      ...body,
      description: body.description ?? null,
    })

    return c.json({ data: result }, 201)
  })
}
