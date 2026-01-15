'use client'

import { createContext, useContext } from 'react'

import type { RadioGroupContextValue } from './type'

/**
 * RadioGroup のコンテキスト
 * RadioGroup と RadioGroupItem 間で状態を共有する
 */
export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

/**
 * RadioGroup コンテキストを取得するカスタムフック
 * RadioGroupItem 内でのみ使用可能
 *
 * @throws RadioGroup 外で使用された場合にエラーをスロー
 */
export const useRadioGroupContext = (): RadioGroupContextValue => {
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error('RadioGroupItem は RadioGroup 内で使用してください')
  }
  return context
}
