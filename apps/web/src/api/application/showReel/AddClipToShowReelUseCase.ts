import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'
import { ShowReelId } from '../../domain/showReel/valueObject/ShowReelId'
import type { VideoClipRepository } from '../../domain/videoClip/repository/VideoClipRepository'
import { VideoClipId } from '../../domain/videoClip/valueObject/VideoClipId'
import { NotFoundError } from '../shared/error/ApplicationError'

/**
 * クリップ追加ユースケースの入力
 */
export interface AddClipToShowReelInput {
  showReelId: string
  clipId: string
}

/**
 * クリップ追加ユースケースの出力
 */
export interface AddClipToShowReelOutput {
  showReelId: string
  clipId: string
  clipCount: number
  totalDuration: string
  updatedAt: Date
}

/**
 * ShowReelにクリップを追加するユースケース
 */
export class AddClipToShowReelUseCase {
  constructor(
    private readonly showReelRepository: ShowReelRepository,
    private readonly videoClipRepository: VideoClipRepository
  ) {}

  /**
   * ShowReelにクリップを追加する
   * @throws NotFoundError ShowReelまたはVideoClipが存在しない場合
   * @throws IncompatibleClipError クリップの規格/解像度が互換性がない場合
   */
  async execute(input: AddClipToShowReelInput): Promise<AddClipToShowReelOutput> {
    // ShowReelを取得
    const showReelId = ShowReelId.fromString(input.showReelId)
    const showReel = await this.showReelRepository.findById(showReelId)

    if (!showReel) {
      throw new NotFoundError('ShowReel', input.showReelId)
    }

    // VideoClipを取得
    const clipId = VideoClipId.fromString(input.clipId)
    const videoClip = await this.videoClipRepository.findById(clipId)

    if (!videoClip) {
      throw new NotFoundError('VideoClip', input.clipId)
    }

    // ドメインロジックでクリップを追加（互換性検証はドメインで実施）
    showReel.addClip(videoClip)

    // 保存
    await this.showReelRepository.save(showReel)

    return {
      showReelId: showReel.id.toString(),
      clipId: videoClip.id.toString(),
      clipCount: showReel.clipCount,
      totalDuration: showReel.totalDuration.toString(),
      updatedAt: showReel.updatedAt,
    }
  }
}
