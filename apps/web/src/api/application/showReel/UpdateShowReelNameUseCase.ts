import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'
import { ShowReelId } from '../../domain/showReel/valueObject/ShowReelId'
import { NotFoundError } from '../shared/error/ApplicationError'

/**
 * ShowReel名更新ユースケースの入力
 */
export interface UpdateShowReelNameInput {
  id: string
  name: string
}

/**
 * ShowReel名更新ユースケースの出力
 */
export interface UpdateShowReelNameOutput {
  id: string
  name: string
  updatedAt: Date
}

/**
 * ShowReel名更新ユースケース
 */
export class UpdateShowReelNameUseCase {
  constructor(private readonly showReelRepository: ShowReelRepository) {}

  /**
   * ShowReelの名前を更新する
   * @throws NotFoundError ShowReelが存在しない場合
   * @throws EmptyNameError 名前が空の場合
   */
  async execute(input: UpdateShowReelNameInput): Promise<UpdateShowReelNameOutput> {
    const id = ShowReelId.fromString(input.id)
    const showReel = await this.showReelRepository.findById(id)

    if (!showReel) {
      throw new NotFoundError('ShowReel', input.id)
    }

    // ドメインロジックで名前を更新（バリデーション実行）
    showReel.rename(input.name)

    // 保存
    await this.showReelRepository.save(showReel)

    return {
      id: showReel.id.toString(),
      name: showReel.name,
      updatedAt: showReel.updatedAt,
    }
  }
}
