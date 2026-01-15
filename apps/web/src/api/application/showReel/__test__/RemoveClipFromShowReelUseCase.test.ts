import { ClipIndexOutOfBoundsError } from '../../../domain/shared/error/DomainError'
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
    it('ShowReelからクリップをインデックス指定で削除できる', async () => {
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
        clipIndex: 0,
      })

      expect(result.showReelId).toBe(showReel.id.toString())
      expect(result.clipIndex).toBe(0)
      expect(result.clipCount).toBe(0)
      expect(result.totalDuration).toBe('00:00:00:00')

      // DBからも確認
      const updated = await showReelRepository.findById(showReel.id)
      expect(updated?.clipCount).toBe(0)
    })

    it('同じクリップが複数ある場合、指定インデックスのクリップのみ削除できる', async () => {
      // クリップを作成
      const clip = VideoClip.create({
        name: 'テストクリップ',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:10:00', VideoStandard.pal()),
      })
      await videoClipRepository.save(clip)

      // ShowReelを作成して同じクリップを3回追加
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      showReel.addClip(clip)
      showReel.addClip(clip)
      showReel.addClip(clip)
      await showReelRepository.save(showReel)

      // 中央（インデックス1）のクリップを削除
      const result = await useCase.execute({
        showReelId: showReel.id.toString(),
        clipIndex: 1,
      })

      expect(result.clipIndex).toBe(1)
      expect(result.clipCount).toBe(2)

      // DBからも確認
      const updated = await showReelRepository.findById(showReel.id)
      expect(updated?.clipCount).toBe(2)
    })

    it('存在しないShowReelからクリップを削除しようとするとエラーになる', async () => {
      await expect(
        useCase.execute({
          showReelId: 'non-existent-id',
          clipIndex: 0,
        })
      ).rejects.toThrow(NotFoundError)
    })

    it('範囲外のインデックスを指定するとエラーになる', async () => {
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      await expect(
        useCase.execute({
          showReelId: showReel.id.toString(),
          clipIndex: 0,
        })
      ).rejects.toThrow(ClipIndexOutOfBoundsError)
    })

    it('負のインデックスを指定するとエラーになる', async () => {
      // クリップを作成
      const clip = VideoClip.create({
        name: 'テストクリップ',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:10:00', VideoStandard.pal()),
      })
      await videoClipRepository.save(clip)

      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      showReel.addClip(clip)
      await showReelRepository.save(showReel)

      await expect(
        useCase.execute({
          showReelId: showReel.id.toString(),
          clipIndex: -1,
        })
      ).rejects.toThrow(ClipIndexOutOfBoundsError)
    })
  })
})
