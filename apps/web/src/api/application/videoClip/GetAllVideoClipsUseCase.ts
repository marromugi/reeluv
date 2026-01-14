import type { VideoClipRepository } from '../../domain/videoClip/repository/VideoClipRepository'

/**
 * VideoClip一覧の各アイテム
 */
export interface VideoClipListItem {
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
 * 全VideoClip取得ユースケースの出力
 */
export interface GetAllVideoClipsOutput {
  clips: VideoClipListItem[]
}

/**
 * 全VideoClip取得ユースケース
 */
export class GetAllVideoClipsUseCase {
  constructor(private readonly videoClipRepository: VideoClipRepository) {}

  /**
   * 全てのVideoClipを取得する
   */
  async execute(): Promise<GetAllVideoClipsOutput> {
    const clips = await this.videoClipRepository.findAll()

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
