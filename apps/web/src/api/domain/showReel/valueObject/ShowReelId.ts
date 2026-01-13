import { nanoid } from 'nanoid'

import { InvalidIdError } from '../../shared/error/DomainError'

/**
 * ShowReelの一意識別子を表す値オブジェクト
 * nanoidによって生成された文字列をラップ
 */
export class ShowReelId {
  private constructor(private readonly value: string) {}

  /**
   * 新規IDを生成
   */
  static create(): ShowReelId {
    return new ShowReelId(nanoid())
  }

  /**
   * 既存のID文字列からインスタンスを生成
   * @throws InvalidIdError 空文字列の場合
   */
  static fromString(id: string): ShowReelId {
    if (!id || id.trim() === '') {
      throw new InvalidIdError('ShowReel')
    }
    return new ShowReelId(id)
  }

  /**
   * 他のShowReelIdと等しいか判定
   */
  equals(other: ShowReelId): boolean {
    return this.value === other.value
  }

  /**
   * 文字列に変換
   */
  toString(): string {
    return this.value
  }
}
