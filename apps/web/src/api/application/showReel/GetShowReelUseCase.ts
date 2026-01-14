import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'
import { ShowReelId } from '../../domain/showReel/valueObject/ShowReelId'
import { NotFoundError } from '../shared/error/ApplicationError'

/**
 * ShowReel取得ユースケースの入力
 */
export interface GetShowReelInput {
  id: string
}

/**
 * ShowReel内のクリップ情報
 */
export interface ShowReelClipOutput {
  id: string
  name: string
  description: string | null
  videoStandard: string
  videoDefinition: string
  startTimecode: string
  endTimecode: string
  duration: string
}

/**
 * ShowReel取得ユースケースの出力
 */
export interface GetShowReelOutput {
  id: string
  name: string
  videoStandard: string
  videoDefinition: string
  clips: ShowReelClipOutput[]
  clipCount: number
  totalDuration: string
  createdAt: Date
  updatedAt: Date
}

/**
 * ShowReel取得ユースケース
 */
export class GetShowReelUseCase {
  constructor(private readonly showReelRepository: ShowReelRepository) {}

  /**
   * IDを指定してShowReelを取得する
   * @throws NotFoundError ShowReelが存在しない場合
   */
  async execute(input: GetShowReelInput): Promise<GetShowReelOutput> {
    const id = ShowReelId.fromString(input.id)
    const showReel = await this.showReelRepository.findById(id)

    if (!showReel) {
      throw new NotFoundError('ShowReel', input.id)
    }

    return {
      id: showReel.id.toString(),
      name: showReel.name,
      videoStandard: showReel.videoStandard.toString(),
      videoDefinition: showReel.videoDefinition.toString(),
      clips: showReel.clips.map((clip) => ({
        id: clip.id.toString(),
        name: clip.name,
        description: clip.description,
        videoStandard: clip.videoStandard.toString(),
        videoDefinition: clip.videoDefinition.toString(),
        startTimecode: clip.startTimecode.toString(),
        endTimecode: clip.endTimecode.toString(),
        duration: clip.duration.toString(),
      })),
      clipCount: showReel.clipCount,
      totalDuration: showReel.totalDuration.toString(),
      createdAt: showReel.createdAt,
      updatedAt: showReel.updatedAt,
    }
  }
}
