import { Timecode } from '../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../domain/shared/valueObject/VideoStandard'
import { VideoClip } from '../../../domain/videoClip/entity/VideoClip'
import { DrizzleVideoClipRepository } from '../../../infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { NotFoundError } from '../../shared/error/ApplicationError'
import { GetVideoClipUseCase } from '../GetVideoClipUseCase'

import { getTestDB } from '@/test/database'

describe('GetVideoClipUseCase', () => {
  let useCase: GetVideoClipUseCase
  let repository: DrizzleVideoClipRepository

  beforeEach(() => {
    repository = new DrizzleVideoClipRepository(getTestDB())
    useCase = new GetVideoClipUseCase(repository)
  })

  describe('execute', () => {
    it('存在するVideoClipを取得できる', async () => {
      // 事前にクリップを作成
      const clip = VideoClip.create({
        name: 'テストクリップ',
        description: '説明文',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:12', VideoStandard.pal()),
      })
      await repository.save(clip)

      const result = await useCase.execute({ id: clip.id.toString() })

      expect(result.id).toBe(clip.id.toString())
      expect(result.name).toBe('テストクリップ')
      expect(result.description).toBe('説明文')
      expect(result.videoStandard).toBe('PAL')
      expect(result.videoDefinition).toBe('SD')
      expect(result.startTimecode).toBe('00:00:00:00')
      expect(result.endTimecode).toBe('00:00:30:12')
      expect(result.duration).toBe('00:00:30:12')
    })

    it('存在しないVideoClipを取得しようとするとエラーになる', async () => {
      await expect(useCase.execute({ id: 'non-existent-id' })).rejects.toThrow(NotFoundError)
    })
  })
})
