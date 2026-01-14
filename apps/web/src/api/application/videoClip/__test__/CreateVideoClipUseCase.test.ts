import {
  EmptyNameError,
  InvalidTimecodeRangeError,
  InvalidVideoDefinitionError,
  InvalidVideoStandardError,
} from '../../../domain/shared/error/DomainError'
import { DrizzleVideoClipRepository } from '../../../infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { CreateVideoClipUseCase } from '../CreateVideoClipUseCase'

import { getTestDB } from '@/test/database'

describe('CreateVideoClipUseCase', () => {
  let useCase: CreateVideoClipUseCase

  beforeEach(() => {
    const repository = new DrizzleVideoClipRepository(getTestDB())
    useCase = new CreateVideoClipUseCase(repository)
  })

  describe('execute', () => {
    it('有効な入力でVideoClipを作成できる', async () => {
      const input = {
        name: 'テストクリップ',
        description: '説明文',
        videoStandard: 'PAL',
        videoDefinition: 'SD',
        startTimecode: '00:00:00:00',
        endTimecode: '00:01:00:00',
      }

      const result = await useCase.execute(input)

      expect(result.name).toBe('テストクリップ')
      expect(result.description).toBe('説明文')
      expect(result.videoStandard).toBe('PAL')
      expect(result.videoDefinition).toBe('SD')
      expect(result.startTimecode).toBe('00:00:00:00')
      expect(result.endTimecode).toBe('00:01:00:00')
      expect(result.duration).toBe('00:01:00:00')
      expect(result.id).toBeDefined()
    })

    it('descriptionがnullでも作成できる', async () => {
      const input = {
        name: 'テストクリップ',
        videoStandard: 'NTSC',
        videoDefinition: 'HD',
        startTimecode: '00:00:00:00',
        endTimecode: '00:00:30:15',
      }

      const result = await useCase.execute(input)

      expect(result.name).toBe('テストクリップ')
      expect(result.description).toBeNull()
      expect(result.videoStandard).toBe('NTSC')
      expect(result.videoDefinition).toBe('HD')
    })

    it('空の名前でエラーになる', async () => {
      const input = {
        name: '',
        videoStandard: 'PAL',
        videoDefinition: 'SD',
        startTimecode: '00:00:00:00',
        endTimecode: '00:01:00:00',
      }

      await expect(useCase.execute(input)).rejects.toThrow(EmptyNameError)
    })

    it('無効なビデオ規格でエラーになる', async () => {
      const input = {
        name: 'テストクリップ',
        videoStandard: 'INVALID',
        videoDefinition: 'SD',
        startTimecode: '00:00:00:00',
        endTimecode: '00:01:00:00',
      }

      await expect(useCase.execute(input)).rejects.toThrow(InvalidVideoStandardError)
    })

    it('無効なビデオ解像度でエラーになる', async () => {
      const input = {
        name: 'テストクリップ',
        videoStandard: 'PAL',
        videoDefinition: 'INVALID',
        startTimecode: '00:00:00:00',
        endTimecode: '00:01:00:00',
      }

      await expect(useCase.execute(input)).rejects.toThrow(InvalidVideoDefinitionError)
    })

    it('終了タイムコードが開始タイムコード以前の場合エラーになる', async () => {
      const input = {
        name: 'テストクリップ',
        videoStandard: 'PAL',
        videoDefinition: 'SD',
        startTimecode: '00:01:00:00',
        endTimecode: '00:00:30:00',
      }

      await expect(useCase.execute(input)).rejects.toThrow(InvalidTimecodeRangeError)
    })
  })
})
