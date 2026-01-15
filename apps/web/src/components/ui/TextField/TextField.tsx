import { forwardRef } from 'react'

import { textFieldVariants } from './const'
import type { TextFieldProps } from './type'

/**
 * TextField コンポーネント
 * テキスト入力用のinput要素をレンダリングする
 *
 * @example
 * ```tsx
 * <TextField
 *   placeholder="example@example.com"
 *   size="md"
 *   variant="outlined"
 * />
 * ```
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ size, variant, state, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        className={textFieldVariants({ size, variant, state, className })}
        {...props}
      />
    )
  }
)

TextField.displayName = 'TextField'
