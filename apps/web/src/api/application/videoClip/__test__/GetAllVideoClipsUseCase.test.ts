import { Timecode } from '../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { VideoClip } from '../../../domain/videoClip/entity/VideoClip'
import { DrizzleVideoClipRepository } from '../../../infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { GetAllVideoClipsUseCase } from '../GetAllVideoClipsUseCase'

import { getTestDB } from '@/test/database'

describe('GetAllVideoClipsUseCase', () => {
  let useCase: GetAllVideoClipsUseCase
  let repository: DrizzleVideoClipRepository

  beforeEach(() => {
    repository = new DrizzleVideoClipRepository(getTestDB())
    useCase = new GetAllVideoClipsUseCase(repository)
  })

  describe('execute', () => {
    it('クリップがない場合は空の配列を返す', async () => {
      const result = await useCase.execute()

      expect(result.clips).toEqual([])
    })

    it('全てのVideoClipを取得できる', async () => {
      // 事前にクリップを作成
      const clip1 = VideoClip.create({
        name: 'クリップ1',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.pal()),
      })
      const clip2 = VideoClip.create({
        name: 'クリップ2',
        description: '説明あり',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.hd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.ntsc()),
        endTimecode: Timecode.fromString('00:01:00:00', VideoStandard.ntsc()),
      })
      await repository.save(clip1)
      await repository.save(clip2)

      const result = await useCase.execute()

      expect(result.clips).toHaveLength(2)

      const clipIds = result.clips.map((c) => c.id)
      expect(clipIds).toContain(clip1.id.toString())
      expect(clipIds).toContain(clip2.id.toString())

      const clip1Result = result.clips.find((c) => c.id === clip1.id.toString())
      expect(clip1Result?.name).toBe('クリップ1')
      expect(clip1Result?.description).toBeNull()
      expect(clip1Result?.videoStandard).toBe('PAL')
      expect(clip1Result?.videoDefinition).toBe('SD')

      const clip2Result = result.clips.find((c) => c.id === clip2.id.toString())
      expect(clip2Result?.name).toBe('クリップ2')
      expect(clip2Result?.description).toBe('説明あり')
      expect(clip2Result?.videoStandard).toBe('NTSC')
      expect(clip2Result?.videoDefinition).toBe('HD')
    })
  })
})
