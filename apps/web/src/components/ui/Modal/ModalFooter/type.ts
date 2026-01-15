import type { ReactNode } from 'react'

/**
 * モーダルフッターのボタン配置
 */
export type ModalFooterAlign = 'start' | 'center' | 'end' | 'between'

/**
 * ModalFooter コンポーネントの Props
 */
export type ModalFooterProps = {
  /** 子要素（ボタン等） */
  children: ReactNode
  /** ボタンの配置（デフォルト: 'end'） */
  align?: ModalFooterAlign
  /** 追加のクラス名 */
  className?: string
}
