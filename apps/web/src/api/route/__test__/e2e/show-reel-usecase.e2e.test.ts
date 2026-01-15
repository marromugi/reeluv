import { Timecode } from '@/api/domain/shared/valueObject/Timecode'
import { VideoDefinition } from '@/api/domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '@/api/domain/shared/valueObject/VideoStandard'
import { VideoClip } from '@/api/domain/videoClip/entity/VideoClip'
import { DrizzleVideoClipRepository } from '@/api/infrastructure/repository/videoClip/DrizzleVideoClipRepository'
import { createApp, setupOpenAPIDoc } from '@/api/route'
import { registerGetClips } from '@/api/route/clips/get'
import { registerCreateClip } from '@/api/route/clips/post'
import { registerRemoveClip } from '@/api/route/reels/[id]/clips/delete'
import { registerAddClip } from '@/api/route/reels/[id]/clips/post'
import { registerGetCompatibleClips } from '@/api/route/reels/[id]/compatible-clips/get'
import { registerDeleteReel } from '@/api/route/reels/[id]/delete'
import { registerGetReelById } from '@/api/route/reels/[id]/get'
import { registerUpdateReelName } from '@/api/route/reels/[id]/patch'
import { registerGetReels } from '@/api/route/reels/get'
import { registerCreateReel } from '@/api/route/reels/post'
import { getTestDB } from '@/test/database'

/**
 * 仕様書（docs/spec.md）に基づくE2Eテスト
 *
 * ユーザーストーリー:
 * Creative Agency User がクリップのコレクションから新しいショーリールを作成し、
 * 広告主に自社のCMを紹介する
 */
describe('ShowReel ユースケースシナリオ E2Eテスト', () => {
  let videoClipRepository: DrizzleVideoClipRepository

  /**
   * 仕様書記載の8つのテストクリップ
   */
  const TEST_CLIPS_DATA = {
    // PAL SD クリップ
    budLight: {
      name: 'Bud Light',
      description: 'A factory is working on the new Bud Light Platinum.',
      standard: VideoStandard.pal(),
      definition: VideoDefinition.sd(),
      start: '00:00:00:00',
      end: '00:00:30:12',
    },
    audi: {
      name: 'Audi',
      description:
        'A group of vampires are having a party in the woods. The vampire in charge of drinks (blood types) arrives in his Audi.',
      standard: VideoStandard.pal(),
      definition: VideoDefinition.sd(),
      start: '00:00:00:00',
      end: '00:01:30:00',
    },
    // NTSC SD クリップ
    mms: {
      name: "M&M's",
      description: 'At a party, a brown shelled M&M is mistaken for being naked.',
      standard: VideoStandard.ntsc(),
      definition: VideoDefinition.sd(),
      start: '00:00:00:00',
      end: '00:00:15:27',
    },
    fiat: {
      name: 'Fiat',
      description:
        'A man walks through a street to discover a beautiful woman standing on a parking space.',
      standard: VideoStandard.ntsc(),
      definition: VideoDefinition.sd(),
      start: '00:00:00:00',
      end: '00:00:18:11',
    },
    pepsi: {
      name: 'Pepsi',
      description:
        'People in the Middle Ages try to entertain their king (Elton John) for a Pepsi.',
      standard: VideoStandard.ntsc(),
      definition: VideoDefinition.sd(),
      start: '00:00:00:00',
      end: '00:00:20:00',
    },
    // PAL HD クリップ
    bestBuy: {
      name: 'Best Buy',
      description:
        'An ad featuring the creators of the camera phone, Siri, and the first text message.',
      standard: VideoStandard.pal(),
      definition: VideoDefinition.hd(),
      start: '00:00:00:00',
      end: '00:00:10:05',
    },
    captainAmerica: {
      name: 'Captain America: The First Avenger',
      description: 'Video Promo',
      standard: VideoStandard.pal(),
      definition: VideoDefinition.hd(),
      start: '00:00:00:00',
      end: '00:00:20:10',
    },
    // NTSC HD クリップ
    volkswagen: {
      name: 'Volkswagen "Black Beetle"',
      description:
        'A computer-generated black beetle runs fast, referencing the new Volkswagen model.',
      standard: VideoStandard.ntsc(),
      definition: VideoDefinition.hd(),
      start: '00:00:00:00',
      end: '00:00:30:00',
    },
  } as const

  /**
   * 全APIルートを登録したテストアプリを作成
   */
  function createTestApp() {
    const db = getTestDB()
    const app = createApp(db)

    // 全ルートを登録
    registerGetReels(app)
    registerCreateReel(app)
    registerGetReelById(app)
    registerUpdateReelName(app)
    registerDeleteReel(app)
    registerAddClip(app)
    registerRemoveClip(app)
    registerGetCompatibleClips(app)
    registerGetClips(app)
    registerCreateClip(app)

    setupOpenAPIDoc(app)
    return app
  }

  /**
   * テストクリップをデータベースに作成
   */
  async function createTestClip(
    clipData: (typeof TEST_CLIPS_DATA)[keyof typeof TEST_CLIPS_DATA]
  ): Promise<VideoClip> {
    const clip = VideoClip.create({
      name: clipData.name,
      description: clipData.description,
      videoStandard: clipData.standard,
      videoDefinition: clipData.definition,
      startTimecode: Timecode.fromString(clipData.start, clipData.standard),
      endTimecode: Timecode.fromString(clipData.end, clipData.standard),
    })
    await videoClipRepository.save(clip)
    return clip
  }

  beforeEach(() => {
    const db = getTestDB()
    videoClipRepository = new DrizzleVideoClipRepository(db)
  })

  /**
   * =========================================
   * 仕様書 Acceptance Test #1
   * =========================================
   * Given: PAL SD Video Reel を作成
   * When: NTSC SD video clip を追加しようとする
   * Then: ユーザーインターフェースがこのアクションを防ぐ
   */
  describe('受け入れテスト #1: PAL SD リールに NTSC SD クリップは追加できない', () => {
    it('ビデオ規格が異なるクリップの追加を拒否する', async () => {
      const app = createTestApp()

      // PAL SD ShowReel を作成
      const createReelRes = await app.request('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'PAL SD Reel',
          videoStandard: 'PAL',
          videoDefinition: 'SD',
        }),
      })
      expect(createReelRes.status).toBe(201)
      const reelBody = await createReelRes.json()
      const showReelId = reelBody.data.id

      // NTSC SD クリップ（M&M's）を作成
      const mmsClip = await createTestClip(TEST_CLIPS_DATA.mms)

      // NTSC SD クリップを PAL SD リールに追加しようとする
      const addClipRes = await app.request(`/api/reels/${showReelId}/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId: mmsClip.id.toString() }),
      })

      // 400 Bad Request で拒否されること
      expect(addClipRes.status).toBe(400)
      const errorBody = await addClipRes.json()
      expect(errorBody.error.code).toBe('INCOMPATIBLE_CLIP')
    })
  })

  /**
   * =========================================
   * 仕様書 Acceptance Test #2
   * =========================================
   * Given: PAL SD Video Reel を作成
   * When: PAL HD video clip を追加しようとする
   * Then: ユーザーインターフェースがこのアクションを防ぐ
   */
  describe('受け入れテスト #2: PAL SD リールに PAL HD クリップは追加できない', () => {
    it('ビデオ定義が異なるクリップの追加を拒否する', async () => {
      const app = createTestApp()

      // PAL SD ShowReel を作成
      const createReelRes = await app.request('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'PAL SD Reel',
          videoStandard: 'PAL',
          videoDefinition: 'SD',
        }),
      })
      expect(createReelRes.status).toBe(201)
      const reelBody = await createReelRes.json()
      const showReelId = reelBody.data.id

      // PAL HD クリップ（Best Buy）を作成
      const bestBuyClip = await createTestClip(TEST_CLIPS_DATA.bestBuy)

      // PAL HD クリップを PAL SD リールに追加しようとする
      const addClipRes = await app.request(`/api/reels/${showReelId}/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId: bestBuyClip.id.toString() }),
      })

      // 400 Bad Request で拒否されること
      expect(addClipRes.status).toBe(400)
      const errorBody = await addClipRes.json()
      expect(errorBody.error.code).toBe('INCOMPATIBLE_CLIP')
    })
  })

  /**
   * =========================================
   * 仕様書 Acceptance Test #3
   * =========================================
   * Given: PAL SD Video Reel を作成
   * When: 全ての PAL SD video clips を追加
   * Then: 合計時間が 00:02:00:12 と表示される
   *
   * PAL SD クリップ:
   * - Bud Light: 00:00:30:12 (762フレーム @ 25fps)
   * - Audi: 00:01:30:00 (2250フレーム @ 25fps)
   * 合計: 3012フレーム = 00:02:00:12
   */
  describe('受け入れテスト #3: PAL SD リールの合計時間計算', () => {
    it('全PAL SDクリップを追加すると合計時間が 00:02:00:12 になる', async () => {
      const app = createTestApp()

      // PAL SD ShowReel を作成
      const createReelRes = await app.request('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'PAL SD Commercial Reel',
          videoStandard: 'PAL',
          videoDefinition: 'SD',
        }),
      })
      expect(createReelRes.status).toBe(201)
      const reelBody = await createReelRes.json()
      const showReelId = reelBody.data.id

      // PAL SD クリップを作成
      const budLightClip = await createTestClip(TEST_CLIPS_DATA.budLight)
      const audiClip = await createTestClip(TEST_CLIPS_DATA.audi)

      // Bud Light を追加
      const addBudLightRes = await app.request(`/api/reels/${showReelId}/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId: budLightClip.id.toString() }),
      })
      expect(addBudLightRes.status).toBe(200)

      // Audi を追加
      const addAudiRes = await app.request(`/api/reels/${showReelId}/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId: audiClip.id.toString() }),
      })
      expect(addAudiRes.status).toBe(200)

      // ShowReel を取得して合計時間を確認
      const getReelRes = await app.request(`/api/reels/${showReelId}`)
      expect(getReelRes.status).toBe(200)

      const showReelData = await getReelRes.json()
      expect(showReelData.data.clips).toHaveLength(2)
      expect(showReelData.data.totalDuration).toBe('00:02:00:12')
    })
  })

  /**
   * =========================================
   * 仕様書 Acceptance Test #4
   * =========================================
   * Given: NTSC SD Video Reel を作成
   * When: 全ての NTSC SD video clips を追加
   * Then: 合計時間が 00:00:54:08 と表示される
   *
   * NTSC SD クリップ:
   * - M&M's: 00:00:15:27 (477フレーム @ 30fps)
   * - Fiat: 00:00:18:11 (551フレーム @ 30fps)
   * - Pepsi: 00:00:20:00 (600フレーム @ 30fps)
   * 合計: 1628フレーム = 00:00:54:08
   */
  describe('受け入れテスト #4: NTSC SD リールの合計時間計算', () => {
    it('全NTSC SDクリップを追加すると合計時間が 00:00:54:08 になる', async () => {
      const app = createTestApp()

      // NTSC SD ShowReel を作成
      const createReelRes = await app.request('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'NTSC SD Commercial Reel',
          videoStandard: 'NTSC',
          videoDefinition: 'SD',
        }),
      })
      expect(createReelRes.status).toBe(201)
      const reelBody = await createReelRes.json()
      const showReelId = reelBody.data.id

      // NTSC SD クリップを作成
      const mmsClip = await createTestClip(TEST_CLIPS_DATA.mms)
      const fiatClip = await createTestClip(TEST_CLIPS_DATA.fiat)
      const pepsiClip = await createTestClip(TEST_CLIPS_DATA.pepsi)

      // M&M's を追加
      const addMmsRes = await app.request(`/api/reels/${showReelId}/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId: mmsClip.id.toString() }),
      })
      expect(addMmsRes.status).toBe(200)

      // Fiat を追加
      const addFiatRes = await app.request(`/api/reels/${showReelId}/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId: fiatClip.id.toString() }),
      })
      expect(addFiatRes.status).toBe(200)

      // Pepsi を追加
      const addPepsiRes = await app.request(`/api/reels/${showReelId}/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId: pepsiClip.id.toString() }),
      })
      expect(addPepsiRes.status).toBe(200)

      // ShowReel を取得して合計時間を確認
      const getReelRes = await app.request(`/api/reels/${showReelId}`)
      expect(getReelRes.status).toBe(200)

      const showReelData = await getReelRes.json()
      expect(showReelData.data.clips).toHaveLength(3)
      expect(showReelData.data.totalDuration).toBe('00:00:54:08')
    })
  })

  /**
   * =========================================
   * 推奨シナリオ: ShowReel作成と名前変更
   * =========================================
   */
  describe('ユースケース: ShowReel の作成と名前変更', () => {
    it('ユーザーは ShowReel を作成し、名前を変更できる', async () => {
      const app = createTestApp()

      // ShowReel を作成
      const createRes = await app.request('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '初期名',
          videoStandard: 'PAL',
          videoDefinition: 'HD',
        }),
      })
      expect(createRes.status).toBe(201)
      const createBody = await createRes.json()
      const showReelId = createBody.data.id
      expect(createBody.data.name).toBe('初期名')

      // 名前を変更
      const updateRes = await app.request(`/api/reels/${showReelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '変更後の名前' }),
      })
      expect(updateRes.status).toBe(200)

      // 変更が反映されていることを確認
      const getRes = await app.request(`/api/reels/${showReelId}`)
      expect(getRes.status).toBe(200)
      const getBody = await getRes.json()
      expect(getBody.data.name).toBe('変更後の名前')
    })
  })

  /**
   * =========================================
   * 推奨シナリオ: クリップ追加・削除と合計時間更新
   * =========================================
   */
  describe('ユースケース: クリップの追加・削除と合計時間の更新', () => {
    it('クリップを追加・削除すると合計時間が正しく更新される', async () => {
      const app = createTestApp()

      // NTSC HD ShowReel を作成
      const createRes = await app.request('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'NTSC HD Reel',
          videoStandard: 'NTSC',
          videoDefinition: 'HD',
        }),
      })
      expect(createRes.status).toBe(201)
      const showReelId = (await createRes.json()).data.id

      // Volkswagen クリップを作成
      const vwClip = await createTestClip(TEST_CLIPS_DATA.volkswagen)

      // 初期状態: 合計時間は 00:00:00:00
      let getRes = await app.request(`/api/reels/${showReelId}`)
      let showReel = (await getRes.json()).data
      expect(showReel.totalDuration).toBe('00:00:00:00')
      expect(showReel.clipCount).toBe(0)

      // クリップを追加
      const addRes = await app.request(`/api/reels/${showReelId}/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId: vwClip.id.toString() }),
      })
      expect(addRes.status).toBe(200)

      // 追加後: 合計時間が更新される
      getRes = await app.request(`/api/reels/${showReelId}`)
      showReel = (await getRes.json()).data
      expect(showReel.totalDuration).toBe('00:00:30:00')
      expect(showReel.clipCount).toBe(1)

      // クリップを削除（インデックス0を指定）
      const removeRes = await app.request(`/api/reels/${showReelId}/clips`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: 0 }),
      })
      expect(removeRes.status).toBe(200)

      // 削除後: 合計時間が 00:00:00:00 に戻る
      getRes = await app.request(`/api/reels/${showReelId}`)
      showReel = (await getRes.json()).data
      expect(showReel.totalDuration).toBe('00:00:00:00')
      expect(showReel.clipCount).toBe(0)
    })
  })
})
