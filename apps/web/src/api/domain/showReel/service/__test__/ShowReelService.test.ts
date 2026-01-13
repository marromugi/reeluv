import { MixedVideoStandardError } from '../../../shared/error/DomainError'
import { Timecode } from '../../../shared/valueObject/Timecode'
import { VideoDefinition } from '../../../shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../shared/valueObject/VideoStandard'
import { VideoClip } from '../../../videoClip/entity/VideoClip'
import { ShowReel } from '../../entity/ShowReel'
import { ShowReelService } from '../ShowReelService'

describe('ShowReelService', () => {
  const service = new ShowReelService()

  const createClip = (
    name: string,
    standard: VideoStandard,
    definition: VideoDefinition,
    endTimecode: string
  ) =>
    VideoClip.create({
      name,
      videoStandard: standard,
      videoDefinition: definition,
      startTimecode: Timecode.fromString('00:00:00:00', standard),
      endTimecode: Timecode.fromString(endTimecode, standard),
    })

  const createShowReel = (
    name: string,
    standard: VideoStandard,
    definition: VideoDefinition
  ) =>
    ShowReel.create({
      name,
      videoStandard: standard,
      videoDefinition: definition,
    })

  describe('calculateTotalDuration', () => {
    it('ShowReelの総再生時間を返す', () => {
      const showReel = createShowReel('Test', VideoStandard.pal(), VideoDefinition.sd())
      const clip1 = createClip('Clip 1', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00')
      const clip2 = createClip('Clip 2', VideoStandard.pal(), VideoDefinition.sd(), '00:01:00:00')

      showReel.addClip(clip1)
      showReel.addClip(clip2)

      const duration = service.calculateTotalDuration(showReel)

      expect(duration.toString()).toBe('00:01:30:00')
    })
  })

  describe('calculateCombinedDuration', () => {
    it('複数ShowReelの合計時間を計算する', () => {
      const reel1 = createShowReel('Reel 1', VideoStandard.pal(), VideoDefinition.sd())
      const reel2 = createShowReel('Reel 2', VideoStandard.pal(), VideoDefinition.sd())

      reel1.addClip(createClip('Clip 1', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00'))
      reel2.addClip(createClip('Clip 2', VideoStandard.pal(), VideoDefinition.sd(), '00:01:00:00'))

      const total = service.calculateCombinedDuration([reel1, reel2])

      expect(total.toString()).toBe('00:01:30:00')
    })

    it('空配列の場合は00:00:00:00を返す', () => {
      const total = service.calculateCombinedDuration([])

      expect(total.toString()).toBe('00:00:00:00')
    })

    it('異なる規格が混在する場合はエラーになる', () => {
      const palReel = createShowReel('PAL Reel', VideoStandard.pal(), VideoDefinition.sd())
      const ntscReel = createShowReel('NTSC Reel', VideoStandard.ntsc(), VideoDefinition.sd())

      expect(() => service.calculateCombinedDuration([palReel, ntscReel])).toThrow(
        MixedVideoStandardError
      )
    })
  })

  describe('validateClipCompatibility', () => {
    it('互換性がある場合はisValid=trueを返す', () => {
      const showReel = createShowReel('PAL SD', VideoStandard.pal(), VideoDefinition.sd())
      const clip = createClip('PAL SD', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00')

      const result = service.validateClipCompatibility(clip, showReel)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('規格が異なる場合はエラーを返す', () => {
      const showReel = createShowReel('PAL SD', VideoStandard.pal(), VideoDefinition.sd())
      const clip = createClip('NTSC SD', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:30:00')

      const result = service.validateClipCompatibility(clip, showReel)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].code).toBe('INCOMPATIBLE_STANDARD')
      expect(result.errors[0].field).toBe('videoStandard')
    })

    it('解像度が異なる場合はエラーを返す', () => {
      const showReel = createShowReel('PAL SD', VideoStandard.pal(), VideoDefinition.sd())
      const clip = createClip('PAL HD', VideoStandard.pal(), VideoDefinition.hd(), '00:00:30:00')

      const result = service.validateClipCompatibility(clip, showReel)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].code).toBe('INCOMPATIBLE_DEFINITION')
      expect(result.errors[0].field).toBe('videoDefinition')
    })

    it('規格と解像度の両方が異なる場合は2つのエラーを返す', () => {
      const showReel = createShowReel('PAL SD', VideoStandard.pal(), VideoDefinition.sd())
      const clip = createClip('NTSC HD', VideoStandard.ntsc(), VideoDefinition.hd(), '00:00:30:00')

      const result = service.validateClipCompatibility(clip, showReel)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
    })
  })

  describe('validateClipsCompatibility', () => {
    it('複数クリップを一括検証できる', () => {
      const showReel = createShowReel('PAL SD', VideoStandard.pal(), VideoDefinition.sd())
      const clips = [
        createClip('PAL SD', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('NTSC SD', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('PAL HD', VideoStandard.pal(), VideoDefinition.hd(), '00:00:30:00'),
      ]

      const results = service.validateClipsCompatibility(clips, showReel)

      expect(results).toHaveLength(3)
      expect(results[0].isValid).toBe(true)
      expect(results[1].isValid).toBe(false)
      expect(results[2].isValid).toBe(false)
    })
  })

  describe('filterCompatibleClips', () => {
    it('互換性のあるクリップのみをフィルタリングする', () => {
      const showReel = createShowReel('PAL SD', VideoStandard.pal(), VideoDefinition.sd())
      const clips = [
        createClip('PAL SD 1', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('NTSC SD', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('PAL SD 2', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('PAL HD', VideoStandard.pal(), VideoDefinition.hd(), '00:00:30:00'),
      ]

      const filtered = service.filterCompatibleClips(clips, showReel)

      expect(filtered).toHaveLength(2)
      expect(filtered[0].name).toBe('PAL SD 1')
      expect(filtered[1].name).toBe('PAL SD 2')
    })

    it('該当なしの場合は空配列を返す', () => {
      const showReel = createShowReel('PAL SD', VideoStandard.pal(), VideoDefinition.sd())
      const clips = [
        createClip('NTSC SD', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('PAL HD', VideoStandard.pal(), VideoDefinition.hd(), '00:00:30:00'),
      ]

      const filtered = service.filterCompatibleClips(clips, showReel)

      expect(filtered).toHaveLength(0)
    })
  })
})
