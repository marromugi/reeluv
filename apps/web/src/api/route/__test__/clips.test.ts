import { Timecode } from '@/api/domain/shared/valueObject/Timecode'
import { VideoDefinition } from '@/api/domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '@/api/domain/shared/valueObject/VideoStandard'
import { VideoClip } from '@/api/domain/videoClip/entity/VideoClip'
import { DrizzleVideoClipRepository } from '@/api/infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { createApp, setupOpenAPIDoc } from '@/api/route'
import { registerGetClipById } from '@/api/route/clips/[id]/get'
import { registerGetClips } from '@/api/route/clips/get'
import { getTestDB } from '@/test/database'

describe('Clip API Routes', () => {
  let repository: DrizzleVideoClipRepository

  /**
   * テスト用アプリを作成
   */
  function createTestApp() {
    const db = getTestDB()
    const app = createApp(db)
    registerGetClips(app)
    registerGetClipById(app)
    setupOpenAPIDoc(app)
    return app
  }

  beforeEach(() => {
    const db = getTestDB()
    repository = new DrizzleVideoClipRepository(db)
  })

  describe('GET /clips', () => {
    it('空のリストを返す（VideoClipが存在しない場合）', async () => {
      const app = createTestApp()
      const res = await app.request('/api/clips')

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.clips).toEqual([])
    })

    it('全てのVideoClipを返す', async () => {
      const clip = VideoClip.create({
        name: 'テストクリップ',
        description: '説明',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:12', VideoStandard.pal()),
      })
      await repository.save(clip)

      const app = createTestApp()
      const res = await app.request('/api/clips')

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.clips).toHaveLength(1)
      expect(body.data.clips[0].name).toBe('テストクリップ')
      expect(body.data.clips[0].description).toBe('説明')
      expect(body.data.clips[0].videoStandard).toBe('PAL')
      expect(body.data.clips[0].videoDefinition).toBe('SD')
    })

    it('複数のVideoClipを返す', async () => {
      const clip1 = VideoClip.create({
        name: 'クリップ1',
        description: null,
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:10:00', VideoStandard.pal()),
      })
      const clip2 = VideoClip.create({
        name: 'クリップ2',
        description: '説明2',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.hd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.ntsc()),
        endTimecode: Timecode.fromString('00:00:20:00', VideoStandard.ntsc()),
      })
      await repository.save(clip1)
      await repository.save(clip2)

      const app = createTestApp()
      const res = await app.request('/api/clips')

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.clips).toHaveLength(2)
    })
  })

  describe('GET /clips/:id', () => {
    it('存在するVideoClipを返す', async () => {
      const clip = VideoClip.create({
        name: 'テストクリップ',
        description: '説明文',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:12', VideoStandard.pal()),
      })
      await repository.save(clip)

      const app = createTestApp()
      const res = await app.request(`/api/clips/${clip.id.toString()}`)

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.id).toBe(clip.id.toString())
      expect(body.data.name).toBe('テストクリップ')
      expect(body.data.description).toBe('説明文')
      expect(body.data.startTimecode).toBe('00:00:00:00')
      expect(body.data.endTimecode).toBe('00:00:30:12')
      expect(body.data.duration).toBe('00:00:30:12')
    })

    it('存在しないVideoClipの場合404を返す', async () => {
      const app = createTestApp()
      const res = await app.request('/api/clips/non-existent-id')

      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body.error.code).toBe('NOT_FOUND')
    })

    it('説明がnullのVideoClipを返す', async () => {
      const clip = VideoClip.create({
        name: 'テストクリップ',
        description: null,
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:10:00', VideoStandard.pal()),
      })
      await repository.save(clip)

      const app = createTestApp()
      const res = await app.request(`/api/clips/${clip.id.toString()}`)

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.description).toBeNull()
    })
  })
})
