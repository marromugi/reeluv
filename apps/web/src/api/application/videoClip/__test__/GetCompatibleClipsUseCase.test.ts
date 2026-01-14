import { Timecode } from '../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../domain/showReel/entity/ShowReel'
import { VideoClip } from '../../../domain/videoClip/entity/VideoClip'
import { DrizzleShowReelRepository } from '../../../infrastructure/repository/showReel/DrizzleShowReelRepository'
import { DrizzleVideoClipRepository } from '../../../infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { NotFoundError } from '../../shared/error/ApplicationError'
import { GetCompatibleClipsUseCase } from '../GetCompatibleClipsUseCase'

import { getTestDB } from '@/test/database'

describe('GetCompatibleClipsUseCase', () => {
  let useCase: GetCompatibleClipsUseCase
  let showReelRepository: DrizzleShowReelRepository
  let videoClipRepository: DrizzleVideoClipRepository

  beforeEach(() => {
    const db = getTestDB()
    showReelRepository = new DrizzleShowReelRepository(db)
    videoClipRepository = new DrizzleVideoClipRepository(db)
    useCase = new GetCompatibleClipsUseCase(showReelRepository, videoClipRepository)
  })

  describe('execute', () => {
    it('互換性のあるクリップのみを取得できる', async () => {
      // PAL SDクリップを作成
      const palSdClip = VideoClip.create({
        name: 'PAL SDクリップ',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.pal()),
      })
      await videoClipRepository.save(palSdClip)

      // NTSC SDクリップを作成
      const ntscSdClip = VideoClip.create({
        name: 'NTSC SDクリップ',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.ntsc()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.ntsc()),
      })
      await videoClipRepository.save(ntscSdClip)

      // PAL HDクリップを作成
      const palHdClip = VideoClip.create({
        name: 'PAL HDクリップ',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.hd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.pal()),
      })
      await videoClipRepository.save(palHdClip)

      // PAL SD ShowReelを作成
      const palSdShowReel = ShowReel.create({
        name: 'PAL SDリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(palSdShowReel)

      const result = await useCase.execute({ showReelId: palSdShowReel.id.toString() })

      // PAL SDクリップのみが返される
      expect(result.clips).toHaveLength(1)
      expect(result.clips[0].id).toBe(palSdClip.id.toString())
      expect(result.clips[0].name).toBe('PAL SDクリップ')
      expect(result.clips[0].videoStandard).toBe('PAL')
      expect(result.clips[0].videoDefinition).toBe('SD')
    })

    it('互換性のあるクリップがない場合は空の配列を返す', async () => {
      // NTSC HDクリップのみを作成
      const ntscHdClip = VideoClip.create({
        name: 'NTSC HDクリップ',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.hd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.ntsc()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.ntsc()),
      })
      await videoClipRepository.save(ntscHdClip)

      // PAL SD ShowReelを作成
      const palSdShowReel = ShowReel.create({
        name: 'PAL SDリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(palSdShowReel)

      const result = await useCase.execute({ showReelId: palSdShowReel.id.toString() })

      expect(result.clips).toHaveLength(0)
    })

    it('存在しないShowReelを指定するとエラーになる', async () => {
      await expect(useCase.execute({ showReelId: 'non-existent-id' })).rejects.toThrow(
        NotFoundError
      )
    })
  })
})
