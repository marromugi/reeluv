import { useCallback, useState } from 'react'

type UseDisclosureReturn = {
  /** 開閉状態 */
  isOpen: boolean
  /** 開く */
  onOpen: () => void
  /** 閉じる */
  onClose: () => void
  /** トグル */
  onToggle: () => void
  /** 開閉状態を直接設定 */
  onChangeOpen: (isOpen: boolean) => void
}

/**
 * モーダルやドロワーなどの開閉状態を管理するフック
 *
 * @param initialState - 初期状態（デフォルト: false）
 * @returns 開閉状態と操作関数
 *
 * @example
 * ```tsx
 * const { isOpen, onOpen, onClose } = useDisclosure()
 *
 * return (
 *   <>
 *     <button onClick={onOpen}>開く</button>
 *     <Modal open={isOpen} onClose={onClose}>
 *       <p>モーダルの内容</p>
 *     </Modal>
 *   </>
 * )
 * ```
 */
export const useDisclosure = (initialState = false): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState(initialState)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const onChangeOpen = useCallback((value: boolean) => {
    setIsOpen(value)
  }, [])

  return { isOpen, onOpen, onClose, onToggle, onChangeOpen }
}
