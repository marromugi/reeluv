import { createDatabaseClient } from '@database/core'
import { handle } from 'hono/vercel'

import { createApp, setupOpenAPIDoc } from '@/api/route'
import { registerGetClipById } from '@/api/route/clips/[id]/get'
import { registerGetClips } from '@/api/route/clips/get'
import { registerCreateClip } from '@/api/route/clips/post'
import { registerRemoveClip } from '@/api/route/reels/[id]/clips/[clipId]/delete'
import { registerAddClip } from '@/api/route/reels/[id]/clips/post'
import { registerGetCompatibleClips } from '@/api/route/reels/[id]/compatible-clips/get'
import { registerDeleteReel } from '@/api/route/reels/[id]/delete'
import { registerGetReelById } from '@/api/route/reels/[id]/get'
import { registerUpdateReelName } from '@/api/route/reels/[id]/patch'
import { registerGetReels } from '@/api/route/reels/get'
import { registerCreateReel } from '@/api/route/reels/post'

/**
 * データベースクライアント（シングルトン）
 */
const db = createDatabaseClient(process.env.DATABASE_PATH || './data.db')

/**
 * Honoアプリの初期化
 */
const app = createApp(db)

// Reelsルートを登録
registerGetReels(app)
registerCreateReel(app)
registerGetReelById(app)
registerUpdateReelName(app)
registerDeleteReel(app)
registerAddClip(app)
registerRemoveClip(app)
registerGetCompatibleClips(app)

// Clipsルートを登録
registerGetClips(app)
registerCreateClip(app)
registerGetClipById(app)

// OpenAPIドキュメントを設定
setupOpenAPIDoc(app)

/**
 * Next.js App Router用のエクスポート
 */
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
