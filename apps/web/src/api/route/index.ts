import type { DatabaseClient } from '@database/core'
import { OpenAPIHono } from '@hono/zod-openapi'

import { errorHandler } from './_shared/errorHandler'

/**
 * APIアプリケーションの環境変数型
 */
export interface AppEnv {
  Variables: {
    db: DatabaseClient
  }
}

/**
 * OpenAPIアプリのコンテキスト型
 */
export type AppContext = OpenAPIHono<AppEnv>

/**
 * OpenAPIアプリを作成する
 *
 * @param db データベースクライアント
 * @returns 設定済みのOpenAPIアプリ
 */
export function createApp(db: DatabaseClient): AppContext {
  const app = new OpenAPIHono<AppEnv>().basePath('/api')

  // データベースクライアントをコンテキストに設定
  app.use('*', async (c, next) => {
    c.set('db', db)
    await next()
  })

  // グローバルエラーハンドラー
  app.onError(errorHandler)

  return app
}

/**
 * APIルートを登録し、OpenAPIドキュメントを設定する
 *
 * @param app OpenAPIアプリ
 */
export function setupOpenAPIDoc(app: AppContext): void {
  // OpenAPI仕様エンドポイント
  app.doc('/doc', {
    openapi: '3.1.0',
    info: {
      title: 'ReeLuv API',
      version: '1.0.0',
      description: 'ShowReelとVideoClipを管理するAPI',
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
  })
}
