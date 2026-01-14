import { EmptyNameError } from '../../../domain/shared/error/DomainError'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../domain/showReel/entity/ShowReel'
import { DrizzleShowReelRepository } from '../../../infrastructure/repository/showReel/DrizzleShowReelRepository'
import { NotFoundError } from '../../shared/error/ApplicationError'
import { UpdateShowReelNameUseCase } from '../UpdateShowReelNameUseCase'

import { getTestDB } from '@/test/database'

describe('UpdateShowReelNameUseCase', () => {
  let useCase: UpdateShowReelNameUseCase
  let repository: DrizzleShowReelRepository

  beforeEach(() => {
    repository = new DrizzleShowReelRepository(getTestDB())
    useCase = new UpdateShowReelNameUseCase(repository)
  })

  describe('execute', () => {
    it('ShowReelの名前を更新できる', async () => {
      // 事前にShowReelを作成
      const showReel = ShowReel.create({
        name: '元の名前',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await repository.save(showReel)

      const result = await useCase.execute({
        id: showReel.id.toString(),
        name: '新しい名前',
      })

      expect(result.id).toBe(showReel.id.toString())
      expect(result.name).toBe('新しい名前')
      expect(result.updatedAt).toBeInstanceOf(Date)

      // DBからも確認
      const updated = await repository.findById(showReel.id)
      expect(updated?.name).toBe('新しい名前')
    })

    it('存在しないShowReelを更新しようとするとエラーになる', async () => {
      await expect(
        useCase.execute({
          id: 'non-existent-id',
          name: '新しい名前',
        })
      ).rejects.toThrow(NotFoundError)
    })

    it('空の名前で更新しようとするとエラーになる', async () => {
      // 事前にShowReelを作成
      const showReel = ShowReel.create({
        name: '元の名前',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await repository.save(showReel)

      await expect(
        useCase.execute({
          id: showReel.id.toString(),
          name: '',
        })
      ).rejects.toThrow(EmptyNameError)
    })
  })
})
