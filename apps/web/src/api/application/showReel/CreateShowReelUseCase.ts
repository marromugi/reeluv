import { VideoDefinition } from '../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../domain/showReel/entity/ShowReel'
import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'

/**
 * ShowReel作成ユースケースの入力
 */
export interface CreateShowReelInput {
  name: string
  videoStandard: string // 'PAL' | 'NTSC'
  videoDefinition: string // 'SD' | 'HD'
}

/**
 * ShowReel作成ユースケースの出力
 */
export interface CreateShowReelOutput {
  id: string
  name: string
  videoStandard: string
  videoDefinition: string
  clipCount: number
  totalDuration: string
  createdAt: Date
  updatedAt: Date
}

/**
 * ShowReel作成ユースケース
 */
export class CreateShowReelUseCase {
  constructor(private readonly showReelRepository: ShowReelRepository) {}

  /**
   * ShowReelを作成する
   * @throws InvalidVideoStandardError 無効なビデオ規格の場合
   * @throws InvalidVideoDefinitionError 無効なビデオ解像度の場合
   * @throws EmptyNameError 名前が空の場合
   */
  async execute(input: CreateShowReelInput): Promise<CreateShowReelOutput> {
    // ValueObjectを生成（バリデーション実行）
    const videoStandard = VideoStandard.fromString(input.videoStandard)
    const videoDefinition = VideoDefinition.fromString(input.videoDefinition)

    // エンティティ作成
    const showReel = ShowReel.create({
      name: input.name,
      videoStandard,
      videoDefinition,
    })

    // 保存
    await this.showReelRepository.save(showReel)

    // 出力DTOを返す
    return {
      id: showReel.id.toString(),
      name: showReel.name,
      videoStandard: showReel.videoStandard.toString(),
      videoDefinition: showReel.videoDefinition.toString(),
      clipCount: showReel.clipCount,
      totalDuration: showReel.totalDuration.toString(),
      createdAt: showReel.createdAt,
      updatedAt: showReel.updatedAt,
    }
  }
}
