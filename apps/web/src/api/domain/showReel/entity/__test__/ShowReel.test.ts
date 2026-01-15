import {
  ClipIndexOutOfBoundsError,
  ClipNotFoundError,
  EmptyNameError,
  IncompatibleClipError,
} from '../../../shared/error/DomainError'
import { Timecode } from '../../../shared/valueObject/Timecode'
import { VideoDefinition } from '../../../shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../shared/valueObject/VideoStandard'
import { VideoClip } from '../../../videoClip/entity/VideoClip'
import { VideoClipId } from '../../../videoClip/valueObject/VideoClipId'
import { ShowReelId } from '../../valueObject/ShowReelId'
import { ShowReel } from '../ShowReel'

describe('ShowReel', () => {
  const createPalSdClip = (name: string, endTimecode: string) =>
    VideoClip.create({
      name,
      videoStandard: VideoStandard.pal(),
      videoDefinition: VideoDefinition.sd(),
      startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
      endTimecode: Timecode.fromString(endTimecode, VideoStandard.pal()),
    })

  const createNtscSdClip = (name: string, endTimecode: string) =>
    VideoClip.create({
      name,
      videoStandard: VideoStandard.ntsc(),
      videoDefinition: VideoDefinition.sd(),
      startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.ntsc()),
      endTimecode: Timecode.fromString(endTimecode, VideoStandard.ntsc()),
    })

  const createPalHdClip = (name: string, endTimecode: string) =>
    VideoClip.create({
      name,
      videoStandard: VideoStandard.pal(),
      videoDefinition: VideoDefinition.hd(),
      startTimecode: Timecode.fromString('00:00:00:00', VideoStandard.pal()),
      endTimecode: Timecode.fromString(endTimecode, VideoStandard.pal()),
    })

  describe('create', () => {
    it('ShowReelを作成できる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })

      expect(showReel.name).toBe('Test Reel')
      expect(showReel.videoStandard.equals(VideoStandard.pal())).toBe(true)
      expect(showReel.videoDefinition.equals(VideoDefinition.sd())).toBe(true)
      expect(showReel.clipCount).toBe(0)
    })

    it('IDを指定して作成できる', () => {
      const id = ShowReelId.fromString('custom-id')
      const showReel = ShowReel.create({
        id,
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })

      expect(showReel.id.equals(id)).toBe(true)
    })

    it('名前が空だとエラーになる', () => {
      expect(() =>
        ShowReel.create({
          name: '',
          videoStandard: VideoStandard.pal(),
          videoDefinition: VideoDefinition.sd(),
        })
      ).toThrow(EmptyNameError)
    })
  })

  describe('reconstruct', () => {
    it('既存のクリップを含めて再構築できる', () => {
      const clip = createPalSdClip('Clip 1', '00:00:30:00')
      const showReel = ShowReel.reconstruct({
        id: ShowReelId.fromString('reel-id'),
        name: 'Reconstructed Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
        clips: [clip],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      })

      expect(showReel.clipCount).toBe(1)
      expect(showReel.createdAt.getTime()).toBe(new Date('2024-01-01').getTime())
    })
  })

  describe('addClip', () => {
    it('互換性のあるクリップを追加できる', () => {
      const showReel = ShowReel.create({
        name: 'PAL SD Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('PAL SD Clip', '00:00:30:00')

      showReel.addClip(clip)

      expect(showReel.clipCount).toBe(1)
      expect(showReel.clips[0].equals(clip)).toBe(true)
    })

    it('同じクリップを複数回追加できる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('Clip', '00:00:30:00')

      showReel.addClip(clip)
      showReel.addClip(clip)

      expect(showReel.clipCount).toBe(2)
      expect(showReel.clips[0].equals(clip)).toBe(true)
      expect(showReel.clips[1].equals(clip)).toBe(true)
    })

    it('異なるVideoStandardのクリップは追加できない', () => {
      const showReel = ShowReel.create({
        name: 'PAL SD Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const ntscClip = createNtscSdClip('NTSC Clip', '00:00:15:27')

      expect(() => showReel.addClip(ntscClip)).toThrow(IncompatibleClipError)
    })

    it('異なるVideoDefinitionのクリップは追加できない', () => {
      const showReel = ShowReel.create({
        name: 'PAL SD Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const hdClip = createPalHdClip('HD Clip', '00:00:10:05')

      expect(() => showReel.addClip(hdClip)).toThrow(IncompatibleClipError)
    })
  })

  describe('removeClip', () => {
    it('クリップを削除できる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('Clip', '00:00:30:00')
      showReel.addClip(clip)

      showReel.removeClip(clip.id)

      expect(showReel.clipCount).toBe(0)
    })

    it('存在しないクリップの削除はエラーになる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })

      expect(() => showReel.removeClip(VideoClipId.fromString('non-existent'))).toThrow(
        ClipNotFoundError
      )
    })
  })

  describe('removeClipAt', () => {
    it('指定インデックスのクリップを削除できる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip1 = createPalSdClip('Clip 1', '00:00:10:00')
      const clip2 = createPalSdClip('Clip 2', '00:00:20:00')
      const clip3 = createPalSdClip('Clip 3', '00:00:30:00')
      showReel.addClip(clip1)
      showReel.addClip(clip2)
      showReel.addClip(clip3)

      showReel.removeClipAt(1)

      expect(showReel.clipCount).toBe(2)
      expect(showReel.clips[0].equals(clip1)).toBe(true)
      expect(showReel.clips[1].equals(clip3)).toBe(true)
    })

    it('同じクリップが複数ある場合、指定インデックスのみ削除される', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('Clip', '00:00:10:00')
      showReel.addClip(clip)
      showReel.addClip(clip)
      showReel.addClip(clip)

      showReel.removeClipAt(1)

      expect(showReel.clipCount).toBe(2)
    })

    it('範囲外のインデックスはエラーになる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('Clip', '00:00:30:00')
      showReel.addClip(clip)

      expect(() => showReel.removeClipAt(1)).toThrow(ClipIndexOutOfBoundsError)
      expect(() => showReel.removeClipAt(100)).toThrow(ClipIndexOutOfBoundsError)
    })

    it('負のインデックスはエラーになる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('Clip', '00:00:30:00')
      showReel.addClip(clip)

      expect(() => showReel.removeClipAt(-1)).toThrow(ClipIndexOutOfBoundsError)
    })

    it('空のShowReelで削除しようとするとエラーになる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })

      expect(() => showReel.removeClipAt(0)).toThrow(ClipIndexOutOfBoundsError)
    })
  })

  describe('reorderClips', () => {
    it('クリップの順序を変更できる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip1 = createPalSdClip('Clip 1', '00:00:10:00')
      const clip2 = createPalSdClip('Clip 2', '00:00:20:00')
      const clip3 = createPalSdClip('Clip 3', '00:00:30:00')

      showReel.addClip(clip1)
      showReel.addClip(clip2)
      showReel.addClip(clip3)

      showReel.reorderClips([clip3.id, clip1.id, clip2.id])

      expect(showReel.clips[0].equals(clip3)).toBe(true)
      expect(showReel.clips[1].equals(clip1)).toBe(true)
      expect(showReel.clips[2].equals(clip2)).toBe(true)
    })

    it('存在しないクリップIDが含まれるとエラーになる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('Clip', '00:00:30:00')
      showReel.addClip(clip)

      expect(() =>
        showReel.reorderClips([clip.id, VideoClipId.fromString('non-existent')])
      ).toThrow(ClipNotFoundError)
    })
  })

  describe('rename', () => {
    it('名前を変更できる', () => {
      const showReel = ShowReel.create({
        name: 'Original Name',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })

      showReel.rename('New Name')

      expect(showReel.name).toBe('New Name')
    })

    it('空の名前への変更はエラーになる', () => {
      const showReel = ShowReel.create({
        name: 'Original Name',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })

      expect(() => showReel.rename('')).toThrow(EmptyNameError)
    })
  })

  describe('totalDuration', () => {
    it('クリップがない場合は00:00:00:00を返す', () => {
      const showReel = ShowReel.create({
        name: 'Empty Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })

      expect(showReel.totalDuration.toString()).toBe('00:00:00:00')
    })

    it('クリップの合計時間を正しく計算する', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip1 = createPalSdClip('Clip 1', '00:00:30:12')
      const clip2 = createPalSdClip('Clip 2', '00:01:30:00')

      showReel.addClip(clip1)
      showReel.addClip(clip2)

      expect(showReel.totalDuration.toString()).toBe('00:02:00:12')
    })
  })

  describe('canAddClip', () => {
    it('互換性があればtrueを返す', () => {
      const showReel = ShowReel.create({
        name: 'PAL SD Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('PAL SD Clip', '00:00:30:00')

      expect(showReel.canAddClip(clip)).toBe(true)
    })

    it('互換性がなければfalseを返す', () => {
      const showReel = ShowReel.create({
        name: 'PAL SD Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const ntscClip = createNtscSdClip('NTSC Clip', '00:00:15:27')

      expect(showReel.canAddClip(ntscClip)).toBe(false)
    })
  })

  describe('hasClip', () => {
    it('クリップが存在すればtrueを返す', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('Clip', '00:00:30:00')
      showReel.addClip(clip)

      expect(showReel.hasClip(clip.id)).toBe(true)
    })

    it('クリップが存在しなければfalseを返す', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })

      expect(showReel.hasClip(VideoClipId.fromString('non-existent'))).toBe(false)
    })
  })

  describe('getClipAt', () => {
    it('指定位置のクリップを取得できる', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })
      const clip = createPalSdClip('Clip', '00:00:30:00')
      showReel.addClip(clip)

      expect(showReel.getClipAt(0)?.equals(clip)).toBe(true)
    })

    it('範囲外の位置はnullを返す', () => {
      const showReel = ShowReel.create({
        name: 'Test Reel',
        videoStandard: VideoStandard.pal(),
        videoDefinition: VideoDefinition.sd(),
      })

      expect(showReel.getClipAt(0)).toBeNull()
      expect(showReel.getClipAt(100)).toBeNull()
    })
  })

  describe('受け入れテスト', () => {
    describe('テスト1: NTSCクリップをPALリールに追加不可', () => {
      it('PAL SDリールにNTSC SDクリップは追加できない', () => {
        const showReel = ShowReel.create({
          name: 'PAL SD Video Reel',
          videoStandard: VideoStandard.pal(),
          videoDefinition: VideoDefinition.sd(),
        })
        const ntscClip = createNtscSdClip('NTSC SD Clip', '00:00:15:27')

        expect(() => showReel.addClip(ntscClip)).toThrow(IncompatibleClipError)
      })
    })

    describe('テスト2: HDクリップをSDリールに追加不可', () => {
      it('PAL SDリールにPAL HDクリップは追加できない', () => {
        const showReel = ShowReel.create({
          name: 'PAL SD Video Reel',
          videoStandard: VideoStandard.pal(),
          videoDefinition: VideoDefinition.sd(),
        })
        const hdClip = createPalHdClip('PAL HD Clip', '00:00:10:05')

        expect(() => showReel.addClip(hdClip)).toThrow(IncompatibleClipError)
      })
    })

    describe('テスト3: PAL SDクリップの合計時間', () => {
      it('PAL SDクリップの合計が正しく計算される', () => {
        const showReel = ShowReel.create({
          name: 'PAL SD Video Reel',
          videoStandard: VideoStandard.pal(),
          videoDefinition: VideoDefinition.sd(),
        })

        // Clip 1: Bud Light - 00:00:30:12
        const clip1 = createPalSdClip('Bud Light', '00:00:30:12')
        // Clip 3: Audi - 00:01:30:00
        const clip3 = createPalSdClip('Audi', '00:01:30:00')

        showReel.addClip(clip1)
        showReel.addClip(clip3)

        expect(showReel.totalDuration.toString()).toBe('00:02:00:12')
      })
    })

    describe('テスト4: NTSC SDクリップの合計時間', () => {
      it('NTSC SDクリップの合計が00:00:54:08になる', () => {
        const showReel = ShowReel.create({
          name: 'NTSC SD Video Reel',
          videoStandard: VideoStandard.ntsc(),
          videoDefinition: VideoDefinition.sd(),
        })

        // Clip 2: M&M's - 00:00:15:27
        const clip2 = createNtscSdClip("M&M's", '00:00:15:27')
        // Clip 4: Fiat - 00:00:18:11
        const clip4 = createNtscSdClip('Fiat', '00:00:18:11')
        // Clip 5: Pepsi - 00:00:20:00
        const clip5 = createNtscSdClip('Pepsi', '00:00:20:00')

        showReel.addClip(clip2)
        showReel.addClip(clip4)
        showReel.addClip(clip5)

        expect(showReel.totalDuration.toString()).toBe('00:00:54:08')
      })
    })
  })
})
