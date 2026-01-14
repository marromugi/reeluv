import { Timecode } from '../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../domain/showReel/entity/ShowReel'
import { VideoClip } from '../../../domain/videoClip/entity/VideoClip'
import { DrizzleShowReelRepository } from '../../../infrastructure/repository/showReel/DrizzleShowReelRepository'
import { DrizzleVideoClipRepository } from '../../../infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { NotFoundError } from '../../shared/error/ApplicationError'
import { GetShowReelUseCase } from '../GetShowReelUseCase'

import { getTestDB } from '@/test/database'

describe('GetShowReelUseCase', () => {
  let useCase: GetShowReelUseCase
  let showReelRepository: DrizzleShowReelRepository
  let videoClipRepository: DrizzleVideoClipRepository

  beforeEach(() => {
    const db = getTestDB()
    showReelRepository = new DrizzleShowReelRepository(db)
    videoClipRepository = new DrizzleVideoClipRepository(db)
    useCase = new GetShowReelUseCase(showReelRepository)
  })

  describe('execute', () => {
    it('存在するShowReelを取得できる', async () => {
      // 事前にShowReelを作成
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      const result = await useCase.execute({ id: showReel.id.toString() })

      expect(result.id).toBe(showReel.id.toString())
      expect(result.name).toBe('テストリール')
      expect(result.videoStandard).toBe('PAL')
      expect(result.videoDefinition).toBe('SD')
      expect(result.clips).toEqual([])
      expect(result.clipCount).toBe(0)
      expect(result.totalDuration).toBe('00:00:00:00')
    })

    it('クリップ付きのShowReelを取得できる', async () => {
      // クリップを作成
      const clip = VideoClip.create({
        name: 'テストクリップ',
        description: '説明',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:12', VideoStandard.pal()),
      })
      await videoClipRepository.save(clip)

      // ShowReelを作成してクリップを追加
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      showReel.addClip(clip)
      await showReelRepository.save(showReel)

      const result = await useCase.execute({ id: showReel.id.toString() })

      expect(result.clips).toHaveLength(1)
      expect(result.clips[0].id).toBe(clip.id.toString())
      expect(result.clips[0].name).toBe('テストクリップ')
      expect(result.clips[0].description).toBe('説明')
      expect(result.clipCount).toBe(1)
      expect(result.totalDuration).toBe('00:00:30:12')
    })

    it('存在しないShowReelを取得しようとするとエラーになる', async () => {
      await expect(useCase.execute({ id: 'non-existent-id' })).rejects.toThrow(NotFoundError)
    })
  })
})
