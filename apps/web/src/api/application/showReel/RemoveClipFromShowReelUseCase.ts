import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'
import { ShowReelId } from '../../domain/showReel/valueObject/ShowReelId'
import { VideoClipId } from '../../domain/videoClip/valueObject/VideoClipId'
import { NotFoundError } from '../shared/error/ApplicationError'

/**
 * クリップ削除ユースケースの入力
 */
export interface RemoveClipFromShowReelInput {
  showReelId: string
  clipId: string
}

/**
 * クリップ削除ユースケースの出力
 */
export interface RemoveClipFromShowReelOutput {
  showReelId: string
  clipId: string
  clipCount: number
  totalDuration: string
  updatedAt: Date
}

/**
 * ShowReelからクリップを削除するユースケース
 */
export class RemoveClipFromShowReelUseCase {
  constructor(private readonly showReelRepository: ShowReelRepository) {}

  /**
   * ShowReelからクリップを削除する
   * @throws NotFoundError ShowReelが存在しない場合
   * @throws ClipNotFoundError クリップがShowReelに含まれていない場合
   */
  async execute(input: RemoveClipFromShowReelInput): Promise<RemoveClipFromShowReelOutput> {
    // ShowReelを取得
    const showReelId = ShowReelId.fromString(input.showReelId)
    const showReel = await this.showReelRepository.findById(showReelId)

    if (!showReel) {
      throw new NotFoundError('ShowReel', input.showReelId)
    }

    // ドメインロジックでクリップを削除
    const clipId = VideoClipId.fromString(input.clipId)
    showReel.removeClip(clipId)

    // 保存
    await this.showReelRepository.save(showReel)

    return {
      showReelId: showReel.id.toString(),
      clipId: input.clipId,
      clipCount: showReel.clipCount,
      totalDuration: showReel.totalDuration.toString(),
      updatedAt: showReel.updatedAt,
    }
  }
}
