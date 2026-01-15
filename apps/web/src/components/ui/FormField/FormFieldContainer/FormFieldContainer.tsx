import { forwardRef } from 'react'

import { formFieldContainerVariants } from './const'
import type { FormFieldContainerProps } from './type'

/**
 * FormFieldContainer コンポーネント
 * フォームフィールド（ラベル + 入力要素）を垂直に配置するコンテナ
 *
 * @example
 * ```tsx
 * <FormFieldContainer>
 *   <FormFieldLabel htmlFor="email">メールアドレス</FormFieldLabel>
 *   <input id="email" type="email" />
 * </FormFieldContainer>
 *
 * <FormFieldContainer gap="lg">
 *   <FormFieldLabel htmlFor="message">メッセージ</FormFieldLabel>
 *   <textarea id="message" />
 * </FormFieldContainer>
 * ```
 */
export const FormFieldContainer = forwardRef<HTMLDivElement, FormFieldContainerProps>(
  ({ gap, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={formFieldContainerVariants({ gap, className })} {...props}>
        {children}
      </div>
    )
  }
)

FormFieldContainer.displayName = 'FormFieldContainer'
