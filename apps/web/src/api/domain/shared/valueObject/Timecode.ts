import { InvalidTimecodeError, NegativeTimecodeError } from '../error/DomainError'

import { VideoStandard } from './VideoStandard'

/**
 * タイムコードのコンポーネント
 */
interface TimecodeComponents {
  hours: number
  minutes: number
  seconds: number
  frames: number
}

/**
 * タイムコードを表す値オブジェクト
 * フォーマット: HH:MM:ss:ff (時:分:秒:フレーム)
 *
 * フレームレートに依存する計算を正確に行う
 * 不変オブジェクトとして実装
 */
export class Timecode {
  private readonly _hours: number
  private readonly _minutes: number
  private readonly _seconds: number
  private readonly _frames: number
  private readonly _standard: VideoStandard

  private constructor(
    hours: number,
    minutes: number,
    seconds: number,
    frames: number,
    standard: VideoStandard
  ) {
    this._hours = hours
    this._minutes = minutes
    this._seconds = seconds
    this._frames = frames
    this._standard = standard
  }

  /**
   * ゼロタイムコードを生成
   */
  static zero(standard: VideoStandard): Timecode {
    return new Timecode(0, 0, 0, 0, standard)
  }

  /**
   * 文字列からTimecodeを生成
   * @param timecodeStr HH:MM:ss:ff 形式の文字列
   * @param standard ビデオ規格
   * @throws InvalidTimecodeError 無効なフォーマットの場合
   */
  static fromString(timecodeStr: string, standard: VideoStandard): Timecode {
    const pattern = /^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/
    const match = timecodeStr.match(pattern)

    if (!match) {
      throw new InvalidTimecodeError(timecodeStr, 'フォーマットは HH:MM:ss:ff である必要があります')
    }

    const hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const seconds = parseInt(match[3], 10)
    const frames = parseInt(match[4], 10)

    Timecode.validateComponents({ hours, minutes, seconds, frames }, standard, timecodeStr)

    return new Timecode(hours, minutes, seconds, frames, standard)
  }

  /**
   * 総フレーム数からTimecodeを生成
   */
  static fromFrames(totalFrames: number, standard: VideoStandard): Timecode {
    if (totalFrames < 0) {
      throw new NegativeTimecodeError()
    }

    const fps = standard.fps
    const framesPerSecond = fps
    const framesPerMinute = fps * 60
    const framesPerHour = fps * 3600

    const hours = Math.floor(totalFrames / framesPerHour)
    const remainingAfterHours = totalFrames % framesPerHour
    const minutes = Math.floor(remainingAfterHours / framesPerMinute)
    const remainingAfterMinutes = remainingAfterHours % framesPerMinute
    const seconds = Math.floor(remainingAfterMinutes / framesPerSecond)
    const frames = remainingAfterMinutes % framesPerSecond

    return new Timecode(hours, minutes, seconds, frames, standard)
  }

  /**
   * ミリ秒からTimecodeを生成
   * 浮動小数点の誤差を考慮して四捨五入
   */
  static fromMilliseconds(ms: number, standard: VideoStandard): Timecode {
    if (ms < 0) {
      throw new NegativeTimecodeError()
    }

    const totalFrames = Math.round(ms / standard.frameMilliseconds)
    return Timecode.fromFrames(totalFrames, standard)
  }

  /**
   * コンポーネントの検証
   */
  private static validateComponents(
    components: TimecodeComponents,
    standard: VideoStandard,
    originalStr: string
  ): void {
    const { hours, minutes, seconds, frames } = components

    if (hours < 0 || hours > 99) {
      throw new InvalidTimecodeError(originalStr, '時は0-99の範囲である必要があります')
    }
    if (minutes < 0 || minutes > 59) {
      throw new InvalidTimecodeError(originalStr, '分は0-59の範囲である必要があります')
    }
    if (seconds < 0 || seconds > 59) {
      throw new InvalidTimecodeError(originalStr, '秒は0-59の範囲である必要があります')
    }
    if (frames < 0 || frames >= standard.fps) {
      throw new InvalidTimecodeError(
        originalStr,
        `フレームは0-${standard.fps - 1}の範囲である必要があります（${standard.toString()}）`
      )
    }
  }

  /**
   * 時を取得
   */
  get hours(): number {
    return this._hours
  }

  /**
   * 分を取得
   */
  get minutes(): number {
    return this._minutes
  }

  /**
   * 秒を取得
   */
  get seconds(): number {
    return this._seconds
  }

  /**
   * フレームを取得
   */
  get frames(): number {
    return this._frames
  }

  /**
   * ビデオ規格を取得
   */
  get videoStandard(): VideoStandard {
    return this._standard
  }

  /**
   * 総フレーム数を取得
   */
  get totalFrames(): number {
    const fps = this._standard.fps
    return this._hours * 3600 * fps + this._minutes * 60 * fps + this._seconds * fps + this._frames
  }

  /**
   * 総ミリ秒を取得
   */
  get totalMilliseconds(): number {
    return this.totalFrames * this._standard.frameMilliseconds
  }

  /**
   * 総秒数を取得（小数点以下含む）
   */
  get totalSeconds(): number {
    return this.totalMilliseconds / 1000
  }

  /**
   * タイムコードを加算
   * 異なる規格の場合、このインスタンスの規格に変換してから計算
   */
  add(other: Timecode): Timecode {
    const normalizedOther = other._standard.equals(this._standard)
      ? other
      : other.convertTo(this._standard)

    return Timecode.fromFrames(this.totalFrames + normalizedOther.totalFrames, this._standard)
  }

  /**
   * タイムコードを減算
   * 結果が負になる場合はエラー
   * @throws NegativeTimecodeError 結果が負になる場合
   */
  subtract(other: Timecode): Timecode {
    const normalizedOther = other._standard.equals(this._standard)
      ? other
      : other.convertTo(this._standard)

    const resultFrames = this.totalFrames - normalizedOther.totalFrames

    if (resultFrames < 0) {
      throw new NegativeTimecodeError()
    }

    return Timecode.fromFrames(resultFrames, this._standard)
  }

  /**
   * 他のTimecodeと等しいか判定
   * 規格が異なる場合はミリ秒ベースで比較
   */
  equals(other: Timecode): boolean {
    if (this._standard.equals(other._standard)) {
      return this.totalFrames === other.totalFrames
    }
    return Math.abs(this.totalMilliseconds - other.totalMilliseconds) < 1
  }

  /**
   * 他のTimecodeと比較
   * @returns -1: this < other, 0: this === other, 1: this > other
   */
  compareTo(other: Timecode): -1 | 0 | 1 {
    const thisMs = this.totalMilliseconds
    const otherMs = other.totalMilliseconds

    if (Math.abs(thisMs - otherMs) < 1) {
      return 0
    }
    return thisMs < otherMs ? -1 : 1
  }

  /**
   * このタイムコードが他より大きいか判定
   */
  isGreaterThan(other: Timecode): boolean {
    return this.compareTo(other) === 1
  }

  /**
   * このタイムコードが他より小さいか判定
   */
  isLessThan(other: Timecode): boolean {
    return this.compareTo(other) === -1
  }

  /**
   * このタイムコードが他以上か判定
   */
  isGreaterThanOrEqual(other: Timecode): boolean {
    return this.compareTo(other) >= 0
  }

  /**
   * このタイムコードが他以下か判定
   */
  isLessThanOrEqual(other: Timecode): boolean {
    return this.compareTo(other) <= 0
  }

  /**
   * 別のビデオ規格に変換
   * ミリ秒を保持しながらフレーム数を再計算
   */
  convertTo(targetStandard: VideoStandard): Timecode {
    if (this._standard.equals(targetStandard)) {
      return this
    }
    return Timecode.fromMilliseconds(this.totalMilliseconds, targetStandard)
  }

  /**
   * 他のTimecodeとの差分を取得（絶対値）
   */
  diff(other: Timecode): Timecode {
    const normalizedOther = other._standard.equals(this._standard)
      ? other
      : other.convertTo(this._standard)

    const diffFrames = Math.abs(this.totalFrames - normalizedOther.totalFrames)
    return Timecode.fromFrames(diffFrames, this._standard)
  }

  /**
   * ゼロかどうか判定
   */
  isZero(): boolean {
    return this.totalFrames === 0
  }

  /**
   * HH:MM:ss:ff 形式の文字列に変換
   */
  toString(): string {
    const pad = (n: number): string => n.toString().padStart(2, '0')
    return `${pad(this._hours)}:${pad(this._minutes)}:${pad(this._seconds)}:${pad(this._frames)}`
  }
}
