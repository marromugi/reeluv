import { z } from '@hono/zod-openapi'

/**
 * VideoClip一覧アイテムスキーマ
 */
export const VideoClipListItemSchema = z
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
  .openapi('VideoClipListItem')

/**
 * VideoClip詳細スキーマ
 */
export const VideoClipDetailSchema = z
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
  .openapi('VideoClipDetail')

/**
 * VideoClip一覧レスポンススキーマ
 */
export const VideoClipListResponseSchema = z
  .object({
    data: z.object({
      clips: z.array(VideoClipListItemSchema),
    }),
  })
  .openapi('VideoClipListResponse')

/**
 * VideoClip詳細レスポンススキーマ
 */
export const VideoClipDetailResponseSchema = z
  .object({
    data: VideoClipDetailSchema,
  })
  .openapi('VideoClipDetailResponse')

/**
 * VideoClip IDパラメータスキーマ
 */
export const VideoClipIdParamSchema = z.object({
  id: z.string().openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: 'clip-abc123',
    description: 'VideoClipのID',
  }),
})

/**
 * VideoClip作成リクエストスキーマ
 */
export const CreateVideoClipRequestSchema = z
  .object({
    name: z.string().min(1).openapi({ example: 'クリップ1' }),
    description: z.string().nullable().optional().openapi({ example: '説明文' }),
    videoStandard: z.enum(['PAL', 'NTSC']).openapi({ example: 'PAL' }),
    videoDefinition: z.enum(['SD', 'HD']).openapi({ example: 'SD' }),
    startTimecode: z.string().openapi({ example: '00:00:00:00' }),
    endTimecode: z.string().openapi({ example: '00:00:30:12' }),
  })
  .openapi('CreateVideoClipRequest')

/**
 * VideoClip作成レスポンススキーマ
 */
export const CreateVideoClipResponseSchema = z
  .object({
    data: VideoClipDetailSchema,
  })
  .openapi('CreateVideoClipResponse')
