import { z } from '@hono/zod-openapi'

/**
 * APIエラーレスポンスのZodスキーマ
 */
export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string().openapi({
      example: 'NOT_FOUND',
      description: 'エラーコード',
    }),
    message: z.string().openapi({
      example: 'ShowReel (ID: abc123) が見つかりません',
      description: 'エラーメッセージ',
    }),
  }),
})

/**
 * 404エラーレスポンスのZodスキーマ
 */
export const NotFoundErrorSchema = ErrorResponseSchema.openapi({
  description: 'リソースが見つかりません',
})

/**
 * 400エラーレスポンスのZodスキーマ
 */
export const BadRequestErrorSchema = ErrorResponseSchema.openapi({
  description: 'リクエストが不正です',
})

/**
 * 500エラーレスポンスのZodスキーマ
 */
export const InternalServerErrorSchema = ErrorResponseSchema.openapi({
  description: '内部サーバーエラー',
})
