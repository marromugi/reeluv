import { createRoute } from '@hono/zod-openapi'

import { VideoClipListResponseSchema } from './schema'

import { GetAllVideoClipsUseCase } from '@/api/application/videoClip/GetAllVideoClipsUseCase'
import { DrizzleVideoClipRepository } from '@/api/infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import type { AppContext } from '@/api/route'

/**
 * GET /api/clips ルート定義
 */
export const getClipsRoute = createRoute({
  method: 'get',
  path: '/clips',
  tags: ['Clip'],
  summary: '全てのVideoClipを取得',
  description: 'VideoClipの一覧を取得します。',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: VideoClipListResponseSchema,
        },
      },
      description: 'VideoClip一覧',
    },
  },
})

/**
 * GET /api/clips ハンドラーを登録
 */
export function registerGetClips(app: AppContext): void {
  app.openapi(getClipsRoute, async (c) => {
    const db = c.get('db')
    const repository = new DrizzleVideoClipRepository(db)
    const useCase = new GetAllVideoClipsUseCase(repository)

    const result = await useCase.execute()

    return c.json({ data: { clips: result.clips } }, 200)
  })
}
