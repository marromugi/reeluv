/**
 * アプリケーションエラーの基底クラス
 */
export abstract class ApplicationError extends Error {
  abstract readonly code: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

/**
 * リソースが見つからないエラー
 */
export class NotFoundError extends ApplicationError {
  readonly code = 'NOT_FOUND'

  constructor(resourceName: string, id: string) {
    super(`${resourceName} (ID: ${id}) が見つかりません`)
  }
}

/**
 * 検証エラー（ドメインエラーをラップ）
 */
export class ValidationError extends ApplicationError {
  readonly code = 'VALIDATION_ERROR'

  constructor(message: string) {
    super(message)
  }
}
