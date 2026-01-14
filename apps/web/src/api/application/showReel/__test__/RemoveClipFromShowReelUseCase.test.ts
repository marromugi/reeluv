import { ClipNotFoundError } from '../../../domain/shared/error/DomainError'
import { Timecode } from '../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../domain/showReel/entity/ShowReel'
import { VideoClip } from '../../../domain/videoClip/entity/VideoClip'
import { DrizzleShowReelRepository } from '../../../infrastructure/repository/showReel/DrizzleShowReelRepository'
import { DrizzleVideoClipRepository } from '../../../infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { NotFoundError } from '../../shared/error/ApplicationError'
import { RemoveClipFromShowReelUseCase } from '../RemoveClipFromShowReelUseCase'

import { getTestDB } from '@/test/database'

describe('RemoveClipFromShowReelUseCase', () => {
  let useCase: RemoveClipFromShowReelUseCase
  let showReelRepository: DrizzleShowReelRepository
  let videoClipRepository: DrizzleVideoClipRepository

  beforeEach(() => {
    const db = getTestDB()
    showReelRepository = new DrizzleShowReelRepository(db)
    videoClipRepository = new DrizzleVideoClipRepository(db)
    useCase = new RemoveClipFromShowReelUseCase(showReelRepository)
  })

  describe('execute', () => {
    it('ShowReelからクリップを削除できる', async () => {
      // クリップを作成
      const clip = VideoClip.create({
        name: 'テストクリップ',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.pal()),
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

      const result = await useCase.execute({
        showReelId: showReel.id.toString(),
        clipId: clip.id.toString(),
      })

      expect(result.showReelId).toBe(showReel.id.toString())
      expect(result.clipId).toBe(clip.id.toString())
      expect(result.clipCount).toBe(0)
      expect(result.totalDuration).toBe('00:00:00:00')

      // DBからも確認
      const updated = await showReelRepository.findById(showReel.id)
      expect(updated?.clipCount).toBe(0)
    })

    it('存在しないShowReelからクリップを削除しようとするとエラーになる', async () => {
      await expect(
        useCase.execute({
          showReelId: 'non-existent-id',
          clipId: 'clip-id',
        })
      ).rejects.toThrow(NotFoundError)
    })

    it('ShowReelに存在しないクリップを削除しようとするとエラーになる', async () => {
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      await expect(
        useCase.execute({
          showReelId: showReel.id.toString(),
          clipId: 'non-existent-clip-id',
        })
      ).rejects.toThrow(ClipNotFoundError)
    })
  })
})
