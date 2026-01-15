import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'
import { ShowReelId } from '../../domain/showReel/valueObject/ShowReelId'
import { VideoClipId } from '../../domain/videoClip/valueObject/VideoClipId'
import { NotFoundError } from '../shared/error/ApplicationError'

/**
 * クリップ並べ替えユースケースの入力
 */
export interface ReorderClipsInShowReelInput {
  showReelId: string
  /** 並べ替え後のクリップID配列（順序通りに配置される） */
  clipIds: string[]
}

/**
 * クリップ並べ替えユースケースの出力
 */
export interface ReorderClipsInShowReelOutput {
  showReelId: string
  clipIds: string[]
  clipCount: number
  totalDuration: string
  updatedAt: Date
}

/**
 * ShowReel内のクリップを並べ替えるユースケース
 */
export class ReorderClipsInShowReelUseCase {
  constructor(private readonly showReelRepository: ShowReelRepository) {}

  /**
   * ShowReel内のクリップを並べ替える
   * @throws NotFoundError ShowReelが存在しない場合
   * @throws ClipNotFoundError 存在しないクリップIDが含まれる場合
   */
  async execute(input: ReorderClipsInShowReelInput): Promise<ReorderClipsInShowReelOutput> {
    // ShowReelを取得
    const showReelId = ShowReelId.fromString(input.showReelId)
    const showReel = await this.showReelRepository.findById(showReelId)

    if (!showReel) {
      throw new NotFoundError('ShowReel', input.showReelId)
    }

    // クリップIDを値オブジェクトに変換
    const clipIds = input.clipIds.map((id) => VideoClipId.fromString(id))

    // ドメインロジックでクリップを並べ替え
    showReel.reorderClips(clipIds)

    // 保存
    await this.showReelRepository.save(showReel)

    return {
      showReelId: showReel.id.toString(),
      clipIds: showReel.clips.map((clip) => clip.id.toString()),
      clipCount: showReel.clipCount,
      totalDuration: showReel.totalDuration.toString(),
      updatedAt: showReel.updatedAt,
    }
  }
}
