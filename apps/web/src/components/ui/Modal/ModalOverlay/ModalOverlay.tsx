'use client'

import { motion } from 'motion/react'

import { modalVariants } from '../const'

/**
 * モーダルのオーバーレイ（背景）コンポーネント
 * フェードアニメーション付き
 */
export const ModalOverlay = () => {
  const { overlay } = modalVariants()

  return (
    <motion.div
      className={overlay()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-hidden="true"
    />
  )
}
