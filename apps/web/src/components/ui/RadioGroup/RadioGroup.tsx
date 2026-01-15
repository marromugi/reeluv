'use client'

import { useCallback, useState } from 'react'

import { radioGroupVariants } from './const'
import { RadioGroupContext } from './RadioGroupContext'
import type { RadioGroupProps } from './type'

// radioGroupVariants を再エクスポート
export { radioGroupVariants }

/**
 * RadioGroup コンポーネント
 * ラジオボタンのグループを管理するコンテナ
 *
 * @example
 * ```tsx
 * <RadioGroup name="plan" value={selected} onChange={setSelected}>
 *   <RadioGroupItem value="free" label="無料プラン" description="基本機能のみ" />
 *   <RadioGroupItem value="pro" label="プロプラン" description="全機能利用可能" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = ({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  direction = 'vertical',
  size = 'md',
  disabled = false,
  children,
  className,
  ...props
}: RadioGroupProps) => {
  // 非制御コンポーネントのための内部状態
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue)

  // 制御/非制御の判定
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    },
    [isControlled, onChange]
  )

  const contextValue = {
    name,
    value: currentValue,
    onChange: handleChange,
    size,
    disabled,
  }

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        role="radiogroup"
        aria-disabled={disabled}
        className={radioGroupVariants({ direction, className })}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}
