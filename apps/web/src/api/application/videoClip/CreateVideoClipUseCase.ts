import { Timecode } from '../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../domain/shared/valueObject/VideoStandard'
import { VideoClip } from '../../domain/videoClip/entity/VideoClip'
import type { VideoClipRepository } from '../../domain/videoClip/repository/VideoClipRepository'

/**
 * VideoClip作成ユースケースの入力
 */
export interface CreateVideoClipInput {
  name: string
  description?: string | null
  videoStandard: string // 'PAL' | 'NTSC'
  videoDefinition: string // 'SD' | 'HD'
  startTimecode: string // 'HH:MM:ss:ff'
  endTimecode: string
}

/**
 * VideoClip作成ユースケースの出力
 */
export interface CreateVideoClipOutput {
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
 * VideoClip作成ユースケース
 */
export class CreateVideoClipUseCase {
  constructor(private readonly videoClipRepository: VideoClipRepository) {}

  /**
   * VideoClipを作成する
   * @throws InvalidVideoStandardError 無効なビデオ規格の場合
   * @throws InvalidVideoDefinitionError 無効なビデオ解像度の場合
   * @throws InvalidTimecodeError 無効なタイムコードの場合
   * @throws EmptyNameError 名前が空の場合
   * @throws InvalidTimecodeRangeError 終了タイムコードが開始以前の場合
   */
  async execute(input: CreateVideoClipInput): Promise<CreateVideoClipOutput> {
    // ValueObjectを生成（バリデーション実行）
    const videoStandard = VideoStandard.fromString(input.videoStandard)
    const videoDefinition = VideoDefinition.fromString(input.videoDefinition)
    const startTimecode = Timecode.fromString(input.startTimecode, videoStandard)
    const endTimecode = Timecode.fromString(input.endTimecode, videoStandard)

    // エンティティ作成
    const videoClip = VideoClip.create({
      name: input.name,
      description: input.description,
      videoStandard,
      videoDefinition,
      startTimecode,
      endTimecode,
    })

    // 保存
    await this.videoClipRepository.save(videoClip)

    // 出力DTOを返す
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
