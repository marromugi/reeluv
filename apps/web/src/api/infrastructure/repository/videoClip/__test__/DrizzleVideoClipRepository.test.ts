import { Timecode } from '../../../../domain/shared/valueObject/Timecode'
import { VideoDefinition } from '../../../../domain/shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../../domain/shared/valueObject/VideoStandard'
import { VideoClip } from '../../../../domain/videoClip/entity/VideoClip'
import { VideoClipId } from '../../../../domain/videoClip/valueObject/VideoClipId'
import { DrizzleVideoClipRepository } from '../DrizzleVideoClipRepository'

import { getTestDB } from '@/test/database'

describe('DrizzleVideoClipRepository', () => {
  let repository: DrizzleVideoClipRepository

  beforeEach(() => {
    repository = new DrizzleVideoClipRepository(getTestDB())
  })

  /**
   * テスト用VideoClipを作成するヘルパー
   */
  function createTestVideoClip(overrides?: {
    id?: VideoClipId
    name?: string
    description?: string | null
    videoStandard?: VideoStandard
    videoDefinition?: VideoDefinition
    startTimecode?: Timecode
    endTimecode?: Timecode
  }): VideoClip {
    const standard = overrides?.videoStandard ?? VideoStandard.pal()
    return VideoClip.create({
      id: overrides?.id,
      name: overrides?.name ?? 'テストクリップ',
      description: overrides?.description ?? null,
      videoStandard: standard,
      videoDefinition: overrides?.videoDefinition ?? VideoDefinition.sd(),
      startTimecode: overrides?.startTimecode ?? Timecode.fromString('00:00:00:00', standard),
      endTimecode: overrides?.endTimecode ?? Timecode.fromString('00:01:00:00', standard),
    })
  }

  describe('save と findById', () => {
    it('新規クリップを保存して取得できる', async () => {
      const clip = createTestVideoClip({ name: 'クリップ1' })

      await repository.save(clip)
      const found = await repository.findById(clip.id)

      expect(found).not.toBeNull()
      expect(found!.id.equals(clip.id)).toBe(true)
      expect(found!.name).toBe('クリップ1')
      expect(found!.videoStandard.toString()).toBe('PAL')
      expect(found!.videoDefinition.toString()).toBe('SD')
    })

    it('存在しないIDの場合nullを返す', async () => {
      const id = VideoClipId.create()
      const found = await repository.findById(id)

      expect(found).toBeNull()
    })

    it('既存クリップを更新できる', async () => {
      const clip = createTestVideoClip({ name: '元の名前' })
      await repository.save(clip)

      // 同じIDで異なる名前のクリップを保存
      const updatedClip = VideoClip.reconstruct({
        id: clip.id,
        name: '更新後の名前',
        description: '更新された説明',
        videoStandard: clip.videoStandard,
        videoDefinition: clip.videoDefinition,
        startTimecode: clip.startTimecode,
        endTimecode: clip.endTimecode,
        deletedAt: null,
      })
      await repository.save(updatedClip)

      const found = await repository.findById(clip.id)
      expect(found!.name).toBe('更新後の名前')
      expect(found!.description).toBe('更新された説明')
    })

    it('タイムコードが正しく保存・復元される', async () => {
      const standard = VideoStandard.pal()
      const clip = createTestVideoClip({
        startTimecode: Timecode.fromString('01:23:45:12', standard),
        endTimecode: Timecode.fromString('02:34:56:20', standard),
      })

      await repository.save(clip)
      const found = await repository.findById(clip.id)

      expect(found!.startTimecode.toString()).toBe('01:23:45:12')
      expect(found!.endTimecode.toString()).toBe('02:34:56:20')
    })
  })

  describe('findByIds', () => {
    it('複数のIDで一括取得できる', async () => {
      const clip1 = createTestVideoClip({ name: 'クリップ1' })
      const clip2 = createTestVideoClip({ name: 'クリップ2' })
      const clip3 = createTestVideoClip({ name: 'クリップ3' })

      await repository.save(clip1)
      await repository.save(clip2)
      await repository.save(clip3)

      const found = await repository.findByIds([clip1.id, clip3.id])

      expect(found).toHaveLength(2)
      expect(found.some((c) => c.id.equals(clip1.id))).toBe(true)
      expect(found.some((c) => c.id.equals(clip3.id))).toBe(true)
    })

    it('空配列を渡すと空配列を返す', async () => {
      const found = await repository.findByIds([])
      expect(found).toEqual([])
    })

    it('存在しないIDは結果に含まれない', async () => {
      const clip = createTestVideoClip()
      await repository.save(clip)

      const nonExistentId = VideoClipId.create()
      const found = await repository.findByIds([clip.id, nonExistentId])

      expect(found).toHaveLength(1)
      expect(found[0].id.equals(clip.id)).toBe(true)
    })
  })

  describe('findAll', () => {
    it('全てのクリップを取得できる', async () => {
      const clip1 = createTestVideoClip({ name: 'クリップ1' })
      const clip2 = createTestVideoClip({ name: 'クリップ2' })

      await repository.save(clip1)
      await repository.save(clip2)

      const all = await repository.findAll()

      expect(all).toHaveLength(2)
    })

    it('データがない場合は空配列を返す', async () => {
      const all = await repository.findAll()
      expect(all).toEqual([])
    })
  })

  describe('findCompatible', () => {
    it('指定した規格と解像度に一致するクリップを取得できる', async () => {
      const palSd = createTestVideoClip({
        name: 'PAL SD',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const palHd = createTestVideoClip({
        name: 'PAL HD',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.hd(),
      })
      const ntscSd = createTestVideoClip({
        name: 'NTSC SD',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.sd(),
      })

      await repository.save(palSd)
      await repository.save(palHd)
      await repository.save(ntscSd)

      const result = await repository.findCompatible(VideoStandard.pal(), VideoDefinition.sd())

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('PAL SD')
    })

    it('一致するクリップがない場合は空配列を返す', async () => {
      const palSd = createTestVideoClip({
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      await repository.save(palSd)

      const result = await repository.findCompatible(VideoStandard.ntsc(), VideoDefinition.hd())

      expect(result).toEqual([])
    })
  })

  describe('delete', () => {
    it('クリップを削除できる', async () => {
      const clip = createTestVideoClip()
      await repository.save(clip)

      await repository.delete(clip.id)

      const found = await repository.findById(clip.id)
      expect(found).toBeNull()
    })

    it('存在しないIDを削除してもエラーにならない', async () => {
      const id = VideoClipId.create()
      await expect(repository.delete(id)).resolves.not.toThrow()
    })
  })

  describe('exists', () => {
    it('存在するIDの場合trueを返す', async () => {
      const clip = createTestVideoClip()
      await repository.save(clip)

      const result = await repository.exists(clip.id)

      expect(result).toBe(true)
    })

    it('存在しないIDの場合falseを返す', async () => {
      const id = VideoClipId.create()
      const result = await repository.exists(id)

      expect(result).toBe(false)
    })
  })

  describe('NTSC規格のクリップ', () => {
    it('NTSCクリップを正しく保存・取得できる', async () => {
      const standard = VideoStandard.ntsc()
      const clip = createTestVideoClip({
        name: 'NTSCクリップ',
        videoStandard: standard,
        startTimecode: Timecode.fromString('00:00:00:00', standard),
        endTimecode: Timecode.fromString('00:00:30:15', standard), // 30fps なので 15フレームが有効
      })

      await repository.save(clip)
      const found = await repository.findById(clip.id)

      expect(found!.videoStandard.toString()).toBe('NTSC')
      expect(found!.endTimecode.toString()).toBe('00:00:30:15')
    })
  })
})
