import { Timecode } from '@/api/domain/shared/valueObject/Timecode'
import { VideoDefinition } from '@/api/domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '@/api/domain/shared/valueObject/VideoStandard'
import { ShowReel } from '@/api/domain/showReel/entity/ShowReel'
import { VideoClip } from '@/api/domain/videoClip/entity/VideoClip'
import { DrizzleShowReelRepository } from '@/api/infrastructure/repository/showReel/DrizzleShowReelRepository'
import { DrizzleVideoClipRepository } from '@/api/infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { createApp, setupOpenAPIDoc } from '@/api/route'
import { registerReorderClips } from '@/api/route/reels/[id]/clips/reorder/put'
import { registerGetReelById } from '@/api/route/reels/[id]/get'
import { registerGetReels } from '@/api/route/reels/get'
import { getTestDB } from '@/test/database'

describe('Reel API Routes', () => {
  let showReelRepository: DrizzleShowReelRepository
  let videoClipRepository: DrizzleVideoClipRepository

  /**
   * テスト用アプリを作成
   */
  function createTestApp() {
    const db = getTestDB()
    const app = createApp(db)
    registerGetReels(app)
    registerGetReelById(app)
    registerReorderClips(app)
    setupOpenAPIDoc(app)
    return app
  }

  beforeEach(() => {
    const db = getTestDB()
    showReelRepository = new DrizzleShowReelRepository(db)
    videoClipRepository = new DrizzleVideoClipRepository(db)
  })

  describe('GET /reels', () => {
    it('空のリストを返す（ShowReelが存在しない場合）', async () => {
      const app = createTestApp()
      const res = await app.request('/api/reels')

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.showReels).toEqual([])
    })

    it('全てのShowReelを返す', async () => {
      // テストデータを作成
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      const app = createTestApp()
      const res = await app.request('/api/reels')

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.showReels).toHaveLength(1)
      expect(body.data.showReels[0].name).toBe('テストリール')
      expect(body.data.showReels[0].videoStandard).toBe('PAL')
      expect(body.data.showReels[0].videoDefinition).toBe('SD')
    })

    it('複数のShowReelを返す', async () => {
      // テストデータを作成
      const showReel1 = ShowReel.create({
        name: 'リール1',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const showReel2 = ShowReel.create({
        name: 'リール2',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.hd(),
      })
      await showReelRepository.save(showReel1)
      await showReelRepository.save(showReel2)

      const app = createTestApp()
      const res = await app.request('/api/reels')

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.showReels).toHaveLength(2)
    })
  })

  describe('GET /reels/:id', () => {
    it('存在するShowReelを返す', async () => {
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      const app = createTestApp()
      const res = await app.request(`/api/reels/${showReel.id.toString()}`)

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.id).toBe(showReel.id.toString())
      expect(body.data.name).toBe('テストリール')
      expect(body.data.clips).toEqual([])
      expect(body.data.clipCount).toBe(0)
    })

    it('存在しないShowReelの場合404を返す', async () => {
      const app = createTestApp()
      const res = await app.request('/api/reels/non-existent-id')

      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body.error.code).toBe('NOT_FOUND')
    })

    it('クリップ付きのShowReelを返す', async () => {
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

      const app = createTestApp()
      const res = await app.request(`/api/reels/${showReel.id.toString()}`)

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.clips).toHaveLength(1)
      expect(body.data.clips[0].name).toBe('テストクリップ')
      expect(body.data.clipCount).toBe(1)
    })
  })

  describe('GET /doc', () => {
    it('OpenAPI仕様を返す', async () => {
      const app = createTestApp()
      const res = await app.request('/api/doc')

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.openapi).toBe('3.1.0')
      expect(body.info.title).toBe('ReeLuv API')
    })
  })

  describe('PUT /reels/:id/clips/reorder', () => {
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

      const app = createTestApp()
      const res = await app.request(`/api/reels/${showReel.id.toString()}/clips/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clipIds: [clip3.id.toString(), clip1.id.toString(), clip2.id.toString()],
        }),
      })

      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.data.showReelId).toBe(showReel.id.toString())
      expect(body.data.clipIds).toEqual([
        clip3.id.toString(),
        clip1.id.toString(),
        clip2.id.toString(),
      ])
      expect(body.data.clipCount).toBe(3)
    })

    it('存在しないShowReelの場合404を返す', async () => {
      const app = createTestApp()
      const res = await app.request('/api/reels/non-existent-id/clips/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipIds: [] }),
      })

      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body.error.code).toBe('NOT_FOUND')
    })

    it('存在しないクリップIDを含む場合400を返す', async () => {
      const showReel = ShowReel.create({
        name: 'テストリール',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await showReelRepository.save(showReel)

      const app = createTestApp()
      const res = await app.request(`/api/reels/${showReel.id.toString()}/clips/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipIds: ['non-existent-clip-id'] }),
      })

      expect(res.status).toBe(400)

      const body = await res.json()
      expect(body.error.code).toBe('CLIP_NOT_FOUND')
    })
  })
})
