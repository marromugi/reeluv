import { createRoute } from '@hono/zod-openapi'

import { CompatibleClipsResponseSchema, ShowReelIdParamSchema } from '../../schema'

import { GetCompatibleClipsUseCase } from '@/api/application/videoClip/GetCompatibleClipsUseCase'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import { DrizzleVideoClipRepository } from '@/api/infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import type { AppContext } from '@/api/route'
import { NotFoundErrorSchema } from '@/api/route/_shared/schema/error'

/**
 * GET /api/reels/:id/compatible-clips ルート定義
 */
export const getCompatibleClipsRoute = createRoute({
  method: 'get',
  path: '/reels/{id}/compatible-clips',
  tags: ['Reel'],
  summary: '互換性のあるクリップを取得',
  description: '指定されたShowReelに追加可能な（互換性のある）VideoClip一覧を取得します。',
  request: {
    params: ShowReelIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CompatibleClipsResponseSchema,
        },
      },
      description: '互換性のあるクリップ一覧',
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
 * GET /api/reels/:id/compatible-clips ハンドラーを登録
 */
export function registerGetCompatibleClips(app: AppContext): void {
  app.openapi(getCompatibleClipsRoute, async (c) => {
    const { id: showReelId } = c.req.valid('param')
    const db = c.get('db')

    const showReelRepository = new DrizzleShowReelRepository(db)
    const videoClipRepository = new DrizzleVideoClipRepository(db)
    const useCase = new GetCompatibleClipsUseCase(showReelRepository, videoClipRepository)

    const result = await useCase.execute({ showReelId })

    return c.json({ data: result }, 200)
  })
}
