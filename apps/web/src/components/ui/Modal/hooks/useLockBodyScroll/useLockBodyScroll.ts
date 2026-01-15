'use client'

import { useEffect } from 'react'

/**
 * 背景スクロール無効化フック
 */
export const useLockBodyScroll = (lock: boolean) => {
  useEffect(() => {
    if (!lock) return

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = original
    }
  }, [lock])
}
