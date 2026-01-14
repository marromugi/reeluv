import { createRoute } from '@hono/zod-openapi'

import { VideoClipDetailResponseSchema, VideoClipIdParamSchema } from '../schema'

import { GetVideoClipUseCase } from '@/api/application/videoClip/GetVideoClipUseCase'
import { DrizzleVideoClipRepository } from '@/api/infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import type { AppContext } from '@/api/route'
import { NotFoundErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * GET /api/clips/:id ルート定義
 */
export const getClipByIdRoute = createRoute({
  method: 'get',
  path: '/clips/{id}',
  tags: ['Clip'],
  summary: '指定されたIDのVideoClipを取得',
  description: 'VideoClipの詳細を取得します。',
  request: {
    params: VideoClipIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: VideoClipDetailResponseSchema,
        },
      },
      description: 'VideoClip詳細',
    },
    404: {
      content: {
        'application/json': {
          schema: NotFoundErrorSchema,
        },
      },
      description: 'VideoClipが見つかりません',
    },
  },
})

/**
 * GET /api/clips/:id ハンドラーを登録
 */
export function registerGetClipById(app: AppContext): void {
  app.openapi(getClipByIdRoute, async (c) => {
    const { id } = c.req.valid('param')
    const db = c.get('db')

    const repository = new DrizzleVideoClipRepository(db)
    const useCase = new GetVideoClipUseCase(repository)

    const result = await useCase.execute({ id })

    return c.json({ data: result }, 200)
  })
}
