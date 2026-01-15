import {
  showReels,
  showReelClips,
  videoClips,
  type ShowReel as ShowReelRecord,
  type VideoClip as VideoClipRecord,
  type DatabaseClient,
} from '@reeluv/database-core'
import { eq, and, inArray, asc } from 'drizzle-orm'

import { Timecode } from '../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../domain/showReel/entity/ShowReel'
import type { ShowReelRepository } from '../../../domain/showReel/repository/ShowReelRepository'
import { ShowReelId } from '../../../domain/showReel/valueObject/ShowReelId'
import { VideoClip } from '../../../domain/videoClip/entity/VideoClip'
import { VideoClipId } from '../../../domain/videoClip/valueObject/VideoClipId'

/**
 * Drizzle ORM を使用した ShowReelRepository の実装
 */
export class DrizzleShowReelRepository implements ShowReelRepository {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * IDでShowReelを取得
   */
  async findById(id: ShowReelId): Promise<ShowReel | null> {
    const result = await this.db
      .select()
      .from(showReels)
      .where(eq(showReels.id, id.toString()))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const clips = await this.loadClipsForShowReel(id.toString())
    return this.toDomain(result[0], clips)
  }

  /**
   * 全てのShowReelを取得
   */
  async findAll(): Promise<ShowReel[]> {
    const results = await this.db.select().from(showReels)

    const showReelsWithClips = await Promise.all(
      results.map(async (row) => {
        const clips = await this.loadClipsForShowReel(row.id)
        return this.toDomain(row, clips)
      })
    )

    return showReelsWithClips
  }

  /**
   * 指定された規格と解像度のShowReelを検索
   */
  async findByStandardAndDefinition(
    standard: VideoStandard,
    definition: VideoDefinition
  ): Promise<ShowReel[]> {
    const results = await this.db
      .select()
      .from(showReels)
      .where(
        and(
          eq(showReels.videoStandard, standard.toString()),
          eq(showReels.videoDefinition, definition.toString())
        )
      )

    const showReelsWithClips = await Promise.all(
      results.map(async (row) => {
        const clips = await this.loadClipsForShowReel(row.id)
        return this.toDomain(row, clips)
      })
    )

    return showReelsWithClips
  }

  /**
   * ShowReelを保存（新規作成・更新）
   */
  async save(showReel: ShowReel): Promise<void> {
    const record = this.toRecord(showReel)
    const showReelId = showReel.id.toString()

    // トランザクション的に処理（SQLite は単一接続なので実質的にトランザクション）
    // ShowReel本体を保存
    await this.db
      .insert(showReels)
      .values(record)
      .onConflictDoUpdate({
        target: showReels.id,
        set: {
          name: record.name,
          videoStandard: record.videoStandard,
          videoDefinition: record.videoDefinition,
          updatedAt: new Date(),
        },
      })

    // 既存の中間テーブルレコードを削除
    await this.db.delete(showReelClips).where(eq(showReelClips.showReelId, showReelId))

    // 新しい中間テーブルレコードを挿入
    const clips = showReel.clips
    if (clips.length > 0) {
      const clipRecords = clips.map((clip, index) => ({
        showReelId,
        videoClipId: clip.id.toString(),
        position: index,
      }))

      await this.db.insert(showReelClips).values(clipRecords)
    }
  }

  /**
   * ShowReelを削除
   */
  async delete(id: ShowReelId): Promise<void> {
    // カスケード削除で中間テーブルも削除される
    await this.db.delete(showReels).where(eq(showReels.id, id.toString()))
  }

  /**
   * IDの存在確認
   */
  async exists(id: ShowReelId): Promise<boolean> {
    const result = await this.db
      .select({ id: showReels.id })
      .from(showReels)
      .where(eq(showReels.id, id.toString()))
      .limit(1)

    return result.length > 0
  }

  /**
   * ShowReelに紐づくクリップを取得（順序付き）
   */
  private async loadClipsForShowReel(showReelId: string): Promise<VideoClip[]> {
    // 中間テーブルからクリップIDと順序を取得
    const clipRelations = await this.db
      .select({
        videoClipId: showReelClips.videoClipId,
        position: showReelClips.position,
      })
      .from(showReelClips)
      .where(eq(showReelClips.showReelId, showReelId))
      .orderBy(asc(showReelClips.position))

    if (clipRelations.length === 0) {
      return []
    }

    // クリップIDリストを取得
    const clipIds = clipRelations.map((r) => r.videoClipId)

    // クリップデータを取得
    const clipRows = await this.db.select().from(videoClips).where(inArray(videoClips.id, clipIds))

    // クリップをIDでマップ化
    const clipMap = new Map<string, VideoClipRecord>()
    for (const row of clipRows) {
      clipMap.set(row.id, row)
    }

    // 順序通りにクリップを返す
    return clipRelations
      .map((relation) => {
        const row = clipMap.get(relation.videoClipId)
        if (!row) return null
        return this.clipToDomain(row)
      })
      .filter((clip): clip is VideoClip => clip !== null)
  }

  /**
   * DBレコードをドメインエンティティに変換
   */
  private toDomain(row: ShowReelRecord, clips: VideoClip[]): ShowReel {
    const standard = VideoStandard.fromString(row.videoStandard)
    const definition = VideoDefinition.fromString(row.videoDefinition)

    return ShowReel.reconstruct({
      id: ShowReelId.fromString(row.id),
      name: row.name,
      videoStandard: standard,
      videoDefinition: definition,
      clips,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  /**
   * VideoClipレコードをドメインエンティティに変換
   */
  private clipToDomain(row: VideoClipRecord): VideoClip {
    const standard = VideoStandard.fromString(row.videoStandard)
    const definition = VideoDefinition.fromString(row.videoDefinition)

    return VideoClip.reconstruct({
      id: VideoClipId.fromString(row.id),
      name: row.name,
      description: row.description,
      videoStandard: standard,
      videoDefinition: definition,
      startTimecode: Timecode.fromString(row.startTimecode, standard),
      endTimecode: Timecode.fromString(row.endTimecode, standard),
      deletedAt: row.deletedAt,
    })
  }

  /**
   * ドメインエンティティをDBレコードに変換
   */
  private toRecord(entity: ShowReel): typeof showReels.$inferInsert {
    return {
      id: entity.id.toString(),
      name: entity.name,
      videoStandard: entity.videoStandard.toString(),
      videoDefinition: entity.videoDefinition.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
