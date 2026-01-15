'use client'

import { modalVariants } from '../const'

import type { ModalFooterProps } from './type'

/**
 * モーダルのフッターコンポーネント
 * ボタン群を配置
 */
export const ModalFooter = ({ children, align = 'end', className }: ModalFooterProps) => {
  const { footer } = modalVariants({ footerAlign: align })

  return <div className={footer({ className })}>{children}</div>
}
