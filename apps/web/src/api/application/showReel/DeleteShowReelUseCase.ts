import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'
import { ShowReelId } from '../../domain/showReel/valueObject/ShowReelId'

/**
 * ShowReel削除ユースケースの入力
 */
export interface DeleteShowReelInput {
  id: string
}

/**
 * ShowReel削除ユースケースの出力
 */
export interface DeleteShowReelOutput {
  id: string
  deleted: boolean
}

/**
 * ShowReel削除ユースケース
 */
export class DeleteShowReelUseCase {
  constructor(private readonly showReelRepository: ShowReelRepository) {}

  /**
   * ShowReelを削除する
   * 存在しないIDを指定した場合もエラーにしない（冪等性）
   */
  async execute(input: DeleteShowReelInput): Promise<DeleteShowReelOutput> {
    const id = ShowReelId.fromString(input.id)

    // 存在確認
    const exists = await this.showReelRepository.exists(id)

    if (exists) {
      await this.showReelRepository.delete(id)
    }

    return {
      id: input.id,
      deleted: exists,
    }
  }
}
