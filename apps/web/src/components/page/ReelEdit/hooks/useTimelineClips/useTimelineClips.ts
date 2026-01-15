'use client'

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'

import type { TimelineClipItem } from './type'
import { assignUids, reducer } from './util'

import type { ShowReelClip } from '@/client/api/model'

/**
 * タイムライン用のクリップ管理フック
 * サーバーから取得したクリップにユニークIDを付与し、並び替えを管理する
 */
export const useTimelineClips = (serverClips: ShowReelClip[]) => {
  const [state, dispatch] = useReducer(reducer, { localOrder: null })

  // サーバーデータにユニークIDを付与（メモ化）
  const serverClipsWithUid = useMemo(() => assignUids(serverClips), [serverClips])

  // サーバーに存在するクリップIDのセット
  const serverClipIds = useMemo(() => new Set(serverClips.map((c) => c.id)), [serverClips])

  // 初回マウント時をスキップするためのref
  const isFirstMount = useRef(true)

  // サーバーデータが変更されたらローカル並び順をリセット
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    dispatch({ type: 'reset' })
  }, [serverClipsWithUid])

  // ローカル並び順があればそれを使用
  // ローカル並び順がある場合、サーバーから削除されたクリップを除外する
  const clips = useMemo(() => {
    if (!state.localOrder) return serverClipsWithUid
    return state.localOrder.filter((clip) => serverClipIds.has(clip.id))
  }, [state.localOrder, serverClipsWithUid, serverClipIds])

  /** クリップの並び替え */
  const reorderClips = useCallback((newOrder: TimelineClipItem[]) => {
    dispatch({ type: 'reorder', clips: newOrder })
  }, [])

  /** ローカル状態をリセット（サーバーデータに戻す） */
  const resetOrder = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])

  return {
    clips,
    reorderClips,
    resetOrder,
  }
}
