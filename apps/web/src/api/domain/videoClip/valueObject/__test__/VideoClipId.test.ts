import { InvalidIdError } from '../../../shared/error/DomainError'
import { VideoClipId } from '../VideoClipId'

describe('VideoClipId', () => {
  describe('create', () => {
    it('新規IDを生成できる', () => {
      const id = VideoClipId.create()
      expect(id.toString()).toBeTruthy()
      expect(id.toString().length).toBeGreaterThan(0)
    })

    it('毎回異なるIDを生成する', () => {
      const id1 = VideoClipId.create()
      const id2 = VideoClipId.create()
      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('fromString', () => {
    it('文字列からIDを生成できる', () => {
      const id = VideoClipId.fromString('clip-id-456')
      expect(id.toString()).toBe('clip-id-456')
    })

    it('空文字列はエラーになる', () => {
      expect(() => VideoClipId.fromString('')).toThrow(InvalidIdError)
    })

    it('空白のみの文字列はエラーになる', () => {
      expect(() => VideoClipId.fromString('   ')).toThrow(InvalidIdError)
    })
  })

  describe('equals', () => {
    it('同じ値のIDはtrueを返す', () => {
      const id1 = VideoClipId.fromString('same-clip-id')
      const id2 = VideoClipId.fromString('same-clip-id')
      expect(id1.equals(id2)).toBe(true)
    })

    it('異なる値のIDはfalseを返す', () => {
      const id1 = VideoClipId.fromString('clip-1')
      const id2 = VideoClipId.fromString('clip-2')
      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('ID文字列を返す', () => {
      const id = VideoClipId.fromString('my-clip-id')
      expect(id.toString()).toBe('my-clip-id')
    })
  })
})
