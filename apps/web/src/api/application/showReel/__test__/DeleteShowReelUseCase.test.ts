import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../domain/showReel/entity/ShowReel'
import { DrizzleShowReelRepository } from '../../../infrastructure/repository/showReel/DrizzleShowReelRepository'
import { DeleteShowReelUseCase } from '../DeleteShowReelUseCase'

import { getTestDB } from '@/test/database'

describe('DeleteShowReelUseCase', () => {
  let useCase: DeleteShowReelUseCase
  let repository: DrizzleShowReelRepository

  beforeEach(() => {
    repository = new DrizzleShowReelRepository(getTestDB())
    useCase = new DeleteShowReelUseCase(repository)
  })

  describe('execute', () => {
    it('存在するShowReelを削除できる', async () => {
      // 事前にShowReelを作成
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await repository.save(showReel)

      const result = await useCase.execute({ id: showReel.id.toString() })

      expect(result.id).toBe(showReel.id.toString())
      expect(result.deleted).toBe(true)

      // DBからも確認
      const deleted = await repository.findById(showReel.id)
      expect(deleted).toBeNull()
    })

    it('存在しないShowReelを削除してもエラーにならない（冪等性）', async () => {
      const result = await useCase.execute({ id: 'non-existent-id' })

      expect(result.id).toBe('non-existent-id')
      expect(result.deleted).toBe(false)
    })
  })
})
