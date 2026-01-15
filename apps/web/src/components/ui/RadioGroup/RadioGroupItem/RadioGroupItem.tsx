'use client'

import { motion } from 'motion/react'
import { useId, useState } from 'react'

import { useRadioGroupContext } from '../RadioGroupContext'

import { radioGroupItemVariants } from './const'
import type { RadioGroupItemProps } from './type'

/**
 * RadioGroupItem コンポーネント
 * 個別のラジオボタン項目
 *
 * @example
 * ```tsx
 * <RadioGroupItem
 *   value="option1"
 *   label="オプション1"
 *   description="このオプションの説明"
 * />
 * ```
 */
export const RadioGroupItem = ({
  value,
  label,
  description,
  disabled: itemDisabled,
  className,
  ...props
}: RadioGroupItemProps) => {
  const {
    name,
    value: groupValue,
    onChange,
    size,
    disabled: groupDisabled,
  } = useRadioGroupContext()
  const [isFocused, setIsFocused] = useState(false)

  const inputId = useId()
  const descriptionId = useId()

  const isChecked = groupValue === value
  const isDisabled = groupDisabled || itemDisabled

  const {
    container,
    indicator,
    innerCircle,
    label: labelStyles,
    description: descStyles,
  } = radioGroupItemVariants({ size, checked: isChecked, disabled: isDisabled, focused: isFocused })

  const handleChange = () => {
    if (!isDisabled) {
      onChange(value)
    }
  }

  return (
    <label className={container({ className })} htmlFor={inputId}>
      {/* 非表示のネイティブラジオボタン */}
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="sr-only"
        aria-describedby={description ? descriptionId : undefined}
        {...props}
      />

      {/* カスタムラジオインジケーター */}
      <span className={indicator()} aria-hidden="true">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: isChecked ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={innerCircle()}
        />
      </span>

      {/* ラベルと説明文 */}
      <span className="flex flex-col">
        <span className={labelStyles()}>{label}</span>
        {description && (
          <span id={descriptionId} className={descStyles()}>
            {description}
          </span>
        )}
      </span>
    </label>
  )
}
