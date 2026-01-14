import type { ErrorHandler } from 'hono'

import {
  ApplicationError,
  NotFoundError,
  ValidationError,
} from '@/api/application/shared/error/ApplicationError'
import { DomainError } from '@/api/domain/shared/error/DomainError'

/**
 * APIエラーレスポンスの型
 */
interface ErrorResponse {
  error: {
    code: string
    message: string
  }
}

/**
 * グローバルエラーハンドラー
 *
 * Application層・Domain層のエラーを適切なHTTPレスポンスに変換する
 */
export const errorHandler: ErrorHandler = (err, c) => {
  console.error('API Error:', err)

  // NotFoundError -> 404
  if (err instanceof NotFoundError) {
    return c.json<ErrorResponse>(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      404
    )
  }

  // ValidationError -> 400
  if (err instanceof ValidationError) {
    return c.json<ErrorResponse>(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      400
    )
  }

  // DomainError -> 400
  if (err instanceof DomainError) {
    return c.json<ErrorResponse>(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      400
    )
  }

  // その他のApplicationError -> 500
  if (err instanceof ApplicationError) {
    return c.json<ErrorResponse>(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      500
    )
  }

  // 未知のエラー -> 500
  return c.json<ErrorResponse>(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '内部サーバーエラーが発生しました',
      },
    },
    500
  )
}
