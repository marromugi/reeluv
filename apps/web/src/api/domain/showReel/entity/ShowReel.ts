import {
  ClipNotFoundError,
  EmptyNameError,
  IncompatibleClipError,
} from '../../shared/error/DomainError'
import { Timecode } from '../../shared/valueObject/Timecode'
import { VideoDefinition } from '../../shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../shared/valueObject/VideoStandard'
import { VideoClip } from '../../videoClip/entity/VideoClip'
import { VideoClipId } from '../../videoClip/valueObject/VideoClipId'
import { ShowReelId } from '../valueObject/ShowReelId'

/**
 * ShowReel作成パラメータ
 */
export interface CreateShowReelParams {
  id?: ShowReelId
  name: string
  videoStandard: VideoStandard
  videoDefinition: VideoDefinition
}

/**
 * ShowReel再構築パラメータ（DBから復元時）
 */
export interface ReconstructShowReelParams {
  id: ShowReelId
  name: string
  videoStandard: VideoStandard
  videoDefinition: VideoDefinition
  clips: VideoClip[]
  createdAt: Date
  updatedAt: Date
}

/**
 * ショーリールエンティティ（集約ルート）
 *
 * 不変条件:
 * - 全てのクリップは ShowReel と同じ VideoStandard を持つ
 * - 全てのクリップは ShowReel と同じ VideoDefinition を持つ
 * - name は空文字列不可
 */
export class ShowReel {
  private _name: string
  private readonly _clips: VideoClip[]
  private _updatedAt: Date

  private constructor(
    private readonly _id: ShowReelId,
    name: string,
    private readonly _videoStandard: VideoStandard,
    private readonly _videoDefinition: VideoDefinition,
    clips: VideoClip[],
    private readonly _createdAt: Date,
    updatedAt: Date
  ) {
    this._name = name
    this._clips = [...clips]
    this._updatedAt = updatedAt
  }

  /**
   * 新規ShowReelを作成
   * @throws EmptyNameError 名前が空の場合
   */
  static create(params: CreateShowReelParams): ShowReel {
    ShowReel.validateName(params.name)

    const now = new Date()
    return new ShowReel(
      params.id ?? ShowReelId.create(),
      params.name.trim(),
      params.videoStandard,
      params.videoDefinition,
      [],
      now,
      now
    )
  }

  /**
   * DBから再構築（バリデーションなし）
   */
  static reconstruct(params: ReconstructShowReelParams): ShowReel {
    return new ShowReel(
      params.id,
      params.name,
      params.videoStandard,
      params.videoDefinition,
      params.clips,
      params.createdAt,
      params.updatedAt
    )
  }

  private static validateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new EmptyNameError('ShowReel')
    }
  }

  /**
   * IDを取得
   */
  get id(): ShowReelId {
    return this._id
  }

  /**
   * 名前を取得
   */
  get name(): string {
    return this._name
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
   * クリップ一覧を取得（読み取り専用）
   */
  get clips(): readonly VideoClip[] {
    return this._clips
  }

  /**
   * 作成日時を取得
   */
  get createdAt(): Date {
    return this._createdAt
  }

  /**
   * 更新日時を取得
   */
  get updatedAt(): Date {
    return this._updatedAt
  }

  /**
   * クリップ数を取得
   */
  get clipCount(): number {
    return this._clips.length
  }

  /**
   * 総再生時間を取得
   */
  get totalDuration(): Timecode {
    if (this._clips.length === 0) {
      return Timecode.zero(this._videoStandard)
    }

    return this._clips.reduce(
      (total, clip) => total.add(clip.duration),
      Timecode.zero(this._videoStandard)
    )
  }

  /**
   * ショーリール名を変更
   * @throws EmptyNameError 名前が空の場合
   */
  rename(newName: string): void {
    ShowReel.validateName(newName)
    this._name = newName.trim()
    this._updatedAt = new Date()
  }

  /**
   * クリップを追加
   * 同じクリップを複数回追加可能
   * @throws IncompatibleClipError 互換性がない場合
   */
  addClip(clip: VideoClip): void {
    this.validateClipCompatibility(clip)
    this._clips.push(clip)
    this._updatedAt = new Date()
  }

  /**
   * クリップを削除
   * @throws ClipNotFoundError クリップが存在しない場合
   */
  removeClip(clipId: VideoClipId): void {
    const index = this._clips.findIndex((c) => c.id.equals(clipId))

    if (index === -1) {
      throw new ClipNotFoundError(clipId.toString())
    }

    this._clips.splice(index, 1)
    this._updatedAt = new Date()
  }

  /**
   * クリップの順序を変更
   * @throws ClipNotFoundError 存在しないクリップIDが含まれる場合
   */
  reorderClips(clipIds: VideoClipId[]): void {
    const reorderedClips: VideoClip[] = []

    for (const clipId of clipIds) {
      const clip = this._clips.find((c) => c.id.equals(clipId))
      if (!clip) {
        throw new ClipNotFoundError(clipId.toString())
      }
      reorderedClips.push(clip)
    }

    this._clips.length = 0
    this._clips.push(...reorderedClips)
    this._updatedAt = new Date()
  }

  /**
   * クリップが存在するか確認
   */
  hasClip(clipId: VideoClipId): boolean {
    return this._clips.some((c) => c.id.equals(clipId))
  }

  /**
   * 指定位置のクリップを取得
   */
  getClipAt(position: number): VideoClip | null {
    return this._clips[position] ?? null
  }

  /**
   * クリップが追加可能か確認
   */
  canAddClip(clip: VideoClip): boolean {
    return clip.isCompatibleWithStandardAndDefinition(this._videoStandard, this._videoDefinition)
  }

  /**
   * クリップの互換性を検証
   * @throws IncompatibleClipError 互換性がない場合
   */
  private validateClipCompatibility(clip: VideoClip): void {
    if (!this.canAddClip(clip)) {
      throw new IncompatibleClipError(
        clip.videoStandard.toString(),
        clip.videoDefinition.toString(),
        this._videoStandard.toString(),
        this._videoDefinition.toString()
      )
    }
  }

  /**
   * 他のShowReelとID比較で等しいか判定
   */
  equals(other: ShowReel): boolean {
    return this._id.equals(other._id)
  }
}
