'use client'

import { useId } from 'react'

import type { FormFieldRadioGroupProps } from './type'

import { FormFieldContainer, FormFieldLabel } from '@/components/ui/FormField'
import { RadioGroup } from '@/components/ui/RadioGroup'

/**
 * FormFieldRadioGroup コンポーネント
 * ラベル付きのラジオボタングループ
 *
 * @example
 * ```tsx
 * <FormFieldRadioGroup
 *   label="プランを選択"
 *   name="plan"
 *   value={selected}
 *   onChange={setSelected}
 * >
 *   <RadioGroupItem value="free" label="無料プラン" />
 *   <RadioGroupItem value="pro" label="プロプラン" />
 * </FormFieldRadioGroup>
 *
 * <FormFieldRadioGroup
 *   label="お支払い方法"
 *   name="payment"
 *   required
 * >
 *   <RadioGroupItem value="card" label="クレジットカード" />
 *   <RadioGroupItem value="bank" label="銀行振込" />
 * </FormFieldRadioGroup>
 * ```
 */
export const FormFieldRadioGroup = ({
  gap,
  label,
  required,
  name,
  value,
  defaultValue,
  onChange,
  direction,
  size,
  disabled,
  children,
  className,
  id,
  ...props
}: FormFieldRadioGroupProps) => {
  const generatedId = useId()
  const groupId = id ?? generatedId

  return (
    <FormFieldContainer gap={gap}>
      {label && (
        <FormFieldLabel htmlFor={groupId} required={required}>
          {label}
        </FormFieldLabel>
      )}
      <RadioGroup
        id={groupId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        direction={direction}
        size={size}
        disabled={disabled}
        className={className}
        {...props}
      >
        {children}
      </RadioGroup>
    </FormFieldContainer>
  )
}

FormFieldRadioGroup.displayName = 'FormFieldRadioGroup'
