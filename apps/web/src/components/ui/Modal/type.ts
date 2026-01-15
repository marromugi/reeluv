import type { ReactNode } from 'react'

// サブコンポーネントの型を再エクスポート
export type { ModalBodyProps } from './ModalBody'
export type { ModalFooterAlign, ModalFooterProps } from './ModalFooter'
export type { ModalHeaderProps } from './ModalHeader'
export type { ModalOverlayProps } from './ModalOverlay'

/**
 * モーダルのサイズバリエーション
 */
export type ModalSize = 'sm' | 'md' | 'lg'

/**
 * Modal コンポーネントの Props
 */
export type ModalProps = {
  /** モーダルの開閉状態 */
  open: boolean
  /** 閉じる時のコールバック */
  onClose: () => void
  /** サイズバリアント（デフォルト: 'md'） */
  size?: ModalSize
  /** オーバーレイクリックで閉じるか（デフォルト: true） */
  closeOnOverlayClick?: boolean
  /** ESCキーで閉じるか（デフォルト: true） */
  closeOnEscape?: boolean
  /** 子要素 */
  children: ReactNode
  /** 追加のクラス名（モーダルコンテナ用） */
  className?: string
}

/**
 * Modal Context の値
 */
export type ModalContextValue = {
  /** 閉じるコールバック */
  onClose: () => void
  /** サイズ */
  size: ModalSize
  /** タイトルのid（aria-labelledby用） */
  titleId: string
}
