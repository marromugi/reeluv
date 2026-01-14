import {
  videoClips,
  showReelClips,
  type VideoClip as VideoClipRecord,
  type DatabaseClient,
} from '@database/core'
import { eq, and, inArray, isNull, isNotNull, sql } from 'drizzle-orm'

import { Timecode } from '../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { VideoClip } from '../../../domain/videoClip/entity/VideoClip'
import type { VideoClipRepository } from '../../../domain/videoClip/repository/VideoClipRepository'
import { VideoClipId } from '../../../domain/videoClip/valueObject/VideoClipId'

/**
 * Drizzle ORM を使用した VideoClipRepository の実装
 */
export class DrizzleVideoClipRepository implements VideoClipRepository {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * IDでVideoClipを取得（ソフトデリート済みは除外）
   */
  async findById(id: VideoClipId): Promise<VideoClip | null> {
    const result = await this.db
      .select()
      .from(videoClips)
      .where(and(eq(videoClips.id, id.toString()), isNull(videoClips.deletedAt)))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return this.toDomain(result[0])
  }

  /**
   * 複数のIDでVideoClipを一括取得（ソフトデリート済みは除外）
   */
  async findByIds(ids: VideoClipId[]): Promise<VideoClip[]> {
    if (ids.length === 0) {
      return []
    }

    const idStrings = ids.map((id) => id.toString())
    const results = await this.db
      .select()
      .from(videoClips)
      .where(and(inArray(videoClips.id, idStrings), isNull(videoClips.deletedAt)))

    return results.map((row) => this.toDomain(row))
  }

  /**
   * 全てのVideoClipを取得（ソフトデリート済みは除外）
   */
  async findAll(): Promise<VideoClip[]> {
    const results = await this.db.select().from(videoClips).where(isNull(videoClips.deletedAt))
    return results.map((row) => this.toDomain(row))
  }

  /**
   * 指定された規格と解像度に互換性のあるクリップを検索（ソフトデリート済みは除外）
   */
  async findCompatible(standard: VideoStandard, definition: VideoDefinition): Promise<VideoClip[]> {
    const results = await this.db
      .select()
      .from(videoClips)
      .where(
        and(
          eq(videoClips.videoStandard, standard.toString()),
          eq(videoClips.videoDefinition, definition.toString()),
          isNull(videoClips.deletedAt)
        )
      )

    return results.map((row) => this.toDomain(row))
  }

  /**
   * VideoClipを保存（新規作成・更新）
   */
  async save(videoClip: VideoClip): Promise<void> {
    const record = this.toRecord(videoClip)

    await this.db
      .insert(videoClips)
      .values(record)
      .onConflictDoUpdate({
        target: videoClips.id,
        set: {
          name: record.name,
          description: record.description,
          videoStandard: record.videoStandard,
          videoDefinition: record.videoDefinition,
          startTimecode: record.startTimecode,
          endTimecode: record.endTimecode,
          updatedAt: new Date(),
        },
      })
  }

  /**
   * VideoClipをソフトデリート（論理削除）
   */
  async delete(id: VideoClipId): Promise<void> {
    await this.db
      .update(videoClips)
      .set({ deletedAt: new Date() })
      .where(eq(videoClips.id, id.toString()))
  }

  /**
   * IDの存在確認（ソフトデリート済みは除外）
   */
  async exists(id: VideoClipId): Promise<boolean> {
    const result = await this.db
      .select({ id: videoClips.id })
      .from(videoClips)
      .where(and(eq(videoClips.id, id.toString()), isNull(videoClips.deletedAt)))
      .limit(1)

    return result.length > 0
  }

  /**
   * IDでVideoClipを取得（ソフトデリート済みを含む）
   */
  async findByIdIncludingDeleted(id: VideoClipId): Promise<VideoClip | null> {
    const result = await this.db
      .select()
      .from(videoClips)
      .where(eq(videoClips.id, id.toString()))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return this.toDomain(result[0])
  }

  /**
   * 複数のIDでVideoClipを一括取得（ソフトデリート済みを含む）
   */
  async findByIdsIncludingDeleted(ids: VideoClipId[]): Promise<VideoClip[]> {
    if (ids.length === 0) {
      return []
    }

    const idStrings = ids.map((id) => id.toString())
    const results = await this.db.select().from(videoClips).where(inArray(videoClips.id, idStrings))

    return results.map((row) => this.toDomain(row))
  }

  /**
   * ソフトデリート済みのVideoClipのみを取得
   */
  async findDeleted(): Promise<VideoClip[]> {
    const results = await this.db.select().from(videoClips).where(isNotNull(videoClips.deletedAt))
    return results.map((row) => this.toDomain(row))
  }

  /**
   * ソフトデリート済みのVideoClipを復元
   */
  async restore(id: VideoClipId): Promise<void> {
    await this.db
      .update(videoClips)
      .set({ deletedAt: null })
      .where(eq(videoClips.id, id.toString()))
  }

  /**
   * VideoClipを物理削除
   */
  async hardDelete(id: VideoClipId): Promise<void> {
    await this.db.delete(videoClips).where(eq(videoClips.id, id.toString()))
  }

  /**
   * VideoClipがどのShowReelからも参照されていないか確認
   */
  async isOrphaned(id: VideoClipId): Promise<boolean> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(showReelClips)
      .where(eq(showReelClips.videoClipId, id.toString()))

    return result[0].count === 0
  }

  /**
   * DBレコードをドメインエンティティに変換
   */
  private toDomain(row: VideoClipRecord): VideoClip {
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
  private toRecord(entity: VideoClip): typeof videoClips.$inferInsert {
    return {
      id: entity.id.toString(),
      name: entity.name,
      description: entity.description,
      videoStandard: entity.videoStandard.toString(),
      videoDefinition: entity.videoDefinition.toString(),
      startTimecode: entity.startTimecode.toString(),
      endTimecode: entity.endTimecode.toString(),
    }
  }
}
