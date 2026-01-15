import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useTimelineClips } from '../useTimelineClips'

import type { ShowReelClip } from '@/client/api/model'

/** テスト用のクリップデータを生成する */
const createMockClip = (id: string, name: string): ShowReelClip => ({
  id,
  name,
  description: null,
  videoStandard: 'NTSC',
  videoDefinition: 'HD',
  startTimecode: '00:00:00:00',
  endTimecode: '00:00:10:00',
  duration: '00:00:10:00',
})

describe('useTimelineClips', () => {
  describe('初期状態', () => {
    it('サーバーから取得したクリップにユニークIDが付与されること', () => {
      const serverClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1'),
        createMockClip('clip-2', 'クリップ2'),
      ]

      const { result } = renderHook(() => useTimelineClips(serverClips))

      expect(result.current.clips).toHaveLength(2)
      expect(result.current.clips[0]).toMatchObject({ id: 'clip-1', name: 'クリップ1' })
      expect(result.current.clips[1]).toMatchObject({ id: 'clip-2', name: 'クリップ2' })
      // uidが付与されていること
      expect(result.current.clips[0].uid).toBeDefined()
      expect(result.current.clips[1].uid).toBeDefined()
      // 各クリップのuidがユニークであること
      expect(result.current.clips[0].uid).not.toBe(result.current.clips[1].uid)
    })

    it('空の配列を渡した場合は空の配列が返ること', () => {
      const { result } = renderHook(() => useTimelineClips([]))

      expect(result.current.clips).toHaveLength(0)
    })
  })

  describe('reorderClips', () => {
    it('クリップの並び順を変更できること', () => {
      const serverClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1'),
        createMockClip('clip-2', 'クリップ2'),
        createMockClip('clip-3', 'クリップ3'),
      ]

      const { result } = renderHook(() => useTimelineClips(serverClips))

      // 元の順序を保存
      const originalClips = [...result.current.clips]

      // 並び順を逆にする
      act(() => {
        result.current.reorderClips([originalClips[2], originalClips[1], originalClips[0]])
      })

      expect(result.current.clips[0].id).toBe('clip-3')
      expect(result.current.clips[1].id).toBe('clip-2')
      expect(result.current.clips[2].id).toBe('clip-1')
    })
  })

  describe('resetOrder', () => {
    it('並び替えをリセットするとサーバーデータの順序に戻ること', () => {
      const serverClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1'),
        createMockClip('clip-2', 'クリップ2'),
      ]

      const { result } = renderHook(() => useTimelineClips(serverClips))

      // 元の順序を保存
      const originalClips = [...result.current.clips]

      // 並び順を変更
      act(() => {
        result.current.reorderClips([originalClips[1], originalClips[0]])
      })

      expect(result.current.clips[0].id).toBe('clip-2')

      // リセット
      act(() => {
        result.current.resetOrder()
      })

      expect(result.current.clips[0].id).toBe('clip-1')
      expect(result.current.clips[1].id).toBe('clip-2')
    })
  })

  describe('サーバーデータとの同期', () => {
    it('サーバーデータが変更されたとき、ローカル並び順がない場合は新しいデータが反映されること', () => {
      const initialClips: ShowReelClip[] = [createMockClip('clip-1', 'クリップ1')]

      const { result, rerender } = renderHook(({ clips }) => useTimelineClips(clips), {
        initialProps: { clips: initialClips },
      })

      expect(result.current.clips).toHaveLength(1)

      // サーバーデータを更新
      const updatedClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1'),
        createMockClip('clip-2', 'クリップ2'),
      ]

      rerender({ clips: updatedClips })

      expect(result.current.clips).toHaveLength(2)
    })

    it('サーバーからクリップが削除された場合、ローカル並び順がリセットされサーバーの順序になること', () => {
      const serverClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1'),
        createMockClip('clip-2', 'クリップ2'),
        createMockClip('clip-3', 'クリップ3'),
      ]

      const { result, rerender } = renderHook(({ clips }) => useTimelineClips(clips), {
        initialProps: { clips: serverClips },
      })

      // 元の順序を保存して並び替え
      const originalClips = [...result.current.clips]
      act(() => {
        result.current.reorderClips([originalClips[2], originalClips[1], originalClips[0]])
      })

      // ローカル並び順が設定された状態
      expect(result.current.clips[0].id).toBe('clip-3')
      expect(result.current.clips[1].id).toBe('clip-2')
      expect(result.current.clips[2].id).toBe('clip-1')

      // サーバーからclip-2が削除された場合
      const updatedServerClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1'),
        createMockClip('clip-3', 'クリップ3'),
      ]

      rerender({ clips: updatedServerClips })

      // サーバーデータが変更されたのでローカル並び順がリセットされ、サーバーの順序になる
      expect(result.current.clips).toHaveLength(2)
      expect(result.current.clips[0].id).toBe('clip-1')
      expect(result.current.clips[1].id).toBe('clip-3')
    })

    it('サーバーデータが変更されたとき、ローカル並び順がリセットされること', () => {
      const serverClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1'),
        createMockClip('clip-2', 'クリップ2'),
      ]

      const { result, rerender } = renderHook(({ clips }) => useTimelineClips(clips), {
        initialProps: { clips: serverClips },
      })

      // 元の順序を保存して並び替え
      const originalClips = [...result.current.clips]
      act(() => {
        result.current.reorderClips([originalClips[1], originalClips[0]])
      })

      // ローカル並び順が設定された状態
      expect(result.current.clips[0].id).toBe('clip-2')
      expect(result.current.clips[1].id).toBe('clip-1')

      // サーバーデータが更新された場合（同じクリップ、参照が変わる）
      const updatedServerClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1更新'),
        createMockClip('clip-2', 'クリップ2更新'),
      ]

      rerender({ clips: updatedServerClips })

      // サーバーデータが変更されたのでローカル並び順がリセットされ、サーバーの順序に戻る
      expect(result.current.clips[0].id).toBe('clip-1')
      expect(result.current.clips[1].id).toBe('clip-2')
    })

    it('サーバーに新しいクリップが追加されたとき、ローカル並び順がリセットされ新しいクリップも表示されること', () => {
      const serverClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1'),
        createMockClip('clip-2', 'クリップ2'),
      ]

      const { result, rerender } = renderHook(({ clips }) => useTimelineClips(clips), {
        initialProps: { clips: serverClips },
      })

      // 元の順序を保存して並び替え
      const originalClips = [...result.current.clips]
      act(() => {
        result.current.reorderClips([originalClips[1], originalClips[0]])
      })

      // サーバーに新しいクリップが追加された場合
      const updatedServerClips: ShowReelClip[] = [
        createMockClip('clip-1', 'クリップ1'),
        createMockClip('clip-2', 'クリップ2'),
        createMockClip('clip-3', 'クリップ3'),
      ]

      rerender({ clips: updatedServerClips })

      // サーバーデータが変更されたのでローカル並び順がリセットされ、新しいクリップも含めてサーバーの順序になる
      expect(result.current.clips).toHaveLength(3)
      expect(result.current.clips[0].id).toBe('clip-1')
      expect(result.current.clips[1].id).toBe('clip-2')
      expect(result.current.clips[2].id).toBe('clip-3')
    })
  })
})
