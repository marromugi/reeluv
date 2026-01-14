import { InvalidVideoStandardError } from '../error/DomainError'

/**
 * ビデオ規格の有効値
 */
export const VIDEO_STANDARDS = ['PAL', 'NTSC'] as const
export type VideoStandardValue = (typeof VIDEO_STANDARDS)[number]

/**
 * ビデオ規格を表す値オブジェクト
 *
 * PAL: 25fps（ヨーロッパ・オーストラリア等で使用）
 * NTSC: 30fps（北米・日本等で使用）
 */
export class VideoStandard {
  private static readonly PAL_FPS = 25
  private static readonly NTSC_FPS = 30

  private static readonly palInstance = new VideoStandard('PAL')
  private static readonly ntscInstance = new VideoStandard('NTSC')

  private constructor(private readonly value: VideoStandardValue) {}

  /**
   * PAL規格のインスタンスを取得
   */
  static pal(): VideoStandard {
    return VideoStandard.palInstance
  }

  /**
   * NTSC規格のインスタンスを取得
   */
  static ntsc(): VideoStandard {
    return VideoStandard.ntscInstance
  }

  /**
   * 文字列からVideoStandardを生成
   * @throws InvalidVideoStandardError 無効な値の場合
   */
  static fromString(value: string): VideoStandard {
    const upperValue = value.toUpperCase()
    if (upperValue === 'PAL') {
      return VideoStandard.pal()
    }
    if (upperValue === 'NTSC') {
      return VideoStandard.ntsc()
    }
    throw new InvalidVideoStandardError(value)
  }

  /**
   * フレームレート（fps）を取得
   */
  get fps(): number {
    return this.value === 'PAL' ? VideoStandard.PAL_FPS : VideoStandard.NTSC_FPS
  }

  /**
   * 1フレームあたりのミリ秒を取得
   */
  get frameMilliseconds(): number {
    return 1000 / this.fps
  }

  /**
   * PAL規格かどうかを判定
   */
  isPal(): boolean {
    return this.value === 'PAL'
  }

  /**
   * NTSC規格かどうかを判定
   */
  isNtsc(): boolean {
    return this.value === 'NTSC'
  }

  /**
   * 他のVideoStandardと等しいか判定
   */
  equals(other: VideoStandard): boolean {
    return this.value === other.value
  }

  /**
   * 文字列に変換
   */
  toString(): VideoStandardValue {
    return this.value
  }
}
