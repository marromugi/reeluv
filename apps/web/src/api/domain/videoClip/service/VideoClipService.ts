import {
  ClipInUseError,
  ClipNotFoundError,
  ClipNotSoftDeletedError,
  MixedVideoStandardError,
} from '../../shared/error/DomainError'
import { Timecode } from '../../shared/valueObject/Timecode'
import { VideoDefinition } from '../../shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../shared/valueObject/VideoStandard'
import { VideoClip } from '../entity/VideoClip'
import type { VideoClipRepository } from '../repository/VideoClipRepository'
import type { VideoClipId } from '../valueObject/VideoClipId'

/**
 * VideoClipドメインサービス
 * 複数のVideoClipに関わる操作を提供
 */
export class VideoClipService {
  constructor(private readonly repository?: VideoClipRepository) {}
  /**
   * クリップの再生時間を計算
   * @param clip VideoClip
   * @returns 再生時間
   */
  calculateDuration(clip: VideoClip): Timecode {
    return clip.duration
  }

  /**
   * 複数クリップの合計時間を計算
   * 異なるVideoStandardのクリップが混在する場合はエラー
   * @param clips VideoClipの配列
   * @returns 合計時間
   * @throws MixedVideoStandardError 異なる規格が混在する場合
   */
  calculateTotalDuration(clips: VideoClip[]): Timecode {
    if (clips.length === 0) {
      return Timecode.zero(VideoStandard.pal())
    }

    const firstStandard = clips[0].videoStandard
    const hasMixedStandards = clips.some((clip) => !clip.videoStandard.equals(firstStandard))

    if (hasMixedStandards) {
      throw new MixedVideoStandardError()
    }

    return clips.reduce((total, clip) => total.add(clip.duration), Timecode.zero(firstStandard))
  }

  /**
   * クリップをVideoStandardでグループ化
   * @param clips VideoClipの配列
   * @returns VideoStandardをキーとしたMap
   */
  groupByStandard(clips: VideoClip[]): Map<string, VideoClip[]> {
    const groups = new Map<string, VideoClip[]>()

    for (const clip of clips) {
      const key = clip.videoStandard.toString()
      const group = groups.get(key) ?? []
      group.push(clip)
      groups.set(key, group)
    }

    return groups
  }

  /**
   * クリップをVideoDefinitionでグループ化
   * @param clips VideoClipの配列
   * @returns VideoDefinitionをキーとしたMap
   */
  groupByDefinition(clips: VideoClip[]): Map<string, VideoClip[]> {
    const groups = new Map<string, VideoClip[]>()

    for (const clip of clips) {
      const key = clip.videoDefinition.toString()
      const group = groups.get(key) ?? []
      group.push(clip)
      groups.set(key, group)
    }

    return groups
  }

  /**
   * 互換性でフィルタリング
   * @param clips VideoClipの配列
   * @param standard ビデオ規格
   * @param definition ビデオ解像度
   * @returns 互換性のあるクリップの配列
   */
  filterByCompatibility(
    clips: VideoClip[],
    standard: VideoStandard,
    definition: VideoDefinition
  ): VideoClip[] {
    return clips.filter((clip) => clip.isCompatibleWithStandardAndDefinition(standard, definition))
  }

  /**
   * クリップを安全に物理削除
   * - ソフトデリート済みであること
   * - どのShowReelからも参照されていないこと
   * @param clipId 削除するクリップのID
   * @throws ClipNotFoundError クリップが見つからない場合
   * @throws ClipNotSoftDeletedError ソフトデリートされていない場合
   * @throws ClipInUseError ショーリールから参照されている場合
   */
  async hardDeleteClip(clipId: VideoClipId): Promise<void> {
    if (!this.repository) {
      throw new Error('リポジトリが設定されていません')
    }

    // 1. クリップの存在確認（削除済みを含む）
    const clip = await this.repository.findByIdIncludingDeleted(clipId)
    if (!clip) {
      throw new ClipNotFoundError(clipId.toString())
    }

    // 2. ソフトデリート済みか確認
    if (!clip.isDeleted) {
      throw new ClipNotSoftDeletedError(clipId.toString())
    }

    // 3. 参照されていないか確認
    const isOrphaned = await this.repository.isOrphaned(clipId)
    if (!isOrphaned) {
      throw new ClipInUseError(clipId.toString())
    }

    // 4. 物理削除実行
    await this.repository.hardDelete(clipId)
  }

  /**
   * 参照されていないソフトデリート済みクリップを一括物理削除
   * @returns 削除されたクリップの数
   */
  async purgeOrphanedDeletedClips(): Promise<number> {
    if (!this.repository) {
      throw new Error('リポジトリが設定されていません')
    }

    const deletedClips = await this.repository.findDeleted()
    let purgedCount = 0

    for (const clip of deletedClips) {
      const isOrphaned = await this.repository.isOrphaned(clip.id)
      if (isOrphaned) {
        await this.repository.hardDelete(clip.id)
        purgedCount++
      }
    }

    return purgedCount
  }
}
