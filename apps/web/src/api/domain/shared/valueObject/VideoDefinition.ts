import { InvalidVideoDefinitionError } from '../error/DomainError'

/**
 * ビデオ解像度の有効値
 */
export const VIDEO_DEFINITIONS = ['SD', 'HD'] as const
export type VideoDefinitionValue = (typeof VIDEO_DEFINITIONS)[number]

/**
 * ビデオ解像度を表す値オブジェクト
 *
 * SD: 標準解像度 (Standard Definition)
 * HD: 高解像度 (High Definition)
 */
export class VideoDefinition {
  private static readonly sdInstance = new VideoDefinition('SD')
  private static readonly hdInstance = new VideoDefinition('HD')

  private constructor(private readonly value: VideoDefinitionValue) {}

  /**
   * SD解像度のインスタンスを取得
   */
  static sd(): VideoDefinition {
    return VideoDefinition.sdInstance
  }

  /**
   * HD解像度のインスタンスを取得
   */
  static hd(): VideoDefinition {
    return VideoDefinition.hdInstance
  }

  /**
   * 文字列からVideoDefinitionを生成
   * @throws InvalidVideoDefinitionError 無効な値の場合
   */
  static fromString(value: string): VideoDefinition {
    const upperValue = value.toUpperCase()
    if (upperValue === 'SD') {
      return VideoDefinition.sd()
    }
    if (upperValue === 'HD') {
      return VideoDefinition.hd()
    }
    throw new InvalidVideoDefinitionError(value)
  }

  /**
   * SD解像度かどうかを判定
   */
  isSd(): boolean {
    return this.value === 'SD'
  }

  /**
   * HD解像度かどうかを判定
   */
  isHd(): boolean {
    return this.value === 'HD'
  }

  /**
   * 他のVideoDefinitionと等しいか判定
   */
  equals(other: VideoDefinition): boolean {
    return this.value === other.value
  }

  /**
   * 文字列に変換
   */
  toString(): VideoDefinitionValue {
    return this.value
  }
}
