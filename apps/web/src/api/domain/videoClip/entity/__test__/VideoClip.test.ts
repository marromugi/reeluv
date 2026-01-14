import { EmptyNameError, InvalidTimecodeRangeError } from '../../../shared/error/DomainError'
import { Timecode } from '../../../shared/valueObject/Timecode'
import { VideoDefinition } from '../../../shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../shared/valueObject/VideoStandard'
import { VideoClipId } from '../../valueObject/VideoClipId'
import { VideoClip } from '../VideoClip'

describe('VideoClip', () => {
  const defaultParams = {
    name: 'Test Clip',
    description: 'テストクリップの説明',
    videoStandard: VideoStandard.pal(),
    videoDefinition: VideoDefinition.sd(),
    startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
    endTimecode: Timecode.fromString('00:00:30:12', VideoStandard.pal()),
  }

  describe('create', () => {
    it('VideoClipを作成できる', () => {
      const clip = VideoClip.create(defaultParams)

      expect(clip.name).toBe('Test Clip')
      expect(clip.description).toBe('テストクリップの説明')
      expect(clip.videoStandard.equals(VideoStandard.pal())).toBe(true)
      expect(clip.videoDefinition.equals(VideoDefinition.sd())).toBe(true)
      expect(clip.startTimecode.toString()).toBe('00:00:00:00')
      expect(clip.endTimecode.toString()).toBe('00:00:30:12')
    })

    it('IDを指定して作成できる', () => {
      const id = VideoClipId.fromString('custom-id')
      const clip = VideoClip.create({ ...defaultParams, id })

      expect(clip.id.equals(id)).toBe(true)
    })

    it('IDを省略すると自動生成される', () => {
      const clip = VideoClip.create(defaultParams)
      expect(clip.id.toString()).toBeTruthy()
    })

    it('descriptionを省略するとnullになる', () => {
      const clip = VideoClip.create({
        ...defaultParams,
        description: undefined,
      })
      expect(clip.description).toBeNull()
    })

    it('名前が空だとエラーになる', () => {
      expect(() => VideoClip.create({ ...defaultParams, name: '' })).toThrow(EmptyNameError)
    })

    it('名前が空白のみだとエラーになる', () => {
      expect(() => VideoClip.create({ ...defaultParams, name: '   ' })).toThrow(EmptyNameError)
    })

    it('終了タイムコードが開始以前だとエラーになる', () => {
      expect(() =>
        VideoClip.create({
          ...defaultParams,
          startTimecode: Timecode.fromString('00:01:00:00', VideoStandard.pal()),
          endTimecode: Timecode.fromString('00:00:30:00', VideoStandard.pal()),
        })
      ).toThrow(InvalidTimecodeRangeError)
    })

    it('開始と終了が同じタイムコードだとエラーになる', () => {
      const sameTimecode = Timecode.fromString('00:01:00:00', VideoStandard.pal())
      expect(() =>
        VideoClip.create({
          ...defaultParams,
          startTimecode: sameTimecode,
          endTimecode: sameTimecode,
        })
      ).toThrow(InvalidTimecodeRangeError)
    })
  })

  describe('reconstruct', () => {
    it('バリデーションなしで再構築できる', () => {
      const id = VideoClipId.fromString('existing-id')
      const clip = VideoClip.reconstruct({
        id,
        name: 'Reconstructed Clip',
        description: null,
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.hd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.ntsc()),
        endTimecode: Timecode.fromString('00:00:15:27', VideoStandard.ntsc()),
        deletedAt: null,
      })

      expect(clip.id.equals(id)).toBe(true)
      expect(clip.name).toBe('Reconstructed Clip')
    })

    it('削除済みのクリップを再構築できる', () => {
      const id = VideoClipId.fromString('deleted-id')
      const deletedAt = new Date('2024-01-01T00:00:00Z')
      const clip = VideoClip.reconstruct({
        id,
        name: 'Deleted Clip',
        description: null,
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:10:00', VideoStandard.pal()),
        deletedAt,
      })

      expect(clip.isDeleted).toBe(true)
      expect(clip.deletedAt).toEqual(deletedAt)
    })
  })

  describe('isDeleted', () => {
    it('deletedAtがnullの場合falseを返す', () => {
      const clip = VideoClip.create(defaultParams)
      expect(clip.isDeleted).toBe(false)
    })

    it('deletedAtが設定されている場合trueを返す', () => {
      const clip = VideoClip.reconstruct({
        id: VideoClipId.fromString('test-id'),
        name: 'Test Clip',
        description: null,
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:10:00', VideoStandard.pal()),
        deletedAt: new Date(),
      })
      expect(clip.isDeleted).toBe(true)
    })
  })

  describe('duration', () => {
    it('再生時間を正しく計算する', () => {
      const clip = VideoClip.create({
        ...defaultParams,
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:12', VideoStandard.pal()),
      })

      expect(clip.duration.toString()).toBe('00:00:30:12')
    })

    it('開始が00:00:00:00以外でも正しく計算する', () => {
      const clip = VideoClip.create({
        ...defaultParams,
        startTimecode: Timecode.fromString('00:01:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:02:30:00', VideoStandard.pal()),
      })

      expect(clip.duration.toString()).toBe('00:01:30:00')
    })
  })

  describe('isCompatibleWithStandardAndDefinition', () => {
    it('同じ規格と解像度ならtrueを返す', () => {
      const clip = VideoClip.create(defaultParams)

      expect(
        clip.isCompatibleWithStandardAndDefinition(VideoStandard.pal(), VideoDefinition.sd())
      ).toBe(true)
    })

    it('異なる規格ならfalseを返す', () => {
      const clip = VideoClip.create(defaultParams)

      expect(
        clip.isCompatibleWithStandardAndDefinition(VideoStandard.ntsc(), VideoDefinition.sd())
      ).toBe(false)
    })

    it('異なる解像度ならfalseを返す', () => {
      const clip = VideoClip.create(defaultParams)

      expect(
        clip.isCompatibleWithStandardAndDefinition(VideoStandard.pal(), VideoDefinition.hd())
      ).toBe(false)
    })

    it('両方異なる場合もfalseを返す', () => {
      const clip = VideoClip.create(defaultParams)

      expect(
        clip.isCompatibleWithStandardAndDefinition(VideoStandard.ntsc(), VideoDefinition.hd())
      ).toBe(false)
    })
  })

  describe('equals', () => {
    it('同じIDのクリップはtrueを返す', () => {
      const id = VideoClipId.fromString('same-id')
      const clip1 = VideoClip.create({ ...defaultParams, id })
      const clip2 = VideoClip.create({ ...defaultParams, id, name: 'Different Name' })

      expect(clip1.equals(clip2)).toBe(true)
    })

    it('異なるIDのクリップはfalseを返す', () => {
      const clip1 = VideoClip.create({ ...defaultParams, id: VideoClipId.fromString('id-1') })
      const clip2 = VideoClip.create({ ...defaultParams, id: VideoClipId.fromString('id-2') })

      expect(clip1.equals(clip2)).toBe(false)
    })
  })

  describe('spec.md サンプルデータ', () => {
    it('Clip 1 (Bud Light) を作成できる', () => {
      const clip = VideoClip.create({
        name: 'Bud Light',
        description: 'A factory is working on the new Bud Light Platinum.',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
        endTimecode: Timecode.fromString('00:00:30:12', VideoStandard.pal()),
      })

      expect(clip.duration.toString()).toBe('00:00:30:12')
    })

    it("Clip 2 (M&M's) を作成できる", () => {
      const clip = VideoClip.create({
        name: "M&M's",
        description: 'At a party, a brown shelled M&M is mistaken for being naked.',
        videoStandard: VideoStandard.ntsc(),
        videoDefinition: VideoDefinition.sd(),
        startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.ntsc()),
        endTimecode: Timecode.fromString('00:00:15:27', VideoStandard.ntsc()),
      })

      expect(clip.duration.toString()).toBe('00:00:15:27')
    })
  })
})
