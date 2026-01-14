import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../domain/showReel/entity/ShowReel'
import { DrizzleShowReelRepository } from '../../../infrastructure/repository/showReel/DrizzleShowReelRepository'
import { GetAllShowReelsUseCase } from '../GetAllShowReelsUseCase'

import { getTestDB } from '@/test/database'

describe('GetAllShowReelsUseCase', () => {
  let useCase: GetAllShowReelsUseCase
  let repository: DrizzleShowReelRepository

  beforeEach(() => {
    repository = new DrizzleShowReelRepository(getTestDB())
    useCase = new GetAllShowReelsUseCase(repository)
  })

  describe('execute', () => {
    it('ShowReelがない場合は空の配列を返す', async () => {
      const result = await useCase.execute()

      expect(result.showReels).toEqual([])
    })

    it('全てのShowReelを取得できる', async () => {
      // 事前にShowReelを作成
      const showReel1 = ShowReel.create({
        name: 'PAL SDリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const showReel2 = ShowReel.create({
        name: 'NTSC HDリール',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.hd(),
      })
      await repository.save(showReel1)
      await repository.save(showReel2)

      const result = await useCase.execute()

      expect(result.showReels).toHaveLength(2)

      const ids = result.showReels.map((r) => r.id)
      expect(ids).toContain(showReel1.id.toString())
      expect(ids).toContain(showReel2.id.toString())

      const reel1Result = result.showReels.find((r) => r.id === showReel1.id.toString())
      expect(reel1Result?.name).toBe('PAL SDリール')
      expect(reel1Result?.videoStandard).toBe('PAL')
      expect(reel1Result?.videoDefinition).toBe('SD')

      const reel2Result = result.showReels.find((r) => r.id === showReel2.id.toString())
      expect(reel2Result?.name).toBe('NTSC HDリール')
      expect(reel2Result?.videoStandard).toBe('NTSC')
      expect(reel2Result?.videoDefinition).toBe('HD')
    })
  })
})
