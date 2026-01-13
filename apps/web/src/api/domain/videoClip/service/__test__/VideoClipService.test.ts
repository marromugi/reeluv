import { MixedVideoStandardError } from '../../../shared/error/DomainError'
import { Timecode } from '../../../shared/valueObject/Timecode'
import { VideoDefinition } from '../../../shared/valueObject/VideoDefinition'
import { VideoStandard } from '../../../shared/valueObject/VideoStandard'
import { VideoClip } from '../../entity/VideoClip'
import { VideoClipService } from '../VideoClipService'

describe('VideoClipService', () => {
  const service = new VideoClipService()

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

  describe('calculateDuration', () => {
    it('クリップの再生時間を返す', () => {
      const clip = createClip(
        'Test',
        VideoStandard.pal(),
        VideoDefinition.sd(),
        '00:00:30:12'
      )

      const duration = service.calculateDuration(clip)

      expect(duration.toString()).toBe('00:00:30:12')
    })
  })

  describe('calculateTotalDuration', () => {
    it('複数クリップの合計時間を計算する', () => {
      const clips = [
        createClip('Clip 1', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:12'),
        createClip('Clip 2', VideoStandard.pal(), VideoDefinition.sd(), '00:01:30:00'),
      ]

      const total = service.calculateTotalDuration(clips)

      expect(total.toString()).toBe('00:02:00:12')
    })

    it('空配列の場合は00:00:00:00を返す', () => {
      const total = service.calculateTotalDuration([])

      expect(total.toString()).toBe('00:00:00:00')
    })

    it('異なる規格が混在する場合はエラーになる', () => {
      const clips = [
        createClip('PAL', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('NTSC', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:30:00'),
      ]

      expect(() => service.calculateTotalDuration(clips)).toThrow(
        MixedVideoStandardError
      )
    })
  })

  describe('groupByStandard', () => {
    it('規格ごとにグループ化する', () => {
      const clips = [
        createClip('PAL 1', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('NTSC 1', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('PAL 2', VideoStandard.pal(), VideoDefinition.hd(), '00:00:30:00'),
      ]

      const groups = service.groupByStandard(clips)

      expect(groups.get('PAL')?.length).toBe(2)
      expect(groups.get('NTSC')?.length).toBe(1)
    })

    it('空配列の場合は空のMapを返す', () => {
      const groups = service.groupByStandard([])

      expect(groups.size).toBe(0)
    })
  })

  describe('groupByDefinition', () => {
    it('解像度ごとにグループ化する', () => {
      const clips = [
        createClip('SD 1', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00'),
        createClip('HD 1', VideoStandard.pal(), VideoDefinition.hd(), '00:00:30:00'),
        createClip('SD 2', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:30:00'),
      ]

      const groups = service.groupByDefinition(clips)

      expect(groups.get('SD')?.length).toBe(2)
      expect(groups.get('HD')?.length).toBe(1)
    })
  })

  describe('filterByCompatibility', () => {
    const clips = [
      createClip('PAL SD', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00'),
      createClip('PAL HD', VideoStandard.pal(), VideoDefinition.hd(), '00:00:30:00'),
      createClip('NTSC SD', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:30:00'),
      createClip('NTSC HD', VideoStandard.ntsc(), VideoDefinition.hd(), '00:00:30:00'),
    ]

    it('PAL SDのみをフィルタリングできる', () => {
      const filtered = service.filterByCompatibility(
        clips,
        VideoStandard.pal(),
        VideoDefinition.sd()
      )

      expect(filtered.length).toBe(1)
      expect(filtered[0].name).toBe('PAL SD')
    })

    it('NTSC HDのみをフィルタリングできる', () => {
      const filtered = service.filterByCompatibility(
        clips,
        VideoStandard.ntsc(),
        VideoDefinition.hd()
      )

      expect(filtered.length).toBe(1)
      expect(filtered[0].name).toBe('NTSC HD')
    })

    it('該当なしの場合は空配列を返す', () => {
      const palSdOnly = [
        createClip('PAL SD', VideoStandard.pal(), VideoDefinition.sd(), '00:00:30:00'),
      ]

      const filtered = service.filterByCompatibility(
        palSdOnly,
        VideoStandard.ntsc(),
        VideoDefinition.hd()
      )

      expect(filtered.length).toBe(0)
    })
  })

  describe('spec.md サンプルデータ', () => {
    it('NTSC SDクリップの合計が00:00:54:08になる', () => {
      // Clip 2: M&M's - 00:00:15:27
      // Clip 4: Fiat - 00:00:18:11
      // Clip 5: Pepsi - 00:00:20:00
      const clips = [
        createClip("M&M's", VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:15:27'),
        createClip('Fiat', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:18:11'),
        createClip('Pepsi', VideoStandard.ntsc(), VideoDefinition.sd(), '00:00:20:00'),
      ]

      const total = service.calculateTotalDuration(clips)

      expect(total.toString()).toBe('00:00:54:08')
    })
  })
})
