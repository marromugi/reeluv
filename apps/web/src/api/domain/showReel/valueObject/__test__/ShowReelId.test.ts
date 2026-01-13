import { InvalidIdError } from '../../../shared/error/DomainError'
import { ShowReelId } from '../ShowReelId'

describe('ShowReelId', () => {
  describe('create', () => {
    it('新規IDを生成できる', () => {
      const id = ShowReelId.create()
      expect(id.toString()).toBeTruthy()
      expect(id.toString().length).toBeGreaterThan(0)
    })

    it('毎回異なるIDを生成する', () => {
      const id1 = ShowReelId.create()
      const id2 = ShowReelId.create()
      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('fromString', () => {
    it('文字列からIDを生成できる', () => {
      const id = ShowReelId.fromString('test-id-123')
      expect(id.toString()).toBe('test-id-123')
    })

    it('空文字列はエラーになる', () => {
      expect(() => ShowReelId.fromString('')).toThrow(InvalidIdError)
    })

    it('空白のみの文字列はエラーになる', () => {
      expect(() => ShowReelId.fromString('   ')).toThrow(InvalidIdError)
    })
  })

  describe('equals', () => {
    it('同じ値のIDはtrueを返す', () => {
      const id1 = ShowReelId.fromString('same-id')
      const id2 = ShowReelId.fromString('same-id')
      expect(id1.equals(id2)).toBe(true)
    })

    it('異なる値のIDはfalseを返す', () => {
      const id1 = ShowReelId.fromString('id-1')
      const id2 = ShowReelId.fromString('id-2')
      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('ID文字列を返す', () => {
      const id = ShowReelId.fromString('my-id')
      expect(id.toString()).toBe('my-id')
    })
  })
})
