import { InvalidVideoStandardError } from '../../error/DomainError'
import { VideoStandard } from '../VideoStandard'

describe('VideoStandard', () => {
  describe('ファクトリメソッド', () => {
    it('PALインスタンスを取得できる', () => {
      const standard = VideoStandard.pal()
      expect(standard.toString()).toBe('PAL')
    })

    it('NTSCインスタンスを取得できる', () => {
      const standard = VideoStandard.ntsc()
      expect(standard.toString()).toBe('NTSC')
    })

    it('シングルトンパターンで同一インスタンスを返す', () => {
      const pal1 = VideoStandard.pal()
      const pal2 = VideoStandard.pal()
      expect(pal1).toBe(pal2)

      const ntsc1 = VideoStandard.ntsc()
      const ntsc2 = VideoStandard.ntsc()
      expect(ntsc1).toBe(ntsc2)
    })
  })

  describe('fromString', () => {
    it('PAL文字列からインスタンスを生成できる', () => {
      expect(VideoStandard.fromString('PAL').toString()).toBe('PAL')
    })

    it('NTSC文字列からインスタンスを生成できる', () => {
      expect(VideoStandard.fromString('NTSC').toString()).toBe('NTSC')
    })

    it('小文字でも変換できる', () => {
      expect(VideoStandard.fromString('pal').toString()).toBe('PAL')
      expect(VideoStandard.fromString('ntsc').toString()).toBe('NTSC')
    })

    it('無効な値はエラーになる', () => {
      expect(() => VideoStandard.fromString('SECAM')).toThrow(InvalidVideoStandardError)
      expect(() => VideoStandard.fromString('')).toThrow(InvalidVideoStandardError)
    })
  })

  describe('fps', () => {
    it('PALは25fpsを返す', () => {
      expect(VideoStandard.pal().fps).toBe(25)
    })

    it('NTSCは30fpsを返す', () => {
      expect(VideoStandard.ntsc().fps).toBe(30)
    })
  })

  describe('frameMilliseconds', () => {
    it('PALは40ミリ秒を返す', () => {
      expect(VideoStandard.pal().frameMilliseconds).toBe(40)
    })

    it('NTSCは約33.33ミリ秒を返す', () => {
      expect(VideoStandard.ntsc().frameMilliseconds).toBeCloseTo(33.333, 2)
    })
  })

  describe('isPal / isNtsc', () => {
    it('PALの場合isPalがtrueを返す', () => {
      expect(VideoStandard.pal().isPal()).toBe(true)
      expect(VideoStandard.pal().isNtsc()).toBe(false)
    })

    it('NTSCの場合isNtscがtrueを返す', () => {
      expect(VideoStandard.ntsc().isPal()).toBe(false)
      expect(VideoStandard.ntsc().isNtsc()).toBe(true)
    })
  })

  describe('equals', () => {
    it('同じ規格同士はtrueを返す', () => {
      expect(VideoStandard.pal().equals(VideoStandard.pal())).toBe(true)
      expect(VideoStandard.ntsc().equals(VideoStandard.ntsc())).toBe(true)
    })

    it('異なる規格はfalseを返す', () => {
      expect(VideoStandard.pal().equals(VideoStandard.ntsc())).toBe(false)
      expect(VideoStandard.ntsc().equals(VideoStandard.pal())).toBe(false)
    })
  })
})
