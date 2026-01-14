import { IncompatibleClipError } from '../../../domain/shared/error/DomainError'
import { Timecode } from '../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../domain/showReel/entity/ShowReel'
import { VideoClip } from '../../../domain/videoClip/entity/VideoClip'
import { DrizzleShowReelRepository } from '../../../infrastructure/repository/showReel/DrizzleShowReelRepository'
import { DrizzleVideoClipRepository } from '../../../infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { NotFoundError } from '../../shared/error/ApplicationError'
import { AddClipToShowReelUseCase } from '../AddClipToShowReelUseCase'

import { getTestDB } from '@/test/database'

describe('AddClipToShowReelUseCase', () => {
  let useCase: AddClipToShowReelUseCase
  let showReelRepository: DrizzleShowReelRepository
  let videoClipRepository: DrizzleVideoClipRepository

  beforeEach(() => {
    const db = getTestDB()
    showReelRepository = new DrizzleShowReelRepository(db)
    videoClipRepository = new DrizzleVideoClipRepository(db)
    useCase = new AddClipToShowReelUseCase(showReelRepository, videoClipRepository)
  })

  describe('execute', () => {
    it('ShowReelにクリップを追加できる', async () => {
      // クリップを作成
      const clip = VideoClip.create({
        name: 'テストクリップ',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.pal()),
      })
      await videoClipRepository.save(clip)

      // ShowReelを作成
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      const result = await useCase.execute({
        showReelId: showReel.id.toString(),
        clipId: clip.id.toString(),
      })

      expect(result.showReelId).toBe(showReel.id.toString())
      expect(result.clipId).toBe(clip.id.toString())
      expect(result.clipCount).toBe(1)
      expect(result.totalDuration).toBe('00:00:30:00')

      // DBからも確認
      const updated = await showReelRepository.findById(showReel.id)
      expect(updated?.clipCount).toBe(1)
    })

    it('同じクリップを複数回追加できる', async () => {
      // クリップを作成
      const clip = VideoClip.create({
        name: 'テストクリップ',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.pal()),
      })
      await videoClipRepository.save(clip)

      // ShowReelを作成
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      // 1回目の追加
      await useCase.execute({
        showReelId: showReel.id.toString(),
        clipId: clip.id.toString(),
      })

      // 2回目の追加
      const result = await useCase.execute({
        showReelId: showReel.id.toString(),
        clipId: clip.id.toString(),
      })

      expect(result.clipCount).toBe(2)
      expect(result.totalDuration).toBe('00:01:00:00')
    })

    it('存在しないShowReelにクリップを追加しようとするとエラーになる', async () => {
      const clip = VideoClip.create({
        name: 'テストクリップ',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.pal()),
      })
      await videoClipRepository.save(clip)

      await expect(
        useCase.execute({
          showReelId: 'non-existent-id',
          clipId: clip.id.toString(),
        })
      ).rejects.toThrow(NotFoundError)
    })

    it('存在しないクリップを追加しようとするとエラーになる', async () => {
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      await expect(
        useCase.execute({
          showReelId: showReel.id.toString(),
          clipId: 'non-existent-id',
        })
      ).rejects.toThrow(NotFoundError)
    })

    it('互換性のないクリップを追加しようとするとエラーになる', async () => {
      // NTSCクリップを作成
      const ntscClip = VideoClip.create({
        name: 'NTSCクリップ',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.ntsc()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.ntsc()),
      })
      await videoClipRepository.save(ntscClip)

      // PAL ShowReelを作成
      const palShowReel = ShowReel.create({
        name: 'PALリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(palShowReel)

      await expect(
        useCase.execute({
          showReelId: palShowReel.id.toString(),
          clipId: ntscClip.id.toString(),
        })
      ).rejects.toThrow(IncompatibleClipError)
    })
  })
})
