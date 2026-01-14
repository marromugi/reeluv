import { z } from '@hono/zod-openapi'

/**
 * ShowReel内のクリップスキーマ
 */
export const ShowReelClipSchema = z
  .object({
    id: z.string().openapi({ example: 'clip-abc123' }),
    name: z.string().openapi({ example: 'クリップ1' }),
    description: z.string().nullable().openapi({ example: '説明文' }),
    videoStandard: z.string().openapi({ example: 'PAL' }),
    videoDefinition: z.string().openapi({ example: 'SD' }),
    startTimecode: z.string().openapi({ example: '00:00:00:00' }),
    endTimecode: z.string().openapi({ example: '00:00:30:12' }),
    duration: z.string().openapi({ example: '00:00:30:12' }),
  })
  .openapi('ShowReelClip')

/**
 * ShowReel一覧アイテムスキーマ
 */
export const ShowReelListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'reel-abc123' }),
    name: z.string().openapi({ example: 'My ShowReel' }),
    videoStandard: z.string().openapi({ example: 'PAL' }),
    videoDefinition: z.string().openapi({ example: 'SD' }),
    clipCount: z.number().openapi({ example: 5 }),
    totalDuration: z.string().openapi({ example: '00:05:30:00' }),
    createdAt: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  })
  .openapi('ShowReelListItem')

/**
 * ShowReel詳細スキーマ
 */
export const ShowReelDetailSchema = z
  .object({
    id: z.string().openapi({ example: 'reel-abc123' }),
    name: z.string().openapi({ example: 'My ShowReel' }),
    videoStandard: z.string().openapi({ example: 'PAL' }),
    videoDefinition: z.string().openapi({ example: 'SD' }),
    clips: z.array(ShowReelClipSchema).openapi({ example: [] }),
    clipCount: z.number().openapi({ example: 5 }),
    totalDuration: z.string().openapi({ example: '00:05:30:00' }),
    createdAt: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  })
  .openapi('ShowReelDetail')

/**
 * ShowReel一覧レスポンススキーマ
 */
export const ShowReelListResponseSchema = z
  .object({
    data: z.object({
      showReels: z.array(ShowReelListItemSchema),
    }),
  })
  .openapi('ShowReelListResponse')

/**
 * ShowReel詳細レスポンススキーマ
 */
export const ShowReelDetailResponseSchema = z
  .object({
    data: ShowReelDetailSchema,
  })
  .openapi('ShowReelDetailResponse')

/**
 * ShowReel IDパラメータスキーマ
 */
export const ShowReelIdParamSchema = z.object({
  id: z.string().openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: 'reel-abc123',
    description: 'ShowReelのID',
  }),
})

/**
 * ShowReel作成リクエストスキーマ
 */
export const CreateShowReelRequestSchema = z
  .object({
    name: z.string().min(1).openapi({ example: 'My ShowReel' }),
    videoStandard: z.enum(['PAL', 'NTSC']).openapi({ example: 'PAL' }),
    videoDefinition: z.enum(['SD', 'HD']).openapi({ example: 'SD' }),
  })
  .openapi('CreateShowReelRequest')

/**
 * ShowReel作成レスポンススキーマ
 */
export const CreateShowReelResponseSchema = z
  .object({
    data: ShowReelListItemSchema,
  })
  .openapi('CreateShowReelResponse')

/**
 * ShowReel削除レスポンススキーマ
 */
export const DeleteShowReelResponseSchema = z
  .object({
    data: z.object({
      id: z.string().openapi({ example: 'reel-abc123' }),
      deleted: z.boolean().openapi({ example: true }),
    }),
  })
  .openapi('DeleteShowReelResponse')

/**
 * ShowReel名更新リクエストスキーマ
 */
export const UpdateShowReelNameRequestSchema = z
  .object({
    name: z.string().min(1).openapi({ example: 'Updated ShowReel Name' }),
  })
  .openapi('UpdateShowReelNameRequest')

/**
 * ShowReel名更新レスポンススキーマ
 */
export const UpdateShowReelNameResponseSchema = z
  .object({
    data: z.object({
      id: z.string().openapi({ example: 'reel-abc123' }),
      name: z.string().openapi({ example: 'Updated ShowReel Name' }),
      updatedAt: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
    }),
  })
  .openapi('UpdateShowReelNameResponse')

/**
 * クリップ追加リクエストスキーマ
 */
export const AddClipRequestSchema = z
  .object({
    clipId: z.string().openapi({ example: 'clip-abc123' }),
  })
  .openapi('AddClipRequest')

/**
 * クリップ操作レスポンススキーマ
 */
export const ClipOperationResponseSchema = z
  .object({
    data: z.object({
      showReelId: z.string().openapi({ example: 'reel-abc123' }),
      clipId: z.string().openapi({ example: 'clip-abc123' }),
      clipCount: z.number().openapi({ example: 5 }),
      totalDuration: z.string().openapi({ example: '00:05:30:00' }),
      updatedAt: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
    }),
  })
  .openapi('ClipOperationResponse')

/**
 * クリップIDパラメータスキーマ
 */
export const ClipIdParamSchema = z.object({
  clipId: z.string().openapi({
    param: {
      name: 'clipId',
      in: 'path',
    },
    example: 'clip-abc123',
    description: 'VideoClipのID',
  }),
})

/**
 * 互換クリップ一覧レスポンススキーマ
 */
export const CompatibleClipsResponseSchema = z
  .object({
    data: z.object({
      clips: z.array(ShowReelClipSchema),
    }),
  })
  .openapi('CompatibleClipsResponse')
