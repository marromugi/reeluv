import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'
import { ShowReelId } from '../../domain/showReel/valueObject/ShowReelId'
import { NotFoundError } from '../shared/error/ApplicationError'

/**
 * クリップ削除ユースケースの入力
 */
export interface RemoveClipFromShowReelInput {
  showReelId: string
  clipIndex: number
}

/**
 * クリップ削除ユースケースの出力
 */
export interface RemoveClipFromShowReelOutput {
  showReelId: string
  clipIndex: number
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
   * @throws ClipIndexOutOfBoundsError インデックスが範囲外の場合
   */
  async execute(input: RemoveClipFromShowReelInput): Promise<RemoveClipFromShowReelOutput> {
    // ShowReelを取得
    const showReelId = ShowReelId.fromString(input.showReelId)
    const showReel = await this.showReelRepository.findById(showReelId)

    if (!showReel) {
      throw new NotFoundError('ShowReel', input.showReelId)
    }

    // ドメインロジックでクリップを削除（インデックス指定）
    showReel.removeClipAt(input.clipIndex)

    // 保存
    await this.showReelRepository.save(showReel)

    return {
      showReelId: showReel.id.toString(),
      clipIndex: input.clipIndex,
      clipCount: showReel.clipCount,
      totalDuration: showReel.totalDuration.toString(),
      updatedAt: showReel.updatedAt,
    }
  }
}
