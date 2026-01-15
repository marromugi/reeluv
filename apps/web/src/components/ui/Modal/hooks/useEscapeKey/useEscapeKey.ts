'use client'

import { useEffect } from 'react'

/**
 * モーダルスタック（最前面のモーダルを管理）
 */
const modalStack: Array<() => void> = []

/**
 * グローバルESCキーハンドラー（1つのみ）
 */
let globalEscapeHandler: ((e: KeyboardEvent) => void) | null = null

/**
 * グローバルESCキーハンドラーを設定
 */
const setupGlobalEscapeHandler = () => {
  if (globalEscapeHandler) return

  globalEscapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modalStack.length > 0) {
      // 最前面のモーダル（スタックの最後）のみ閉じる
      const topModal = modalStack[modalStack.length - 1]
      topModal()
    }
  }

  document.addEventListener('keydown', globalEscapeHandler)
}

/**
 * グローバルESCキーハンドラーを削除
 */
const teardownGlobalEscapeHandler = () => {
  if (modalStack.length === 0 && globalEscapeHandler) {
    document.removeEventListener('keydown', globalEscapeHandler)
    globalEscapeHandler = null
  }
}

/**
 * ESCキーで閉じるフック（スタック管理版）
 * 最前面のモーダルのみ ESC で閉じる
 */
export const useEscapeKey = (onClose: () => void, enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return

    // スタックに追加
    modalStack.push(onClose)
    setupGlobalEscapeHandler()

    return () => {
      // スタックから削除
      const index = modalStack.indexOf(onClose)
      if (index > -1) {
        modalStack.splice(index, 1)
      }
      teardownGlobalEscapeHandler()
    }
  }, [onClose, enabled])
}
