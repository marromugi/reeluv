import {
  EmptyNameError,
  InvalidTimecodeRangeError,
} from '../../shared/error/DomainError'
import { Timecode } from '../../shared/valueObject/Timecode'
import { VideoDefinition } from '../../shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../shared/valueObject/VideoStandard'
import { VideoClipId } from '../valueObject/VideoClipId'

/**
 * VideoClip作成パラメータ
 */
export interface CreateVideoClipParams {
  id?: VideoClipId
  name: string
  description?: string | null
  videoStandard: VideoStandard
  videoDefinition: VideoDefinition
  startTimecode: Timecode
  endTimecode: Timecode
}

/**
 * VideoClip再構築パラメータ（DBから復元時）
 */
export interface ReconstructVideoClipParams {
  id: VideoClipId
  name: string
  description: string | null
  videoStandard: VideoStandard
  videoDefinition: VideoDefinition
  startTimecode: Timecode
  endTimecode: Timecode
}

/**
 * ビデオクリップエンティティ
 *
 * 不変条件:
 * - endTimecode > startTimecode
 * - name は空文字列不可
 * - startTimecode と endTimecode は同じ VideoStandard
 */
export class VideoClip {
  private constructor(
    private readonly _id: VideoClipId,
    private readonly _name: string,
    private readonly _description: string | null,
    private readonly _videoStandard: VideoStandard,
    private readonly _videoDefinition: VideoDefinition,
    private readonly _startTimecode: Timecode,
    private readonly _endTimecode: Timecode
  ) {}

  /**
   * 新規VideoClipを作成
   * @throws EmptyNameError 名前が空の場合
   * @throws InvalidTimecodeRangeError 終了タイムコードが開始以前の場合
   */
  static create(params: CreateVideoClipParams): VideoClip {
    VideoClip.validateName(params.name)
    VideoClip.validateTimecodeRange(params.startTimecode, params.endTimecode)

    return new VideoClip(
      params.id ?? VideoClipId.create(),
      params.name.trim(),
      params.description ?? null,
      params.videoStandard,
      params.videoDefinition,
      params.startTimecode,
      params.endTimecode
    )
  }

  /**
   * DBから再構築（バリデーションなし）
   */
  static reconstruct(params: ReconstructVideoClipParams): VideoClip {
    return new VideoClip(
      params.id,
      params.name,
      params.description,
      params.videoStandard,
      params.videoDefinition,
      params.startTimecode,
      params.endTimecode
    )
  }

  private static validateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new EmptyNameError('VideoClip')
    }
  }

  private static validateTimecodeRange(
    start: Timecode,
    end: Timecode
  ): void {
    if (!end.isGreaterThan(start)) {
      throw new InvalidTimecodeRangeError()
    }
  }

  /**
   * IDを取得
   */
  get id(): VideoClipId {
    return this._id
  }

  /**
   * 名前を取得
   */
  get name(): string {
    return this._name
  }

  /**
   * 説明を取得
   */
  get description(): string | null {
    return this._description
  }

  /**
   * ビデオ規格を取得
   */
  get videoStandard(): VideoStandard {
    return this._videoStandard
  }

  /**
   * ビデオ解像度を取得
   */
  get videoDefinition(): VideoDefinition {
    return this._videoDefinition
  }

  /**
   * 開始タイムコードを取得
   */
  get startTimecode(): Timecode {
    return this._startTimecode
  }

  /**
   * 終了タイムコードを取得
   */
  get endTimecode(): Timecode {
    return this._endTimecode
  }

  /**
   * 再生時間を取得
   */
  get duration(): Timecode {
    return this._endTimecode.subtract(this._startTimecode)
  }

  /**
   * 指定された規格と解像度と互換性があるか判定
   */
  isCompatibleWithStandardAndDefinition(
    standard: VideoStandard,
    definition: VideoDefinition
  ): boolean {
    return (
      this._videoStandard.equals(standard) &&
      this._videoDefinition.equals(definition)
    )
  }

  /**
   * 他のVideoClipとID比較で等しいか判定
   */
  equals(other: VideoClip): boolean {
    return this._id.equals(other._id)
  }
}
