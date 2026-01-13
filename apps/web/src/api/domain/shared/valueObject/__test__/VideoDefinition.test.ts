import { InvalidVideoDefinitionError } from '../../error/DomainError'
import { VideoDefinition } from '../VideoDefinition'

describe('VideoDefinition', () => {
  describe('ファクトリメソッド', () => {
    it('SDインスタンスを取得できる', () => {
      const definition = VideoDefinition.sd()
      expect(definition.toString()).toBe('SD')
    })

    it('HDインスタンスを取得できる', () => {
      const definition = VideoDefinition.hd()
      expect(definition.toString()).toBe('HD')
    })

    it('シングルトンパターンで同一インスタンスを返す', () => {
      const sd1 = VideoDefinition.sd()
      const sd2 = VideoDefinition.sd()
      expect(sd1).toBe(sd2)

      const hd1 = VideoDefinition.hd()
      const hd2 = VideoDefinition.hd()
      expect(hd1).toBe(hd2)
    })
  })

  describe('fromString', () => {
    it('SD文字列からインスタンスを生成できる', () => {
      expect(VideoDefinition.fromString('SD').toString()).toBe('SD')
    })

    it('HD文字列からインスタンスを生成できる', () => {
      expect(VideoDefinition.fromString('HD').toString()).toBe('HD')
    })

    it('小文字でも変換できる', () => {
      expect(VideoDefinition.fromString('sd').toString()).toBe('SD')
      expect(VideoDefinition.fromString('hd').toString()).toBe('HD')
    })

    it('無効な値はエラーになる', () => {
      expect(() => VideoDefinition.fromString('4K')).toThrow(
        InvalidVideoDefinitionError
      )
      expect(() => VideoDefinition.fromString('')).toThrow(
        InvalidVideoDefinitionError
      )
    })
  })

  describe('isSd / isHd', () => {
    it('SDの場合isSdがtrueを返す', () => {
      expect(VideoDefinition.sd().isSd()).toBe(true)
      expect(VideoDefinition.sd().isHd()).toBe(false)
    })

    it('HDの場合isHdがtrueを返す', () => {
      expect(VideoDefinition.hd().isSd()).toBe(false)
      expect(VideoDefinition.hd().isHd()).toBe(true)
    })
  })

  describe('equals', () => {
    it('同じ解像度同士はtrueを返す', () => {
      expect(VideoDefinition.sd().equals(VideoDefinition.sd())).toBe(true)
      expect(VideoDefinition.hd().equals(VideoDefinition.hd())).toBe(true)
    })

    it('異なる解像度はfalseを返す', () => {
      expect(VideoDefinition.sd().equals(VideoDefinition.hd())).toBe(false)
      expect(VideoDefinition.hd().equals(VideoDefinition.sd())).toBe(false)
    })
  })
})
