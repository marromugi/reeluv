'use client'

import { modalVariants } from '../const'

import type { ModalBodyProps } from './type'

/**
 * モーダルのボディコンポーネント
 * スクロール可能なコンテンツエリア
 */
export const ModalBody = ({ children, className }: ModalBodyProps) => {
  const { body } = modalVariants()

  return (
    <div className={body({ className })} tabIndex={0}>
      {children}
    </div>
  )
}
