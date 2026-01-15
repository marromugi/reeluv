'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import { modalVariants } from './const'
import { useEscapeKey, useFocusTrap, useLockBodyScroll } from './hooks'
import { ModalBody } from './ModalBody'
import { ModalContext } from './ModalContext'
import { ModalFooter } from './ModalFooter'
import { ModalHeader } from './ModalHeader'
import { ModalOverlay } from './ModalOverlay'
import type { ModalProps } from './type'

/**
 * Portal コンポーネント（クライアントサイドのみレンダリング）
 */
const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === 'undefined') return null
  return createPortal(children, document.body)
}

/**
 * Modal コンポーネント
 * 複合コンポーネントパターンで実装されたモーダルダイアログ
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onClose={handleClose} size="md">
 *   <Modal.Header title="タイトル" />
 *   <Modal.Body>コンテンツ</Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={handleClose}>閉じる</Button>
 *   </Modal.Footer>
 * </Modal>
 * ```
 */
const ModalRoot = ({
  open,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className,
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // カスタムフック
  useEscapeKey(onClose, open && closeOnEscape)
  useLockBodyScroll(open)
  useFocusTrap(contentRef, open)

  const { container, content } = modalVariants({ size })

  /**
   * コンテナクリック時のハンドラー
   * コンテンツ以外の領域（オーバーレイ）クリック時に閉じる
   */
  const handleContainerClick = (e: React.MouseEvent) => {
    // クリックされた要素がコンテナ自身の場合のみ閉じる（バブリング防止）
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <ModalPortal>
      <AnimatePresence>
        {open && (
          <ModalContext.Provider value={{ onClose, size, titleId }}>
            <ModalOverlay />
            <div
              className={container()}
              onClick={handleContainerClick}
              data-testid="modal-container"
            >
              <motion.div
                ref={contentRef}
                className={content({ className })}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: 'spring', stiffness: 400, damping: 30 },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: -10,
                  transition: { duration: 0.15 },
                }}
              >
                {children}
              </motion.div>
            </div>
          </ModalContext.Provider>
        )}
      </AnimatePresence>
    </ModalPortal>
  )
}

/**
 * Modal 複合コンポーネント
 */
export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
})
