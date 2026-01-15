import { ClipNotFoundError } from '../../../domain/shared/error/DomainError'
import { Timecode } from '../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../domain/showReel/entity/ShowReel'
import { VideoClip } from '../../../domain/videoClip/entity/VideoClip'
import { DrizzleShowReelRepository } from '../../../infrastructure/repository/showReel/DrizzleShowReelRepository'
import { DrizzleVideoClipRepository } from '../../../infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { NotFoundError } from '../../shared/error/ApplicationError'
import { ReorderClipsInShowReelUseCase } from '../ReorderClipsInShowReelUseCase'

import { getTestDB } from '@/test/database'

describe('ReorderClipsInShowReelUseCase', () => {
  let useCase: ReorderClipsInShowReelUseCase
  let showReelRepository: DrizzleShowReelRepository
  let videoClipRepository: DrizzleVideoClipRepository

  beforeEach(() => {
    const db = getTestDB()
    showReelRepository = new DrizzleShowReelRepository(db)
    videoClipRepository = new DrizzleVideoClipRepository(db)
    useCase = new ReorderClipsInShowReelUseCase(showReelRepository)
  })

  describe('execute', () => {
    it('ShowReel内のクリップを並べ替えできる', async () => {
      // クリップを3つ作成
      const clip1 = VideoClip.create({
        name: 'クリップ1',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:10:00', VideoStandard.pal()),
      })
      const clip2 = VideoClip.create({
        name: 'クリップ2',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:20:00', VideoStandard.pal()),
      })
      const clip3 = VideoClip.create({
        name: 'クリップ3',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.pal()),
      })
      await videoClipRepository.save(clip1)
      await videoClipRepository.save(clip2)
      await videoClipRepository.save(clip3)

      // ShowReelを作成してクリップを追加（順序: clip1, clip2, clip3）
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      showReel.addClip(clip1)
      showReel.addClip(clip2)
      showReel.addClip(clip3)
      await showReelRepository.save(showReel)

      // 順序を逆にする（clip3, clip2, clip1）
      const result = await useCase.execute({
        showReelId: showReel.id.toString(),
        clipIds: [clip3.id.toString(), clip2.id.toString(), clip1.id.toString()],
      })

      expect(result.showReelId).toBe(showReel.id.toString())
      expect(result.clipIds).toEqual([
        clip3.id.toString(),
        clip2.id.toString(),
        clip1.id.toString(),
      ])
      expect(result.clipCount).toBe(3)

      // DBからも確認
      const updated = await showReelRepository.findById(showReel.id)
      expect(updated?.clips[0].id.toString()).toBe(clip3.id.toString())
      expect(updated?.clips[1].id.toString()).toBe(clip2.id.toString())
      expect(updated?.clips[2].id.toString()).toBe(clip1.id.toString())
    })

    it('空のクリップ配列で並べ替えできる', async () => {
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      const result = await useCase.execute({
        showReelId: showReel.id.toString(),
        clipIds: [],
      })

      expect(result.clipIds).toEqual([])
      expect(result.clipCount).toBe(0)
    })

    it('存在しないShowReelでクリップを並べ替えしようとするとエラーになる', async () => {
      await expect(
        useCase.execute({
          showReelId: 'non-existent-id',
          clipIds: ['clip-id'],
        })
      ).rejects.toThrow(NotFoundError)
    })

    it('ShowReelに存在しないクリップIDを含む場合はエラーになる', async () => {
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
          clipIds: [clip.id.toString(), 'non-existent-clip-id'],
        })
      ).rejects.toThrow(ClipNotFoundError)
    })
  })
})
