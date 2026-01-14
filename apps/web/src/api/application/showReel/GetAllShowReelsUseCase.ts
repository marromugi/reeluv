import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'

/**
 * ShowReel一覧の各アイテム
 */
export interface ShowReelListItem {
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
 * 全ShowReel取得ユースケースの出力
 */
export interface GetAllShowReelsOutput {
  showReels: ShowReelListItem[]
}

/**
 * 全ShowReel取得ユースケース
 */
export class GetAllShowReelsUseCase {
  constructor(private readonly showReelRepository: ShowReelRepository) {}

  /**
   * 全てのShowReelを取得する
   * クリップの詳細は含まない（パフォーマンス考慮）
   */
  async execute(): Promise<GetAllShowReelsOutput> {
    const showReels = await this.showReelRepository.findAll()

    return {
      showReels: showReels.map((showReel) => ({
        id: showReel.id.toString(),
        name: showReel.name,
        videoStandard: showReel.videoStandard.toString(),
        videoDefinition: showReel.videoDefinition.toString(),
        clipCount: showReel.clipCount,
        totalDuration: showReel.totalDuration.toString(),
        createdAt: showReel.createdAt,
        updatedAt: showReel.updatedAt,
      })),
    }
  }
}
