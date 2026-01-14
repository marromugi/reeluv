import type { VideoClipRepository } from '../../domain/videoClip/repository/VideoClipRepository'
import { VideoClipId } from '../../domain/videoClip/valueObject/VideoClipId'
import { NotFoundError } from '../shared/error/ApplicationError'

/**
 * VideoClip取得ユースケースの入力
 */
export interface GetVideoClipInput {
  id: string
}

/**
 * VideoClip取得ユースケースの出力
 */
export interface GetVideoClipOutput {
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
 * VideoClip取得ユースケース
 */
export class GetVideoClipUseCase {
  constructor(private readonly videoClipRepository: VideoClipRepository) {}

  /**
   * IDを指定してVideoClipを取得する
   * @throws NotFoundError VideoClipが存在しない場合
   */
  async execute(input: GetVideoClipInput): Promise<GetVideoClipOutput> {
    const id = VideoClipId.fromString(input.id)
    const videoClip = await this.videoClipRepository.findById(id)

    if (!videoClip) {
      throw new NotFoundError('VideoClip', input.id)
    }

    return {
      id: videoClip.id.toString(),
      name: videoClip.name,
      description: videoClip.description,
      videoStandard: videoClip.videoStandard.toString(),
      videoDefinition: videoClip.videoDefinition.toString(),
      startTimecode: videoClip.startTimecode.toString(),
      endTimecode: videoClip.endTimecode.toString(),
      duration: videoClip.duration.toString(),
    }
  }
}
