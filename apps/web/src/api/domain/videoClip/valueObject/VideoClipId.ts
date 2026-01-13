import { nanoid } from 'nanoid'

import { InvalidIdError } from '../../shared/error/DomainError'

/**
 * VideoClipの一意識別子を表す値オブジェクト
 * nanoidによって生成された文字列をラップ
 */
export class VideoClipId {
  private constructor(private readonly value: string) {}

  /**
   * 新規IDを生成
   */
  static create(): VideoClipId {
    return new VideoClipId(nanoid())
  }

  /**
   * 既存のID文字列からインスタンスを生成
   * @throws InvalidIdError 空文字列の場合
   */
  static fromString(id: string): VideoClipId {
    if (!id || id.trim() === '') {
      throw new InvalidIdError('VideoClip')
    }
    return new VideoClipId(id)
  }

  /**
   * 他のVideoClipIdと等しいか判定
   */
  equals(other: VideoClipId): boolean {
    return this.value === other.value
  }

  /**
   * 文字列に変換
   */
  toString(): string {
    return this.value
  }
}
