import {
  EmptyNameError,
  InvalidVideoDefinitionError,
  InvalidVideoStandardError,
} from '../../../domain/shared/error/DomainError'
import { DrizzleShowReelRepository } from '../../../infrastructure/repository/showReel/DrizzleShowReelRepository'
import { CreateShowReelUseCase } from '../CreateShowReelUseCase'

import { getTestDB } from '@/test/database'

describe('CreateShowReelUseCase', () => {
  let useCase: CreateShowReelUseCase

  beforeEach(() => {
    const repository = new DrizzleShowReelRepository(getTestDB())
    useCase = new CreateShowReelUseCase(repository)
  })

  describe('execute', () => {
    it('有効な入力でShowReelを作成できる', async () => {
      const input = {
        name: 'テストリール',
        videoStandard: 'PAL',
        videoDefinition: 'SD',
      }

      const result = await useCase.execute(input)

      expect(result.name).toBe('テストリール')
      expect(result.videoStandard).toBe('PAL')
      expect(result.videoDefinition).toBe('SD')
      expect(result.clipCount).toBe(0)
      expect(result.totalDuration).toBe('00:00:00:00')
      expect(result.id).toBeDefined()
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it('NTSC HDのShowReelを作成できる', async () => {
      const input = {
        name: 'NTSC HDリール',
        videoStandard: 'NTSC',
        videoDefinition: 'HD',
      }

      const result = await useCase.execute(input)

      expect(result.videoStandard).toBe('NTSC')
      expect(result.videoDefinition).toBe('HD')
    })

    it('空の名前でエラーになる', async () => {
      const input = {
        name: '',
        videoStandard: 'PAL',
        videoDefinition: 'SD',
      }

      await expect(useCase.execute(input)).rejects.toThrow(EmptyNameError)
    })

    it('無効なビデオ規格でエラーになる', async () => {
      const input = {
        name: 'テストリール',
        videoStandard: 'INVALID',
        videoDefinition: 'SD',
      }

      await expect(useCase.execute(input)).rejects.toThrow(InvalidVideoStandardError)
    })

    it('無効なビデオ解像度でエラーになる', async () => {
      const input = {
        name: 'テストリール',
        videoStandard: 'PAL',
        videoDefinition: 'INVALID',
      }

      await expect(useCase.execute(input)).rejects.toThrow(InvalidVideoDefinitionError)
    })
  })
})
