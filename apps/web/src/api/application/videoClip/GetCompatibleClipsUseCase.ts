import type { ShowReelRepository } from '../../domain/showReel/repository/ShowReelRepository'
import { ShowReelId } from '../../domain/showReel/valueObject/ShowReelId'
import type { VideoClipRepository } from '../../domain/videoClip/repository/VideoClipRepository'
import { NotFoundError } from '../shared/error/ApplicationError'

/**
 * 互換クリップ取得ユースケースの入力
 */
export interface GetCompatibleClipsInput {
  showReelId: string
}

/**
 * クリップ情報
 */
export interface CompatibleClipOutput {
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
 * 互換クリップ取得ユースケースの出力
 */
export interface GetCompatibleClipsOutput {
  clips: CompatibleClipOutput[]
}

/**
 * 指定されたShowReelに追加可能なクリップを取得するユースケース
 */
export class GetCompatibleClipsUseCase {
  constructor(
    private readonly showReelRepository: ShowReelRepository,
    private readonly videoClipRepository: VideoClipRepository
  ) {}

  /**
   * ShowReelに追加可能なクリップを取得する
   * @throws NotFoundError ShowReelが存在しない場合
   */
  async execute(input: GetCompatibleClipsInput): Promise<GetCompatibleClipsOutput> {
    // ShowReelを取得
    const showReelId = ShowReelId.fromString(input.showReelId)
    const showReel = await this.showReelRepository.findById(showReelId)

    if (!showReel) {
      throw new NotFoundError('ShowReel', input.showReelId)
    }

    // 互換性のあるクリップを取得
    const clips = await this.videoClipRepository.findCompatible(
      showReel.videoStandard,
      showReel.videoDefinition
    )

    return {
      clips: clips.map((clip) => ({
        id: clip.id.toString(),
        name: clip.name,
        description: clip.description,
        videoStandard: clip.videoStandard.toString(),
        videoDefinition: clip.videoDefinition.toString(),
        startTimecode: clip.startTimecode.toString(),
        endTimecode: clip.endTimecode.toString(),
        duration: clip.duration.toString(),
      })),
    }
  }
}
