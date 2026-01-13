import { MixedVideoStandardError } from '../../shared/error/DomainError'
import { Timecode } from '../../shared/valueObject/Timecode'
import { VideoDefinition } from '../../shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../shared/valueObject/VideoStandard'
import { VideoClip } from '../entity/VideoClip'

/**
 * VideoClipドメインサービス
 * 複数のVideoClipに関わる操作を提供
 */
export class VideoClipService {
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
    const hasMixedStandards = clips.some(
      (clip) => !clip.videoStandard.equals(firstStandard)
    )

    if (hasMixedStandards) {
      throw new MixedVideoStandardError()
    }

    return clips.reduce(
      (total, clip) => total.add(clip.duration),
      Timecode.zero(firstStandard)
    )
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
    return clips.filter((clip) =>
      clip.isCompatibleWithStandardAndDefinition(standard, definition)
    )
  }
}
