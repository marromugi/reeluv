/**
 * ドメインエラーの基底クラス
 */
export abstract class DomainError extends Error {
  abstract readonly code: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

/**
 * 無効なタイムコードエラー
 */
export class InvalidTimecodeError extends DomainError {
  readonly code = 'INVALID_TIMECODE'

  constructor(timecodeStr: string, reason: string) {
    super(`無効なタイムコード "${timecodeStr}": ${reason}`)
  }
}

/**
 * 無効なビデオ規格エラー
 */
export class InvalidVideoStandardError extends DomainError {
  readonly code = 'INVALID_VIDEO_STANDARD'

  constructor(value: string) {
    super(`無効なビデオ規格: "${value}"。PAL または NTSC を指定してください。`)
  }
}

/**
 * 無効なビデオ解像度エラー
 */
export class InvalidVideoDefinitionError extends DomainError {
  readonly code = 'INVALID_VIDEO_DEFINITION'

  constructor(value: string) {
    super(`無効なビデオ解像度: "${value}"。SD または HD を指定してください。`)
  }
}

/**
 * 互換性のないクリップエラー
 */
export class IncompatibleClipError extends DomainError {
  readonly code = 'INCOMPATIBLE_CLIP'

  constructor(
    clipStandard: string,
    clipDefinition: string,
    reelStandard: string,
    reelDefinition: string
  ) {
    super(
      `クリップ (${clipStandard}/${clipDefinition}) は ` +
        `ショーリール (${reelStandard}/${reelDefinition}) と互換性がありません`
    )
  }
}

/**
 * タイムコード範囲エラー
 */
export class InvalidTimecodeRangeError extends DomainError {
  readonly code = 'INVALID_TIMECODE_RANGE'

  constructor() {
    super('終了タイムコードは開始タイムコードより後でなければなりません')
  }
}

/**
 * 空の名前エラー
 */
export class EmptyNameError extends DomainError {
  readonly code = 'EMPTY_NAME'

  constructor(entityName: string) {
    super(`${entityName}の名前は空にできません`)
  }
}

/**
 * 異なるビデオ規格間の操作エラー
 */
export class MixedVideoStandardError extends DomainError {
  readonly code = 'MIXED_VIDEO_STANDARD'

  constructor() {
    super('異なるビデオ規格のタイムコード間で演算を行う場合は、明示的な変換が必要です')
  }
}

/**
 * 無効なIDエラー
 */
export class InvalidIdError extends DomainError {
  readonly code = 'INVALID_ID'

  constructor(entityName: string) {
    super(`${entityName}のIDは空にできません`)
  }
}

/**
 * クリップが見つからないエラー
 */
export class ClipNotFoundError extends DomainError {
  readonly code = 'CLIP_NOT_FOUND'

  constructor(clipId: string) {
    super(`クリップ (ID: ${clipId}) が見つかりません`)
  }
}

/**
 * 負のタイムコードエラー
 */
export class NegativeTimecodeError extends DomainError {
  readonly code = 'NEGATIVE_TIMECODE'

  constructor() {
    super('タイムコードは負の値にできません')
  }
}

/**
 * クリップが参照されているため物理削除できないエラー
 */
export class ClipInUseError extends DomainError {
  readonly code = 'CLIP_IN_USE'

  constructor(clipId: string) {
    super(`クリップ (ID: ${clipId}) はショーリールから参照されているため物理削除できません`)
  }
}

/**
 * 既に削除済みのクリップエラー
 */
export class ClipAlreadyDeletedError extends DomainError {
  readonly code = 'CLIP_ALREADY_DELETED'

  constructor(clipId: string) {
    super(`クリップ (ID: ${clipId}) は既に削除されています`)
  }
}

/**
 * クリップがソフトデリートされていないエラー
 */
export class ClipNotSoftDeletedError extends DomainError {
  readonly code = 'CLIP_NOT_SOFT_DELETED'

  constructor(clipId: string) {
    super(
      `クリップ (ID: ${clipId}) はソフトデリートされていません。物理削除の前にソフトデリートが必要です`
    )
  }
}

/**
 * クリップインデックスが範囲外エラー
 */
export class ClipIndexOutOfBoundsError extends DomainError {
  readonly code = 'CLIP_INDEX_OUT_OF_BOUNDS'

  constructor(index: number, clipCount: number) {
    super(`クリップインデックス ${index} は範囲外です (クリップ数: ${clipCount})`)
  }
}
