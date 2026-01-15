'use client'

import { modalVariants } from '../const'
import { useModalContext } from '../ModalContext'

import type { ModalHeaderProps } from './type'

import { Close } from '@/components/icon/Close'
import { IconButton } from '@/components/ui/IconButton'

/**
 * モーダルのヘッダーコンポーネント
 * タイトルと閉じるボタンを表示
 */
export const ModalHeader = ({ title, showCloseButton = true, className }: ModalHeaderProps) => {
  const { onClose, titleId } = useModalContext()
  const { header, title: titleStyle } = modalVariants()

  return (
    <div className={header({ className })}>
      <h2 id={titleId} className={titleStyle()}>
        {title}
      </h2>
      {showCloseButton && (
        <IconButton
          icon={Close}
          variant="ghost"
          theme="secondary"
          size="md"
          onClick={onClose}
          aria-label="閉じる"
        />
      )}
    </div>
  )
}
