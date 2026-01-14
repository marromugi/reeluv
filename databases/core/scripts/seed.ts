/**
 * シードスクリプト
 *
 * docs/spec.md に記載されている Clip 1〜8 のサンプルデータを
 * データベースに投入するスクリプト
 *
 * 使用方法:
 *   pnpm seed
 *
 * 環境変数:
 *   DATABASE_PATH - データベースファイルのパス（デフォルト: ./data.db）
 *
 * 注意:
 *   このスクリプトは drizzle-kit push を実行してスキーマを同期した後、
 *   シードデータを投入します。
 */

import { execSync } from 'node:child_process'

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from '../src/schema'
import type { NewVideoClip } from '../src/schema'
import { generateId } from '../src/util/id'

// データベースパス（環境変数または デフォルト値）
const DATABASE_PATH = process.env['DATABASE_PATH'] ?? './data.db'

/**
 * drizzle-kit push を実行してスキーマをデータベースに同期
 */
function pushSchema() {
  console.log('📦 スキーマをデータベースに同期中...')
  execSync(`DATABASE_PATH=${DATABASE_PATH} pnpm drizzle-kit push --force`, {
    stdio: 'inherit',
  })
  console.log('')
}

/**
 * データベースクライアントを作成
 */
function createDatabaseClient(databasePath: string) {
  const sqlite = new Database(databasePath)

  // WALモードを有効化（パフォーマンス向上）
  sqlite.pragma('journal_mode = WAL')

  return drizzle(sqlite, { schema })
}

/**
 * シードデータ（docs/spec.md より）
 */
const seedVideoClips: NewVideoClip[] = [
  {
    id: generateId(),
    name: 'Bud Light',
    description: 'A factory is working on the new Bud Light Platinum.',
    videoStandard: 'PAL',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:30:12',
  },
  {
    id: generateId(),
    name: "M&M's",
    description:
      'At a party, a brown shelled M&M is mistaken for being naked. As a result, the red M&M tears off its skin and dances to "Sexy and I Know It" by LMFAO.',
    videoStandard: 'NTSC',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:15:27',
  },
  {
    id: generateId(),
    name: 'Audi',
    description:
      'A group of vampires are having a party in the woods. The vampire in charge of drinks (blood types) arrives in his Audi. The bright lights of the car kill all of the vampires, with him wondering where everyone went afterwards.',
    videoStandard: 'PAL',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:01:30:00',
  },
  {
    id: generateId(),
    name: 'Fiat',
    description:
      'A man walks through a street to discover a beautiful woman (Catrinel Menghia) standing on a parking space, who proceeds to approach and seduce him. When successfully doing so, he then discovers he was about to kiss a Fiat 500 Abarth.',
    videoStandard: 'NTSC',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:18:11',
  },
  {
    id: generateId(),
    name: 'Pepsi',
    description:
      'People in the Middle Ages try to entertain their king (Elton John) for a Pepsi. While the first person fails, a mysterious person (Season 1 X Factor winner Melanie Amaro) wins the Pepsi by singing Aretha Franklin\'s "Respect". After she wins, she overthrows the king and gives Pepsi to all the town.',
    videoStandard: 'NTSC',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:20:00',
  },
  {
    id: generateId(),
    name: 'Best Buy',
    description:
      'An ad featuring the creators of the camera phone, Siri, and the first text message. The creators of Words with Friends also appear parodying the incident involving Alec Baldwin playing the game on an airplane.',
    videoStandard: 'PAL',
    videoDefinition: 'HD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:10:05',
  },
  {
    id: generateId(),
    name: 'Captain America: The First Avenger',
    description: 'Video Promo',
    videoStandard: 'PAL',
    videoDefinition: 'HD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:20:10',
  },
  {
    id: generateId(),
    name: 'Volkswagen "Black Beetle"',
    description:
      'A computer-generated black beetle runs fast, referencing the new Volkswagen model.',
    videoStandard: 'NTSC',
    videoDefinition: 'HD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:30:00',
  },
]

/**
 * メイン処理
 */
async function main() {
  console.log('🎬 シードスクリプトを開始します...')
  console.log(`📁 データベースパス: ${DATABASE_PATH}`)
  console.log('')

  // drizzle-kit push でスキーマを同期
  pushSchema()

  const db = createDatabaseClient(DATABASE_PATH)

  // 既存データ数を確認
  const existingClips = await db.select().from(schema.videoClips)
  console.log(`📊 既存のビデオクリップ数: ${existingClips.length}`)

  if (existingClips.length > 0) {
    console.log('⚠️  既にデータが存在します。シードをスキップします。')
    console.log('   データを再投入する場合は、data.db を削除してから再実行してください。')
    return
  }

  // シードデータを投入
  console.log(`📝 ${seedVideoClips.length} 件のビデオクリップを投入中...`)

  for (const clip of seedVideoClips) {
    await db.insert(schema.videoClips).values(clip)
    console.log(`   ✅ ${clip.name}`)
  }

  console.log('')
  console.log('🎉 シードデータの投入が完了しました！')

  // 投入結果を表示
  const insertedClips = await db.select().from(schema.videoClips)
  console.log('')
  console.log('📋 投入されたデータ:')
  console.log('─'.repeat(80))
  for (const clip of insertedClips) {
    console.log(
      `   ${clip.name} | ${clip.videoStandard} ${clip.videoDefinition} | ${clip.startTimecode} - ${clip.endTimecode}`
    )
  }
  console.log('─'.repeat(80))
}

main().catch((error) => {
  console.error('❌ エラーが発生しました:', error)
  process.exit(1)
})
