import { MixedVideoStandardError } from '../../shared/error/DomainError'
import { Timecode } from '../../shared/valueObject/Timecode'
import { VideoStandard } from '../../shared/valueObject/VideoStandard'
import { VideoClip } from '../../videoClip/entity/VideoClip'
import { ShowReel } from '../entity/ShowReel'

/**
 * 検証エラー
 */
export interface ValidationError {
  code: string
  message: string
  field?: string
}

/**
 * 検証結果
 */
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * ShowReelドメインサービス
 * ShowReelに関わる複雑なドメインロジックを提供
 */
export class ShowReelService {
  /**
   * ShowReelの総再生時間を計算
   * @param showReel ShowReel
   * @returns 総再生時間
   */
  calculateTotalDuration(showReel: ShowReel): Timecode {
    return showReel.totalDuration
  }

  /**
   * 複数ShowReelの総再生時間を計算
   * 異なるVideoStandardのShowReelが混在する場合はエラー
   * @param showReels ShowReelの配列
   * @returns 合計時間
   * @throws MixedVideoStandardError 異なる規格が混在する場合
   */
  calculateCombinedDuration(showReels: ShowReel[]): Timecode {
    if (showReels.length === 0) {
      return Timecode.zero(VideoStandard.pal())
    }

    const firstStandard = showReels[0].videoStandard
    const hasMixedStandards = showReels.some(
      (reel) => !reel.videoStandard.equals(firstStandard)
    )

    if (hasMixedStandards) {
      throw new MixedVideoStandardError()
    }

    return showReels.reduce(
      (total, reel) => total.add(reel.totalDuration),
      Timecode.zero(firstStandard)
    )
  }

  /**
   * クリップがShowReelに追加可能か検証
   * @param clip VideoClip
   * @param showReel ShowReel
   * @returns 検証結果
   */
  validateClipCompatibility(
    clip: VideoClip,
    showReel: ShowReel
  ): ValidationResult {
    const errors: ValidationError[] = []

    if (!clip.videoStandard.equals(showReel.videoStandard)) {
      errors.push({
        code: 'INCOMPATIBLE_STANDARD',
        message: `クリップのビデオ規格 (${clip.videoStandard.toString()}) は ショーリール (${showReel.videoStandard.toString()}) と互換性がありません`,
        field: 'videoStandard',
      })
    }

    if (!clip.videoDefinition.equals(showReel.videoDefinition)) {
      errors.push({
        code: 'INCOMPATIBLE_DEFINITION',
        message: `クリップのビデオ解像度 (${clip.videoDefinition.toString()}) は ショーリール (${showReel.videoDefinition.toString()}) と互換性がありません`,
        field: 'videoDefinition',
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * 複数クリップの互換性を一括検証
   * @param clips VideoClipの配列
   * @param showReel ShowReel
   * @returns 各クリップの検証結果
   */
  validateClipsCompatibility(
    clips: VideoClip[],
    showReel: ShowReel
  ): ValidationResult[] {
    return clips.map((clip) => this.validateClipCompatibility(clip, showReel))
  }

  /**
   * クリップの追加可能リストをフィルタリング
   * @param clips VideoClipの配列
   * @param showReel ShowReel
   * @returns 追加可能なクリップの配列
   */
  filterCompatibleClips(clips: VideoClip[], showReel: ShowReel): VideoClip[] {
    return clips.filter((clip) => showReel.canAddClip(clip))
  }
}
