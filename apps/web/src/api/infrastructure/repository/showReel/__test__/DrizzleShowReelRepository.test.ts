import { videoClips } from '@database/core'

import { Timecode } from '../../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../../domain/shared/valueObject/VideoStandard'
import { ShowReel } from '../../../../domain/showReel/entity/ShowReel'
import { ShowReelId } from '../../../../domain/showReel/valueObject/ShowReelId'
import { VideoClip } from '../../../../domain/videoClip/entity/VideoClip'
import { VideoClipId } from '../../../../domain/videoClip/valueObject/VideoClipId'
import { DrizzleShowReelRepository } from '../DrizzleShowReelRepository'

import { getTestDB } from '@/test/database'

describe('DrizzleShowReelRepository', () => {
  let repository: DrizzleShowReelRepository

  beforeEach(() => {
    repository = new DrizzleShowReelRepository(getTestDB())
  })

  /**
   * テスト用VideoClipを作成してDBに保存するヘルパー
   */
  async function createAndSaveVideoClip(overrides?: {
    id?: VideoClipId
    name?: string
    description?: string | null
    videoStandard?: VideoStandard
    videoDefinition?: VideoDefinition
    startTimecode?: Timecode
    endTimecode?: Timecode
  }): Promise<VideoClip> {
    const standard = overrides?.videoStandard ?? VideoStandard.pal()
    const clip = VideoClip.create({
      id: overrides?.id,
      name: overrides?.name ?? 'テストクリップ',
      description: overrides?.description ?? null,
      videoStandard: standard,
      videoDefinition: overrides?.videoDefinition ?? VideoDefinition.sd(),
      startTimecode: overrides?.startTimecode ?? Timecode.fromString('00:00:00:00', standard),
      endTimecode: overrides?.endTimecode ?? Timecode.fromString('00:01:00:00', standard),
    })

    // DBに保存
    await getTestDB().insert(videoClips).values({
      id: clip.id.toString(),
      name: clip.name,
      description: clip.description,
      videoStandard: clip.videoStandard.toString(),
      videoDefinition: clip.videoDefinition.toString(),
      startTimecode: clip.startTimecode.toString(),
      endTimecode: clip.endTimecode.toString(),
    })

    return clip
  }

  /**
   * テスト用ShowReelを作成するヘルパー
   */
  function createTestShowReel(overrides?: {
    id?: ShowReelId
    name?: string
    videoStandard?: VideoStandard
    videoDefinition?: VideoDefinition
  }): ShowReel {
    return ShowReel.create({
      id: overrides?.id,
      name: overrides?.name ?? 'テストショーリール',
      videoStandard: overrides?.videoStandard ?? VideoStandard.pal(),
      videoDefinition: overrides?.videoDefinition ?? VideoDefinition.sd(),
    })
  }

  describe('save と findById', () => {
    it('新規ショーリールを保存して取得できる', async () => {
      const showReel = createTestShowReel({ name: 'ショーリール1' })

      await repository.save(showReel)
      const found = await repository.findById(showReel.id)

      expect(found).not.toBeNull()
      expect(found!.id.equals(showReel.id)).toBe(true)
      expect(found!.name).toBe('ショーリール1')
      expect(found!.videoStandard.toString()).toBe('PAL')
      expect(found!.videoDefinition.toString()).toBe('SD')
      expect(found!.clips).toHaveLength(0)
    })

    it('存在しないIDの場合nullを返す', async () => {
      const id = ShowReelId.create()
      const found = await repository.findById(id)

      expect(found).toBeNull()
    })

    it('クリップを含むショーリールを保存して取得できる', async () => {
      const clip1 = await createAndSaveVideoClip({ name: 'クリップ1' })
      const clip2 = await createAndSaveVideoClip({ name: 'クリップ2' })

      const showReel = createTestShowReel()
      showReel.addClip(clip1)
      showReel.addClip(clip2)

      await repository.save(showReel)
      const found = await repository.findById(showReel.id)

      expect(found!.clips).toHaveLength(2)
      expect(found!.clips[0].name).toBe('クリップ1')
      expect(found!.clips[1].name).toBe('クリップ2')
    })

    it('クリップの順序が保持される', async () => {
      const clip1 = await createAndSaveVideoClip({ name: 'クリップA' })
      const clip2 = await createAndSaveVideoClip({ name: 'クリップB' })
      const clip3 = await createAndSaveVideoClip({ name: 'クリップC' })

      const showReel = createTestShowReel()
      showReel.addClip(clip1)
      showReel.addClip(clip2)
      showReel.addClip(clip3)

      await repository.save(showReel)
      const found = await repository.findById(showReel.id)

      expect(found!.clips[0].name).toBe('クリップA')
      expect(found!.clips[1].name).toBe('クリップB')
      expect(found!.clips[2].name).toBe('クリップC')
    })

    it('既存ショーリールを更新できる', async () => {
      const showReel = createTestShowReel({ name: '元の名前' })
      await repository.save(showReel)

      showReel.rename('更新後の名前')
      await repository.save(showReel)

      const found = await repository.findById(showReel.id)
      expect(found!.name).toBe('更新後の名前')
    })

    it('クリップを追加・削除した後も正しく保存される', async () => {
      const clip1 = await createAndSaveVideoClip({ name: 'クリップ1' })
      const clip2 = await createAndSaveVideoClip({ name: 'クリップ2' })
      const clip3 = await createAndSaveVideoClip({ name: 'クリップ3' })

      const showReel = createTestShowReel()
      showReel.addClip(clip1)
      showReel.addClip(clip2)
      await repository.save(showReel)

      // clip1を削除、clip3を追加
      showReel.removeClip(clip1.id)
      showReel.addClip(clip3)
      await repository.save(showReel)

      const found = await repository.findById(showReel.id)
      expect(found!.clips).toHaveLength(2)
      expect(found!.clips[0].name).toBe('クリップ2')
      expect(found!.clips[1].name).toBe('クリップ3')
    })
  })

  describe('findAll', () => {
    it('全てのショーリールを取得できる', async () => {
      const showReel1 = createTestShowReel({ name: 'ショーリール1' })
      const showReel2 = createTestShowReel({ name: 'ショーリール2' })

      await repository.save(showReel1)
      await repository.save(showReel2)

      const all = await repository.findAll()

      expect(all).toHaveLength(2)
    })

    it('データがない場合は空配列を返す', async () => {
      const all = await repository.findAll()
      expect(all).toEqual([])
    })

    it('各ショーリールにクリップが含まれる', async () => {
      const clip1 = await createAndSaveVideoClip({ name: 'クリップ1' })
      const clip2 = await createAndSaveVideoClip({ name: 'クリップ2' })

      const showReel1 = createTestShowReel({ name: 'ショーリール1' })
      showReel1.addClip(clip1)

      const showReel2 = createTestShowReel({ name: 'ショーリール2' })
      showReel2.addClip(clip2)

      await repository.save(showReel1)
      await repository.save(showReel2)

      const all = await repository.findAll()

      const sr1 = all.find((sr) => sr.name === 'ショーリール1')
      const sr2 = all.find((sr) => sr.name === 'ショーリール2')

      expect(sr1!.clips).toHaveLength(1)
      expect(sr1!.clips[0].name).toBe('クリップ1')
      expect(sr2!.clips).toHaveLength(1)
      expect(sr2!.clips[0].name).toBe('クリップ2')
    })
  })

  describe('findByStandardAndDefinition', () => {
    it('指定した規格と解像度に一致するショーリールを取得できる', async () => {
      const palSd = createTestShowReel({
        name: 'PAL SD',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const palHd = createTestShowReel({
        name: 'PAL HD',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.hd(),
      })
      const ntscSd = createTestShowReel({
        name: 'NTSC SD',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.sd(),
      })

      await repository.save(palSd)
      await repository.save(palHd)
      await repository.save(ntscSd)

      const result = await repository.findByStandardAndDefinition(
        VideoStandard.pal(),
        VideoDefinition.sd()
      )

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('PAL SD')
    })

    it('一致するショーリールがない場合は空配列を返す', async () => {
      const palSd = createTestShowReel({
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await repository.save(palSd)

      const result = await repository.findByStandardAndDefinition(
        VideoStandard.ntsc(),
        VideoDefinition.hd()
      )

      expect(result).toEqual([])
    })
  })

  describe('delete', () => {
    it('ショーリールを削除できる', async () => {
      const showReel = createTestShowReel()
      await repository.save(showReel)

      await repository.delete(showReel.id)

      const found = await repository.findById(showReel.id)
      expect(found).toBeNull()
    })

    it('存在しないIDを削除してもエラーにならない', async () => {
      const id = ShowReelId.create()
      await expect(repository.delete(id)).resolves.not.toThrow()
    })
  })

  describe('exists', () => {
    it('存在するIDの場合trueを返す', async () => {
      const showReel = createTestShowReel()
      await repository.save(showReel)

      const result = await repository.exists(showReel.id)

      expect(result).toBe(true)
    })

    it('存在しないIDの場合falseを返す', async () => {
      const id = ShowReelId.create()
      const result = await repository.exists(id)

      expect(result).toBe(false)
    })
  })

  describe('totalDuration計算', () => {
    it('取得したショーリールのtotalDurationが正しく計算される', async () => {
      const standard = VideoStandard.pal()
      const clip1 = await createAndSaveVideoClip({
        name: 'クリップ1',
        videoStandard: standard,
        startTimecode: Timecode.fromString('00:00:00:00', standard),
        endTimecode: Timecode.fromString('00:01:00:00', standard), // 1分
      })
      const clip2 = await createAndSaveVideoClip({
        name: 'クリップ2',
        videoStandard: standard,
        startTimecode: Timecode.fromString('00:00:00:00', standard),
        endTimecode: Timecode.fromString('00:00:30:00', standard), // 30秒
      })

      const showReel = createTestShowReel({ videoStandard: standard })
      showReel.addClip(clip1)
      showReel.addClip(clip2)

      await repository.save(showReel)
      const found = await repository.findById(showReel.id)

      // 1分 + 30秒 = 1分30秒
      expect(found!.totalDuration.toString()).toBe('00:01:30:00')
    })
  })
})
