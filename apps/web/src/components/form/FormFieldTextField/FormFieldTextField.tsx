import { forwardRef, useId } from 'react'

import type { FormFieldTextFieldProps } from './type'

import { FormFieldContainer, FormFieldLabel } from '@/components/ui/FormField'
import { TextField } from '@/components/ui/TextField'

/**
 * FormFieldTextField コンポーネント
 * ラベル付きのテキスト入力フィールド
 *
 * @example
 * ```tsx
 * <FormFieldTextField
 *   label="メールアドレス"
 *   placeholder="example@example.com"
 *   size="md"
 *   variant="outlined"
 * />
 *
 * <FormFieldTextField
 *   label="ユーザー名"
 *   required
 *   placeholder="ユーザー名を入力"
 * />
 * ```
 */
export const FormFieldTextField = forwardRef<HTMLInputElement, FormFieldTextFieldProps>(
  ({ size, variant, state, gap, label, required, className, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <FormFieldContainer gap={gap}>
        {label && (
          <FormFieldLabel htmlFor={inputId} required={required}>
            {label}
          </FormFieldLabel>
        )}
        <TextField
          ref={ref}
          id={inputId}
          size={size}
          variant={variant}
          state={state}
          className={className}
          {...props}
        />
      </FormFieldContainer>
    )
  }
)

FormFieldTextField.displayName = 'FormFieldTextField'
