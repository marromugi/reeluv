'use client'

import { createContext, useContext } from 'react'

import type { ModalContextValue } from './type'

/**
 * Modal のコンテキスト
 * Modal と Modal.Header/Body/Footer 間で状態を共有する
 */
export const ModalContext = createContext<ModalContextValue | null>(null)

/**
 * Modal コンテキストを取得するカスタムフック
 * Modal のサブコンポーネント内でのみ使用可能
 *
 * @throws Modal 外で使用された場合にエラーをスロー
 */
export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('Modal.Header/Body/Footer は Modal 内で使用してください')
  }
  return context
}
