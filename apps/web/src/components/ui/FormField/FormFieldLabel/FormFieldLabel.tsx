import { forwardRef } from 'react'

import { formFieldLabelVariants } from './const'
import type { FormFieldLabelProps } from './type'

/**
 * FormFieldLabel コンポーネント
 * フォームフィールド用のラベル要素
 *
 * @example
 * ```tsx
 * <FormFieldLabel htmlFor="email">
 *   メールアドレス
 * </FormFieldLabel>
 *
 * <FormFieldLabel htmlFor="username" required>
 *   ユーザー名
 * </FormFieldLabel>
 * ```
 */
export const FormFieldLabel = forwardRef<HTMLLabelElement, FormFieldLabelProps>(
  ({ size, required, className, children, ...props }, ref) => {
    return (
      <label ref={ref} className={formFieldLabelVariants({ size, className })} {...props}>
        {children}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
    )
  }
)

FormFieldLabel.displayName = 'FormFieldLabel'
