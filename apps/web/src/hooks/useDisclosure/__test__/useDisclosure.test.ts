import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useDisclosure } from '../useDisclosure'

describe('useDisclosure', () => {
  it('初期状態がfalseであること', () => {
    const { result } = renderHook(() => useDisclosure())
    expect(result.current.isOpen).toBe(false)
  })

  it('初期状態をtrueに設定できること', () => {
    const { result } = renderHook(() => useDisclosure(true))
    expect(result.current.isOpen).toBe(true)
  })

  it('onOpenで開くことができること', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.onOpen()
    })

    expect(result.current.isOpen).toBe(true)
  })

  it('onCloseで閉じることができること', () => {
    const { result } = renderHook(() => useDisclosure(true))

    act(() => {
      result.current.onClose()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it('onToggleで開閉状態をトグルできること', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.onToggle()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.onToggle()
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('onChangeOpenで開閉状態を直接設定できること', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => {
      result.current.onChangeOpen(true)
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.onChangeOpen(false)
    })
    expect(result.current.isOpen).toBe(false)
  })
})
