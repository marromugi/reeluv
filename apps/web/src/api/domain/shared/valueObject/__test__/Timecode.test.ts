import {
  InvalidTimecodeError,
  NegativeTimecodeError,
} from '../../error/DomainError'
import { Timecode } from '../Timecode'
import { VideoStandard } from '../VideoStandard'

describe('Timecode', () => {
  describe('zero', () => {
    it('ゼロタイムコードを生成できる', () => {
      const tc = Timecode.zero(VideoStandard.pal())
      expect(tc.toString()).toBe('00:00:00:00')
      expect(tc.totalFrames).toBe(0)
    })
  })

  describe('fromString', () => {
    it('正しいフォーマットのタイムコードをパースできる', () => {
      const tc = Timecode.fromString('01:30:45:12', VideoStandard.pal())
      expect(tc.hours).toBe(1)
      expect(tc.minutes).toBe(30)
      expect(tc.seconds).toBe(45)
      expect(tc.frames).toBe(12)
      expect(tc.toString()).toBe('01:30:45:12')
    })

    it('PALで24フレームまで有効', () => {
      const tc = Timecode.fromString('00:00:00:24', VideoStandard.pal())
      expect(tc.frames).toBe(24)
    })

    it('PALで25以上のフレームはエラーになる', () => {
      expect(() =>
        Timecode.fromString('00:00:00:25', VideoStandard.pal())
      ).toThrow(InvalidTimecodeError)
    })

    it('NTSCで29フレームまで有効', () => {
      const tc = Timecode.fromString('00:00:00:29', VideoStandard.ntsc())
      expect(tc.frames).toBe(29)
    })

    it('NTSCで30以上のフレームはエラーになる', () => {
      expect(() =>
        Timecode.fromString('00:00:00:30', VideoStandard.ntsc())
      ).toThrow(InvalidTimecodeError)
    })

    it('無効なフォーマットはエラーになる', () => {
      expect(() =>
        Timecode.fromString('1:30:45:12', VideoStandard.pal())
      ).toThrow(InvalidTimecodeError)
      expect(() =>
        Timecode.fromString('01:30:45', VideoStandard.pal())
      ).toThrow(InvalidTimecodeError)
      expect(() => Timecode.fromString('invalid', VideoStandard.pal())).toThrow(
        InvalidTimecodeError
      )
    })

    it('範囲外の分はエラーになる', () => {
      expect(() =>
        Timecode.fromString('00:60:00:00', VideoStandard.pal())
      ).toThrow(InvalidTimecodeError)
    })

    it('範囲外の秒はエラーになる', () => {
      expect(() =>
        Timecode.fromString('00:00:60:00', VideoStandard.pal())
      ).toThrow(InvalidTimecodeError)
    })
  })

  describe('fromFrames', () => {
    it('フレーム数からタイムコードを生成できる', () => {
      // 25fps: 1秒 = 25フレーム
      const tc = Timecode.fromFrames(25, VideoStandard.pal())
      expect(tc.toString()).toBe('00:00:01:00')
    })

    it('複雑なフレーム数を正しく変換できる', () => {
      // 90000フレーム = 1時間 (PAL: 25fps * 3600秒)
      const tc = Timecode.fromFrames(90000, VideoStandard.pal())
      expect(tc.toString()).toBe('01:00:00:00')
    })

    it('負のフレーム数はエラーになる', () => {
      expect(() => Timecode.fromFrames(-1, VideoStandard.pal())).toThrow(
        NegativeTimecodeError
      )
    })
  })

  describe('fromMilliseconds', () => {
    it('ミリ秒からタイムコードを生成できる', () => {
      // PAL: 1フレーム = 40ms
      const tc = Timecode.fromMilliseconds(1000, VideoStandard.pal())
      expect(tc.toString()).toBe('00:00:01:00')
    })

    it('NTSCでミリ秒を正しく変換できる', () => {
      // NTSC: 1フレーム ≈ 33.33ms
      const tc = Timecode.fromMilliseconds(1000, VideoStandard.ntsc())
      expect(tc.toString()).toBe('00:00:01:00')
    })
  })

  describe('totalFrames', () => {
    it('PALの総フレーム数を正しく計算する', () => {
      // 1時間 = 3600秒 * 25fps = 90000フレーム
      const tc = Timecode.fromString('01:00:00:00', VideoStandard.pal())
      expect(tc.totalFrames).toBe(90000)
    })

    it('NTSCの総フレーム数を正しく計算する', () => {
      // 1時間 = 3600秒 * 30fps = 108000フレーム
      const tc = Timecode.fromString('01:00:00:00', VideoStandard.ntsc())
      expect(tc.totalFrames).toBe(108000)
    })

    it('複合的なタイムコードの総フレーム数を計算できる', () => {
      // 00:00:30:12 (PAL): 30秒 * 25 + 12 = 762フレーム
      const tc = Timecode.fromString('00:00:30:12', VideoStandard.pal())
      expect(tc.totalFrames).toBe(762)
    })
  })

  describe('add', () => {
    it('PAL同士のタイムコードを加算できる', () => {
      const tc1 = Timecode.fromString('00:00:30:12', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:01:30:00', VideoStandard.pal())
      expect(tc1.add(tc2).toString()).toBe('00:02:00:12')
    })

    it('フレームのオーバーフローを正しく処理する', () => {
      const tc1 = Timecode.fromString('00:00:00:20', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:00:00:10', VideoStandard.pal())
      // 20 + 10 = 30フレーム = 1秒5フレーム (PAL 25fps)
      expect(tc1.add(tc2).toString()).toBe('00:00:01:05')
    })

    it('秒のオーバーフローを正しく処理する', () => {
      const tc1 = Timecode.fromString('00:00:50:00', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:00:20:00', VideoStandard.pal())
      expect(tc1.add(tc2).toString()).toBe('00:01:10:00')
    })

    it('異なる規格のタイムコードを加算できる（変換される）', () => {
      const palTc = Timecode.fromString('00:00:01:00', VideoStandard.pal())
      const ntscTc = Timecode.fromString('00:00:01:00', VideoStandard.ntsc())
      const result = palTc.add(ntscTc)
      // 結果はPAL規格
      expect(result.videoStandard.equals(VideoStandard.pal())).toBe(true)
      expect(result.toString()).toBe('00:00:02:00')
    })
  })

  describe('subtract', () => {
    it('タイムコードの減算ができる', () => {
      const tc1 = Timecode.fromString('00:02:00:00', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:00:30:12', VideoStandard.pal())
      expect(tc1.subtract(tc2).toString()).toBe('00:01:29:13')
    })

    it('フレームの借り入れを正しく処理する', () => {
      const tc1 = Timecode.fromString('00:00:01:05', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:00:00:10', VideoStandard.pal())
      // 30フレーム - 10フレーム = 20フレーム
      expect(tc1.subtract(tc2).toString()).toBe('00:00:00:20')
    })

    it('結果が負になる場合はエラーになる', () => {
      const tc1 = Timecode.fromString('00:00:30:00', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:01:00:00', VideoStandard.pal())
      expect(() => tc1.subtract(tc2)).toThrow(NegativeTimecodeError)
    })
  })

  describe('equals', () => {
    it('同じタイムコードはtrueを返す', () => {
      const tc1 = Timecode.fromString('00:01:30:12', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:01:30:12', VideoStandard.pal())
      expect(tc1.equals(tc2)).toBe(true)
    })

    it('異なるタイムコードはfalseを返す', () => {
      const tc1 = Timecode.fromString('00:01:30:12', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:01:30:13', VideoStandard.pal())
      expect(tc1.equals(tc2)).toBe(false)
    })
  })

  describe('compareTo', () => {
    it('同じ値の場合は0を返す', () => {
      const tc1 = Timecode.fromString('00:01:00:00', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:01:00:00', VideoStandard.pal())
      expect(tc1.compareTo(tc2)).toBe(0)
    })

    it('小さい場合は-1を返す', () => {
      const tc1 = Timecode.fromString('00:00:30:00', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:01:00:00', VideoStandard.pal())
      expect(tc1.compareTo(tc2)).toBe(-1)
    })

    it('大きい場合は1を返す', () => {
      const tc1 = Timecode.fromString('00:02:00:00', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:01:00:00', VideoStandard.pal())
      expect(tc1.compareTo(tc2)).toBe(1)
    })
  })

  describe('比較メソッド', () => {
    const smaller = Timecode.fromString('00:00:30:00', VideoStandard.pal())
    const larger = Timecode.fromString('00:01:00:00', VideoStandard.pal())
    const equal = Timecode.fromString('00:00:30:00', VideoStandard.pal())

    it('isGreaterThan', () => {
      expect(larger.isGreaterThan(smaller)).toBe(true)
      expect(smaller.isGreaterThan(larger)).toBe(false)
      expect(smaller.isGreaterThan(equal)).toBe(false)
    })

    it('isLessThan', () => {
      expect(smaller.isLessThan(larger)).toBe(true)
      expect(larger.isLessThan(smaller)).toBe(false)
      expect(smaller.isLessThan(equal)).toBe(false)
    })

    it('isGreaterThanOrEqual', () => {
      expect(larger.isGreaterThanOrEqual(smaller)).toBe(true)
      expect(smaller.isGreaterThanOrEqual(equal)).toBe(true)
      expect(smaller.isGreaterThanOrEqual(larger)).toBe(false)
    })

    it('isLessThanOrEqual', () => {
      expect(smaller.isLessThanOrEqual(larger)).toBe(true)
      expect(smaller.isLessThanOrEqual(equal)).toBe(true)
      expect(larger.isLessThanOrEqual(smaller)).toBe(false)
    })
  })

  describe('convertTo', () => {
    it('同じ規格への変換は同じインスタンスを返す', () => {
      const tc = Timecode.fromString('00:01:00:00', VideoStandard.pal())
      expect(tc.convertTo(VideoStandard.pal())).toBe(tc)
    })

    it('PALからNTSCに変換できる', () => {
      // 1秒 = 1000ms
      const palTc = Timecode.fromString('00:00:01:00', VideoStandard.pal())
      const ntscTc = palTc.convertTo(VideoStandard.ntsc())
      expect(ntscTc.videoStandard.equals(VideoStandard.ntsc())).toBe(true)
      // 1000ms / 33.33ms ≈ 30フレーム = 1秒
      expect(ntscTc.toString()).toBe('00:00:01:00')
    })
  })

  describe('diff', () => {
    it('タイムコードの差分を取得できる', () => {
      const tc1 = Timecode.fromString('00:02:00:00', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:01:30:00', VideoStandard.pal())
      expect(tc1.diff(tc2).toString()).toBe('00:00:30:00')
    })

    it('差分は常に正の値になる', () => {
      const tc1 = Timecode.fromString('00:01:00:00', VideoStandard.pal())
      const tc2 = Timecode.fromString('00:02:00:00', VideoStandard.pal())
      expect(tc1.diff(tc2).toString()).toBe('00:01:00:00')
    })
  })

  describe('isZero', () => {
    it('ゼロタイムコードはtrueを返す', () => {
      expect(Timecode.zero(VideoStandard.pal()).isZero()).toBe(true)
    })

    it('非ゼロタイムコードはfalseを返す', () => {
      const tc = Timecode.fromString('00:00:00:01', VideoStandard.pal())
      expect(tc.isZero()).toBe(false)
    })
  })

  describe('受け入れテスト: NTSC SD クリップ合計', () => {
    it('NTSC SDクリップの合計が00:00:54:08になる', () => {
      // Clip 2: 00:00:15:27
      // Clip 4: 00:00:18:11
      // Clip 5: 00:00:20:00
      const clip2 = Timecode.fromString('00:00:15:27', VideoStandard.ntsc())
      const clip4 = Timecode.fromString('00:00:18:11', VideoStandard.ntsc())
      const clip5 = Timecode.fromString('00:00:20:00', VideoStandard.ntsc())

      const total = clip2.add(clip4).add(clip5)
      expect(total.toString()).toBe('00:00:54:08')
    })
  })

  describe('受け入れテスト: PAL SD クリップ合計', () => {
    it('PAL SDクリップ (Clip1 + Clip3) の合計を計算', () => {
      // Clip 1: 00:00:30:12
      // Clip 3: 00:01:30:00
      const clip1 = Timecode.fromString('00:00:30:12', VideoStandard.pal())
      const clip3 = Timecode.fromString('00:01:30:00', VideoStandard.pal())

      const total = clip1.add(clip3)
      expect(total.toString()).toBe('00:02:00:12')
    })
  })
})
