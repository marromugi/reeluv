'use client'

import { useEffect } from 'react'

/**
 * フォーカストラップフック
 */
export const useFocusTrap = (ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) => {
  useEffect(() => {
    if (!enabled || !ref.current) return

    const element = ref.current
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusables = element.querySelectorAll<HTMLElement>(focusableSelectors)
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    // 初期フォーカス
    const firstFocusable = element.querySelector<HTMLElement>(focusableSelectors)
    firstFocusable?.focus()

    element.addEventListener('keydown', handleKeyDown)
    return () => element.removeEventListener('keydown', handleKeyDown)
  }, [ref, enabled])
}
